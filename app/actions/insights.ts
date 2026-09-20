"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { deleteFeedback, recordQuizStats, saveFeedback } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { findLesson, getCourseContent } from "@/lib/content";
import { parseFeedback, questionKey, statFields, type FeedbackItem } from "@/lib/logic/insights";

// These actions return a result instead of redirecting: they are called from buttons inside
// lessons, where bouncing the student to a login page mid-lesson would be worse than a quiet no-op.

/** A student answered a quiz question. Teachers previewing a lesson are not counted. */
export async function recordQuizAnswer(
  courseSlug: string,
  lessonId: string,
  questionText: string,
  chosen: number,
  correct: boolean
): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (session?.role !== "student" || !session.classId) return { ok: false };
  if (!Number.isInteger(chosen) || chosen < 0 || chosen > 49) return { ok: false };

  // Only record questions that really exist in that lesson, so the counters cannot be spammed
  // with arbitrary keys. The result is checked against the real answer, not the client's claim.
  const content = getCourseContent(courseSlug);
  const found = content && findLesson(content, lessonId);
  const block = found?.lesson.blocks.find((b) => b.type === "quizQuestion" && b.question.text === questionText);
  if (!block || block.type !== "quizQuestion") return { ok: false };
  const q = block.question;
  const right = q.questionType === "true_false" ? (q.correctAnswer === undefined ? undefined : q.correctAnswer ? 0 : 1) : q.correctIndex;
  if (right === undefined) return { ok: false };
  void correct; // untrusted: derive it from the real answer instead

  await recordQuizStats(session.classId, statFields(questionKey(lessonId, questionText), chosen, chosen === right));
  return { ok: true };
}

/** "Something wrong?" from any lesson. Students and teachers can both send notes. */
export async function submitFeedback(
  courseSlug: string,
  lessonId: string,
  category: string,
  note: string
): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  const parsed = parseFeedback({ category, note });
  if (!parsed || !getCourseBySlug(courseSlug)) return { ok: false };
  const content = getCourseContent(courseSlug);
  if (!content || !findLesson(content, lessonId)) return { ok: false };

  const item: FeedbackItem = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    ts: new Date().toISOString(),
    role: session.role === "teacher" ? "teacher" : "student",
    classId: session.classId,
    username: session.username,
    displayName: session.displayName,
    courseSlug,
    lessonId,
    ...parsed,
  };
  await saveFeedback(item);
  return { ok: true };
}

/** Teacher marks a note as dealt with. */
export async function resolveFeedback(id: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (session?.role !== "teacher") return { ok: false };
  await deleteFeedback(id);
  revalidatePath("/teacher/insights");
  return { ok: true };
}
