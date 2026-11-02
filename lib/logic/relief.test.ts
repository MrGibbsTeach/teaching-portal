import { describe, expect, it } from "vitest";
import {
  consecutiveLessonIds, isReliefExpired, isValidDate, lessonGlance, liveReliefLinks, makeReliefLink, reliefExpiry,
} from "./relief";
import type { Lesson } from "@/lib/content/types";

describe("relief links", () => {
  it("expires a day after the chosen date ends, in Perth time", () => {
    expect(reliefExpiry("2026-11-09")).toBe("2026-11-10T15:59:59.000Z");
  });

  it("is live before expiry and gone after", () => {
    const link = makeReliefLink(["a"], "2026-11-09", undefined, new Date("2026-11-02T00:00:00Z"), "tok");
    expect(isReliefExpired(link, new Date("2026-11-09T00:00:00Z"))).toBe(false);
    expect(isReliefExpired(link, new Date("2026-11-11T00:00:00Z"))).toBe(true);
    expect(liveReliefLinks([link], new Date("2026-11-11T00:00:00Z"))).toEqual([]);
  });

  it("trims and caps the summary, and omits it when blank", () => {
    expect(makeReliefLink(["a"], "2026-11-09", "   ").summary).toBeUndefined();
    expect(makeReliefLink(["a"], "2026-11-09", " hi ").summary).toBe("hi");
    expect(makeReliefLink(["a"], "2026-11-09", "x".repeat(5000)).summary).toHaveLength(1200);
  });

  it("makes long unguessable tokens", () => {
    const a = makeReliefLink(["a"], "2026-11-09", undefined);
    const b = makeReliefLink(["a"], "2026-11-09", undefined);
    expect(a.token).not.toBe(b.token);
    expect(a.token.length).toBeGreaterThanOrEqual(20);
  });

  it("validates dates", () => {
    expect(isValidDate("2026-11-09")).toBe(true);
    expect(isValidDate("9/11/2026")).toBe(false);
    expect(isValidDate("2026-13-45")).toBe(false);
  });

  it("picks consecutive lessons in course order", () => {
    const ids = ["l1", "l2", "l3", "l4"];
    expect(consecutiveLessonIds(ids, "l2", 2)).toEqual(["l2", "l3"]);
    expect(consecutiveLessonIds(ids, "l4", 3)).toEqual(["l4"]);
    expect(consecutiveLessonIds(ids, "nope", 2)).toEqual([]);
  });
});

describe("lessonGlance", () => {
  const lesson: Lesson = {
    id: "x",
    title: "Gantt charts",
    blocks: [
      { type: "heading", text: "The ticket" },
      { type: "paragraph", text: "A local charity needs a plan for its new video project and wants to see who does what and when." },
      { type: "keyTerm", term: "Gantt chart", definition: "A bar chart of tasks over time." },
      { type: "videoSlot", title: "Empty", brief: "tbc" },
      { type: "sorter", title: "Sort the considerations", categories: ["a", "b"], items: [] },
      { type: "quizQuestion", question: { questionType: "mcq", text: "What does a bar show?", options: ["A task", "A person"], correctIndex: 0 } },
      { type: "quizQuestion", question: { questionType: "extended", text: "Explain a dependency.", marks: 4, modelAnswer: "A task that cannot start until another finishes." } },
    ],
  };

  it("lists steps in order and skips empty video slots", () => {
    const g = lessonGlance(lesson);
    expect(g.steps.map((s) => s.kind)).toEqual(["Read", "Try it", "Check", "Write it"]);
    expect(g.totalMinutes).toBe(g.steps.reduce((n, s) => n + s.minutes, 0));
  });

  it("collects key terms, opening text and answers", () => {
    const g = lessonGlance(lesson);
    expect(g.keyTerms).toEqual([{ term: "Gantt chart", definition: "A bar chart of tasks over time." }]);
    expect(g.opening).toContain("local charity");
    expect(g.answers).toEqual([
      { question: "What does a bar show?", answer: "A task" },
      { question: "Explain a dependency.", answer: "A task that cannot start until another finishes.", marks: 4 },
    ]);
  });
});
