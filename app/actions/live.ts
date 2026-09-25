"use server";
import { getSession } from "@/lib/session";
import { getClass, getLiveState, setLiveState, clearLiveState, submitLiveResponse } from "@/lib/db";
import { findLesson, getCourseContent } from "@/lib/content";
import { clampSlide, liveSlides, parseAnswer } from "@/lib/logic/live";

// Actions return instead of redirecting: they are called from polling client components,
// where a redirect would be a confusing failure mode.
async function requireTeacherClass(classId: string) {
  const session = await getSession();
  if (session?.role !== "teacher") return null;
  return getClass(classId);
}

export async function startLiveSession(classId: string, lessonId: string): Promise<{ ok: boolean }> {
  const cls = await requireTeacherClass(classId);
  const content = cls && getCourseContent(cls.courseSlug);
  if (!cls || !content || !findLesson(content, lessonId)) return { ok: false };
  await setLiveState(classId, { lessonId, slideIndex: 0, revealed: false, startedAt: new Date().toISOString() });
  return { ok: true };
}

export async function setLiveSlide(classId: string, slideIndex: number): Promise<{ ok: boolean }> {
  const cls = await requireTeacherClass(classId);
  const state = cls && (await getLiveState(classId));
  const content = cls && getCourseContent(cls.courseSlug);
  const found = state && content && findLesson(content, state.lessonId);
  if (!cls || !state || !found) return { ok: false };
  // Moving to another slide hides the previous slide's answer reveal.
  await setLiveState(classId, {
    ...state,
    slideIndex: clampSlide(slideIndex, liveSlides(found.lesson).length),
    revealed: false,
  });
  return { ok: true };
}

export async function setLiveRevealed(classId: string, revealed: boolean): Promise<{ ok: boolean }> {
  const cls = await requireTeacherClass(classId);
  const state = cls && (await getLiveState(classId));
  if (!cls || !state) return { ok: false };
  await setLiveState(classId, { ...state, revealed });
  return { ok: true };
}

export async function endLiveSession(classId: string): Promise<{ ok: boolean }> {
  const cls = await requireTeacherClass(classId);
  if (!cls) return { ok: false };
  await clearLiveState(classId);
  return { ok: true };
}

/** A student answers the slide the teacher is currently on. */
export async function submitLiveAnswer(slideIndex: number, value: unknown): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (session?.role !== "student" || !session.classId || !session.username) return { ok: false };
  const state = await getLiveState(session.classId);
  const answer = parseAnswer(value);
  // Only the slide the teacher is on can be answered, so late or replayed answers are dropped.
  if (!state || !answer || state.slideIndex !== slideIndex) return { ok: false };
  await submitLiveResponse(session.classId, state.startedAt, slideIndex, session.username, answer);
  return { ok: true };
}
