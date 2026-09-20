import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getClass, getLiveResponses, getLiveState } from "@/lib/db";
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
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const isTeacher = session.role === "teacher";
  const classId = isTeacher ? new URL(req.url).searchParams.get("classId") : session.classId;
  if (!classId) return NextResponse.json({ error: "no class" }, { status: 400 });

  const cls = await getClass(classId);
  if (!cls) return NextResponse.json({ error: "no class" }, { status: 404 });

  const state = await getLiveState(classId);
  const content = getCourseContent(cls.courseSlug);
  const found = state && content ? findLesson(content, state.lessonId) : undefined;
  if (!state || !found) return NextResponse.json({ active: false });

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
      myAnswer: session.username ? (responses[session.username] ?? null) : null,
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
