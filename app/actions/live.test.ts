import { beforeEach, describe, expect, it, vi } from "vitest";

// Integration test of the live-session loop: real actions, real API handler, real
// (in-memory) storage. Only the session and the server-only marker are stubbed.
vi.mock("server-only", () => ({}));
let session: Record<string, unknown> | null = null;
vi.mock("@/lib/session", () => ({ getSession: async () => session }));

import { saveClass } from "@/lib/db";
import { getCourseContent } from "@/lib/content";
import { liveSlides } from "@/lib/logic/live";
import { endLiveSession, setLiveRevealed, setLiveSlide, startLiveSession, submitLiveAnswer } from "./live";
import { GET } from "../api/live/route";

const CLASS_ID = "test-class";
const SLUG = "year-11-applied-it-general";
const teacher = { role: "teacher" };
const ann = { role: "student", classId: CLASS_ID, username: "ann", displayName: "Ann" };
const bob = { role: "student", classId: CLASS_ID, username: "bob", displayName: "Bob" };

// A lesson that has at least one mcq slide, found from real content.
const lesson = getCourseContent(SLUG)!.units
  .flatMap((u) => u.topics)
  .flatMap((t) => t.lessons)
  .find((l) => liveSlides(l).some((b) => b.type === "quizQuestion" && b.question.questionType === "mcq"))!;
const slides = liveSlides(lesson);
const quizIndex = slides.findIndex((b) => b.type === "quizQuestion" && b.question.questionType === "mcq");
const quiz = slides[quizIndex] as Extract<(typeof slides)[number], { type: "quizQuestion" }>;
const right = quiz.question.correctIndex!;
const wrong = (right + 1) % quiz.question.options!.length;

async function poll() {
  const res = await GET(new Request(`http://x/api/live?classId=${CLASS_ID}`));
  return { status: res.status, body: await res.json() };
}

beforeEach(async () => {
  session = teacher;
  await endLiveSession(CLASS_ID);
  await saveClass({
    id: CLASS_ID,
    name: "Test",
    courseSlug: SLUG,
    topicIds: [],
    students: [
      { username: "ann", displayName: "Ann", passcode: "p" },
      { username: "bob", displayName: "Bob", passcode: "p" },
    ],
    createdAt: new Date().toISOString(),
  });
});

describe("live session loop", () => {
  it("rejects unauthenticated polling", async () => {
    session = null;
    expect((await poll()).status).toBe(401);
  });

  it("reports inactive until a teacher starts", async () => {
    session = ann;
    expect((await poll()).body).toEqual({ active: false });
  });

  it("only teachers can control a session", async () => {
    session = ann;
    expect(await startLiveSession(CLASS_ID, lesson.id)).toEqual({ ok: false });
    session = teacher;
    expect(await startLiveSession(CLASS_ID, "no-such-lesson")).toEqual({ ok: false });
    expect(await startLiveSession(CLASS_ID, lesson.id)).toEqual({ ok: true });
    session = ann;
    expect(await setLiveSlide(CLASS_ID, 1)).toEqual({ ok: false });
    expect(await setLiveRevealed(CLASS_ID, true)).toEqual({ ok: false });
    expect(await endLiveSession(CLASS_ID)).toEqual({ ok: false });
    expect((await poll()).body.active).toBe(true); // still running
  });

  it("runs a question from slide to answers to reveal", async () => {
    await startLiveSession(CLASS_ID, lesson.id);
    await setLiveSlide(CLASS_ID, quizIndex);

    // Student poll: sees the question, but the answer is hidden.
    session = ann;
    let s = (await poll()).body;
    expect(s.slideIndex).toBe(quizIndex);
    expect(JSON.stringify(s.block)).not.toContain("correctIndex");
    expect(s.roster).toBeUndefined(); // students never get the roster or summary

    // Ann answers correctly, Bob wrongly.
    expect(await submitLiveAnswer(quizIndex, { choice: right })).toEqual({ ok: true });
    session = bob;
    expect(await submitLiveAnswer(quizIndex, { choice: wrong })).toEqual({ ok: true });

    // Teacher sees the full slide and the heatmap data.
    session = teacher;
    const t = (await poll()).body;
    expect(t.block.question.correctIndex).toBe(right);
    expect(t.summary.answered).toBe(2);
    expect(t.summary.correct).toBe(1);
    expect(t.summary.byStudent).toEqual({ ann: "correct", bob: "wrong" });
    expect(t.summary.counts[right]).toBe(1);

    // After reveal, students get the answer; moving on hides it again.
    await setLiveRevealed(CLASS_ID, true);
    session = ann;
    s = (await poll()).body;
    expect(s.block.question.correctIndex).toBe(right);
    expect(s.myAnswer).toEqual({ choice: right });
    session = teacher;
    await setLiveSlide(CLASS_ID, quizIndex === 0 ? 1 : 0);
    expect((await poll()).body.revealed).toBe(false);
  });

  it("drops answers for other slides, junk answers, and teacher submissions", async () => {
    await startLiveSession(CLASS_ID, lesson.id);
    await setLiveSlide(CLASS_ID, quizIndex);
    session = ann;
    expect(await submitLiveAnswer(quizIndex + 1, { choice: 0 })).toEqual({ ok: false }); // wrong slide
    expect(await submitLiveAnswer(quizIndex, { choice: -4 })).toEqual({ ok: false });
    expect(await submitLiveAnswer(quizIndex, "junk")).toEqual({ ok: false });
    session = teacher;
    expect(await submitLiveAnswer(quizIndex, { choice: 0 })).toEqual({ ok: false });
    expect((await poll()).body.summary.answered).toBe(0);
  });

  it("clamps out-of-range slides and ends cleanly", async () => {
    await startLiveSession(CLASS_ID, lesson.id);
    await setLiveSlide(CLASS_ID, 9999);
    expect((await poll()).body.slideIndex).toBe(slides.length - 1);
    await endLiveSession(CLASS_ID);
    expect((await poll()).body).toEqual({ active: false });
  });
});

describe("restarting a lesson", () => {
  it("does not show answers from an earlier session", async () => {
    await startLiveSession(CLASS_ID, lesson.id);
    await setLiveSlide(CLASS_ID, quizIndex);
    session = ann;
    await submitLiveAnswer(quizIndex, { choice: right });
    session = teacher;
    expect((await poll()).body.summary.answered).toBe(1);
    await endLiveSession(CLASS_ID);
    await new Promise((r) => setTimeout(r, 5)); // distinct start time
    await startLiveSession(CLASS_ID, lesson.id);
    await setLiveSlide(CLASS_ID, quizIndex);
    expect((await poll()).body.summary.answered).toBe(0);
  });
});
