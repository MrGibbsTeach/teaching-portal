import { describe, expect, it } from "vitest";
import type { Block, Lesson } from "@/lib/content/types";
import { clampSlide, correctChoice, liveSlides, parseAnswer, redactForStudent, summarizeSlide } from "./live";

const mcq: Block = {
  type: "quizQuestion",
  question: { questionType: "mcq", text: "Q", options: ["a", "b", "c"], correctIndex: 1, explanation: "because" },
};
const tf: Block = { type: "quizQuestion", question: { questionType: "true_false", text: "T", correctAnswer: false } };

describe("live slides", () => {
  it("drops dividers and clamps the slide index", () => {
    const lesson: Lesson = { id: "l", title: "l", blocks: [{ type: "paragraph", text: "x" }, { type: "divider" }, mcq] };
    expect(liveSlides(lesson)).toHaveLength(2);
    expect(clampSlide(5, 2)).toBe(1);
    expect(clampSlide(-3, 2)).toBe(0);
    expect(clampSlide(Number.NaN, 2)).toBe(0);
    expect(clampSlide(1, 0)).toBe(0);
  });
});

describe("answers", () => {
  it("finds the correct choice for mcq and true/false only", () => {
    expect(correctChoice(mcq)).toBe(1);
    expect(correctChoice(tf)).toBe(1); // "False" is option 1
    expect(correctChoice({ type: "paragraph", text: "x" })).toBeUndefined();
  });

  it("hides the answer from students until revealed", () => {
    const hidden = redactForStudent(mcq, false);
    expect(JSON.stringify(hidden)).not.toContain("correctIndex");
    expect(JSON.stringify(hidden)).not.toContain("because");
    expect(redactForStudent(mcq, true)).toEqual(mcq);
    expect(JSON.stringify(redactForStudent(tf, false))).not.toContain("correctAnswer");
  });

  it("validates untrusted answers", () => {
    expect(parseAnswer({ choice: 2 })).toEqual({ choice: 2 });
    expect(parseAnswer({ choice: -1 })).toBeNull();
    expect(parseAnswer({ choice: 1.5 })).toBeNull();
    expect(parseAnswer({ score: 7 })).toEqual({ score: 1 });
    expect(parseAnswer("x")).toBeNull();
    expect(parseAnswer(null)).toBeNull();
  });
});

describe("summarizeSlide", () => {
  it("builds counts and per-student status", () => {
    const s = summarizeSlide(mcq, { ann: { choice: 1 }, bob: { choice: 0 }, cy: { choice: 1 } }, ["ann", "bob", "cy", "dee"]);
    expect(s.counts).toEqual([1, 2, 0]);
    expect(s.answered).toBe(3);
    expect(s.correct).toBe(2);
    expect(s.byStudent).toEqual({ ann: "correct", bob: "wrong", cy: "correct", dee: "none" });
  });

  it("ignores out-of-range choices and treats code scores as pass/fail", () => {
    const s = summarizeSlide(mcq, { ann: { choice: 9 } }, ["ann"]);
    expect(s.counts).toEqual([0, 0, 0]);
    const code = summarizeSlide({ type: "paragraph", text: "x" }, { ann: { score: 1 }, bob: { score: 0.5 } }, ["ann", "bob"]);
    expect(code.byStudent).toEqual({ ann: "correct", bob: "wrong" });
  });
});
