import { beforeEach, describe, expect, it, vi } from "vitest";

// Integration test of feedback + quiz logging with the real actions and (in-memory) storage.
// Only the session, the server-only marker and Next's cache revalidation are stubbed.
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
let session: Record<string, unknown> | null = null;
vi.mock("@/lib/session", () => ({ getSession: async () => session }));

import { getFeedback, getQuizStats } from "@/lib/db";
import { getCourseContent } from "@/lib/content";
import { hardestQuestions, mergeStats, questionKey } from "@/lib/logic/insights";
import { recordQuizAnswer, resolveFeedback, submitFeedback } from "./insights";

const SLUG = "year-11-applied-it-general";
const student = { role: "student", classId: "class-a", username: "ann", displayName: "Ann" };
const teacher = { role: "teacher" };

const content = getCourseContent(SLUG)!;
const lesson = content.units
  .flatMap((u) => u.topics)
  .flatMap((t) => t.lessons)
  .find((l) => l.blocks.some((b) => b.type === "quizQuestion" && b.question.questionType === "mcq"))!;
const quiz = lesson.blocks.find(
  (b) => b.type === "quizQuestion" && b.question.questionType === "mcq",
) as Extract<(typeof lesson.blocks)[number], { type: "quizQuestion" }>;
const right = quiz.question.correctIndex!;
const wrong = (right + 1) % quiz.question.options!.length;

beforeEach(() => {
  session = student;
});

describe("recordQuizAnswer", () => {
  it("counts a student's answer, deciding right/wrong from the real answer", async () => {
    const stats = async () => (await getQuizStats("class-a")) as Record<string, number>;
    const key = questionKey(lesson.id, quiz.question.text);
    const before = await stats();

    // The client claims `correct: true` for a wrong pick; the server must not believe it.
    expect(await recordQuizAnswer(SLUG, lesson.id, quiz.question.text, wrong, true)).toEqual({ ok: true });
    expect(await recordQuizAnswer(SLUG, lesson.id, quiz.question.text, right, false)).toEqual({ ok: true });

    const after = await stats();
    expect((after[`${key}:w`] ?? 0) - (before[`${key}:w`] ?? 0)).toBe(1);
    expect((after[`${key}:r`] ?? 0) - (before[`${key}:r`] ?? 0)).toBe(1);
    expect((after[`${key}:o${wrong}`] ?? 0) - (before[`${key}:o${wrong}`] ?? 0)).toBe(1);
  });

  it("feeds the hardest-questions report", async () => {
    for (let i = 0; i < 3; i++) await recordQuizAnswer(SLUG, lesson.id, quiz.question.text, wrong, false);
    const rows = hardestQuestions([content], mergeStats([await getQuizStats("class-a")]));
    const row = rows.find((r) => r.text === quiz.question.text)!;
    expect(row.commonWrongAnswer).toBe(quiz.question.options![wrong]);
    expect(row.correctRate).toBeLessThan(1);
  });

  it("ignores teachers, logged-out users, made-up questions and bad indexes", async () => {
    const before = JSON.stringify(await getQuizStats("class-a"));
    session = teacher;
    expect(await recordQuizAnswer(SLUG, lesson.id, quiz.question.text, right, true)).toEqual({ ok: false });
    session = null;
    expect(await recordQuizAnswer(SLUG, lesson.id, quiz.question.text, right, true)).toEqual({ ok: false });
    session = student;
    expect(await recordQuizAnswer(SLUG, lesson.id, "a question that does not exist", 0, true)).toEqual({ ok: false });
    expect(await recordQuizAnswer(SLUG, "no-such-lesson", quiz.question.text, 0, true)).toEqual({ ok: false });
    expect(await recordQuizAnswer(SLUG, lesson.id, quiz.question.text, -1, true)).toEqual({ ok: false });
    expect(await recordQuizAnswer(SLUG, lesson.id, quiz.question.text, 9999, true)).toEqual({ ok: false });
    expect(JSON.stringify(await getQuizStats("class-a"))).toBe(before);
  });
});

describe("feedback notes", () => {
  it("saves a student's note with who, where and what", async () => {
    expect(await submitFeedback(SLUG, lesson.id, "confusing", "  I do not get step 2  ")).toEqual({ ok: true });
    const item = (await getFeedback()).find((f) => f.note === "I do not get step 2")!;
    expect(item).toMatchObject({
      role: "student",
      classId: "class-a",
      username: "ann",
      courseSlug: SLUG,
      lessonId: lesson.id,
      category: "confusing",
    });
  });

  it("lets a teacher send a note too, and allows an empty note", async () => {
    session = teacher;
    expect(await submitFeedback(SLUG, lesson.id, "mistake", "")).toEqual({ ok: true });
    const items = await getFeedback();
    expect(items.some((f) => f.role === "teacher" && f.category === "mistake" && f.note === "")).toBe(true);
  });

  it("rejects bad input and logged-out users", async () => {
    const count = (await getFeedback()).length;
    expect(await submitFeedback(SLUG, lesson.id, "spam", "x")).toEqual({ ok: false });
    expect(await submitFeedback("not-a-course", lesson.id, "other", "x")).toEqual({ ok: false });
    expect(await submitFeedback(SLUG, "no-such-lesson", "other", "x")).toEqual({ ok: false });
    session = null;
    expect(await submitFeedback(SLUG, lesson.id, "other", "x")).toEqual({ ok: false });
    expect((await getFeedback()).length).toBe(count);
  });

  it("only teachers can resolve a note", async () => {
    await submitFeedback(SLUG, lesson.id, "broken", "resolve me");
    const id = (await getFeedback()).find((f) => f.note === "resolve me")!.id;
    expect(await resolveFeedback(id)).toEqual({ ok: false }); // still a student
    expect((await getFeedback()).some((f) => f.id === id)).toBe(true);
    session = teacher;
    expect(await resolveFeedback(id)).toEqual({ ok: true });
    expect((await getFeedback()).some((f) => f.id === id)).toBe(false);
  });
});
