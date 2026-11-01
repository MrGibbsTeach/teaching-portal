import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getClass, getClassByCode, getLiveResponses, getLiveState } from "@/lib/db";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { findLesson, getCourseContent } from "@/lib/content";
import { liveSlides, redactForStudent, slideLabel, summarizeSlide, clampSlide } from "@/lib/logic/live";

export const dynamic = "force-dynamic";

/**
 * Polled every couple of seconds by the live views.
 * The proxy does not guard /api, so the session is checked here:
 *  - students get their own class's current slide (answers removed until revealed)
 *  - teachers (with ?classId=) also get the full slide, slide list and response summary
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const session = await getSession();
  const code = url.searchParams.get("code");
  const statusOnly = url.searchParams.get("status") === "1";

  // No-login classes (code track) have no session: they are identified by the class code,
  // which only ever exposes a redacted student view of the current slide.
  let anonymousCls = null;
  if (!session) {
    const normalized = code ? normalizeClassCode(code) : "";
    anonymousCls = normalized && !isReservedCode(normalized) ? await getClassByCode(normalized) : null;
    if (!anonymousCls || anonymousCls.authMode !== "code") {
      return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    }
  }

  const isTeacher = session?.role === "teacher";
  const classId = anonymousCls
    ? anonymousCls.id
    : isTeacher
      ? url.searchParams.get("classId")
      : session?.classId;
  if (!classId) return NextResponse.json({ error: "no class" }, { status: 400 });

  const cls = anonymousCls ?? (await getClass(classId));
  if (!cls) return NextResponse.json({ error: "no class" }, { status: 404 });

  const state = await getLiveState(classId);
  const content = getCourseContent(cls.courseSlug);
  const found = state && content ? findLesson(content, state.lessonId) : undefined;
  if (!state || !found) return NextResponse.json({ active: false });
  // Lightweight check used by the "Live now" button on class homepages.
  if (statusOnly) return NextResponse.json({ active: true, lessonTitle: found.lesson.title });

  const slides = liveSlides(found.lesson);
  const slideIndex = clampSlide(state.slideIndex, slides.length);
  const block = slides[slideIndex];
  const responses = await getLiveResponses(classId, state.startedAt, slideIndex);

  const base = {
    active: true,
    courseSlug: cls.courseSlug,
    lessonTitle: found.lesson.title,
    slideIndex,
    slideCount: slides.length,
    revealed: state.revealed,
  };

  if (!isTeacher) {
    return NextResponse.json({
      ...base,
      block: redactForStudent(block, state.revealed),
      myAnswer: session?.username ? (responses[session.username] ?? null) : null,
    });
  }

  const roster = cls.students.map((s) => ({ username: s.username, displayName: s.displayName }));
  return NextResponse.json({
    ...base,
    block,
    slides: slides.map((b, i) => ({ index: i, label: slideLabel(b) })),
    roster,
    summary: summarizeSlide(block, responses, roster.map((r) => r.username)),
  });
}
