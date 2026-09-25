import { describe, expect, it } from "vitest";
import type { CourseContent } from "@/lib/content/types";
import { hardestQuestions, mergeStats, parseFeedback, questionKey, statFields } from "./insights";

describe("questionKey", () => {
  it("is stable per text and differs between questions and lessons", () => {
    expect(questionKey("l1", "What is RAM?")).toBe(questionKey("l1", "What is RAM?"));
    expect(questionKey("l1", "What is RAM?")).not.toBe(questionKey("l1", "What is ROM?"));
    expect(questionKey("l1", "What is RAM?")).not.toBe(questionKey("l2", "What is RAM?"));
  });
});

describe("statFields + mergeStats", () => {
  it("names the right and wrong fields with the option picked", () => {
    expect(statFields("k", 2, false)).toEqual(["k:w", "k:o2"]);
    expect(statFields("k", 0, true)).toEqual(["k:r", "k:o0"]);
  });

  it("merges counts across classes", () => {
    const k = questionKey("l1", "Q");
    const a = { [`${k}:r`]: 2, [`${k}:o0`]: 2, [`${k}:w`]: 1, [`${k}:o2`]: 1 };
    const b = { [`${k}:r`]: 1, [`${k}:o0`]: 1 };
    const s = mergeStats([a, b]).get(k)!;
    expect(s).toMatchObject({ right: 3, wrong: 1, attempts: 4, picks: { 0: 3, 2: 1 } });
  });

  it("ignores malformed fields", () => {
    expect(mergeStats([{ nope: 1, "x:zz": 5, "x:r": "abc" }]).size).toBe(0);
  });
});

describe("hardestQuestions", () => {
  const course: CourseContent = {
    slug: "c",
    title: "C",
    units: [
      {
        id: "u",
        title: "U",
        status: "available",
        topics: [
          {
            id: "t",
            title: "T",
            lessons: [
              {
                id: "l1",
                title: "Lesson 1",
                blocks: [
                  { type: "quizQuestion", question: { questionType: "mcq", text: "Hard one", options: ["a", "b", "c"], correctIndex: 1 } },
                  { type: "quizQuestion", question: { questionType: "true_false", text: "Easy one", correctAnswer: true } },
                  { type: "quizQuestion", question: { questionType: "mcq", text: "Barely tried", options: ["a", "b"], correctIndex: 0 } },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const kHard = questionKey("l1", "Hard one");
  const kEasy = questionKey("l1", "Easy one");
  const kFew = questionKey("l1", "Barely tried");

  it("ranks hardest first, names the common wrong answer, and skips thin data", () => {
    const stats = mergeStats([
      {
        [`${kHard}:r`]: 1, [`${kHard}:w`]: 4, [`${kHard}:o1`]: 1, [`${kHard}:o2`]: 3, [`${kHard}:o0`]: 1,
        [`${kEasy}:r`]: 5, [`${kEasy}:o0`]: 5,
        [`${kFew}:w`]: 1, [`${kFew}:o1`]: 1,
      },
    ]);
    const rows = hardestQuestions([course], stats);
    expect(rows.map((r) => r.text)).toEqual(["Hard one", "Easy one"]);
    expect(rows[0]).toMatchObject({ attempts: 5, correctRate: 0.2, commonWrongAnswer: "c", commonWrongCount: 3, lessonTitle: "Lesson 1" });
    expect(rows[1].commonWrongAnswer).toBeUndefined();
  });
});

describe("parseFeedback", () => {
  it("accepts known categories, trims and caps notes", () => {
    expect(parseFeedback({ category: "mistake", note: "  typo  " })).toEqual({ category: "mistake", note: "typo" });
    expect(parseFeedback({ category: "broken", note: "x".repeat(5000) })!.note).toHaveLength(1000);
    expect(parseFeedback({ category: "confusing", note: undefined })).toEqual({ category: "confusing", note: "" });
  });
  it("rejects unknown categories", () => {
    expect(parseFeedback({ category: "spam", note: "x" })).toBeNull();
    expect(parseFeedback({ category: 7, note: "x" })).toBeNull();
  });
});
