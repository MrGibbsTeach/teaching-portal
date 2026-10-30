import { describe, expect, it } from "vitest";
import type { Block } from "./types";
import { blockPart, splitBlocksByPart } from "./parts";

describe("blockPart", () => {
  it("sends interactive and graded block types to activities", () => {
    for (const type of [
      "quizQuestion", "activity", "codeExercise", "interactiveDiagram",
      "scenarioChallenge", "spotTheThreat", "checkpointVideo",
      "flipCards", "sorter", "sequence", "branchingScenario", "placer",
    ] as const) {
      expect(blockPart(type)).toBe("activities");
    }
  });

  it("sends everything else to content", () => {
    for (const type of ["heading", "paragraph", "richText", "video", "table", "task"] as const) {
      expect(blockPart(type)).toBe("content");
    }
  });
});

describe("splitBlocksByPart", () => {
  it("splits a lesson's blocks into content and activities, preserving order", () => {
    const blocks: Block[] = [
      { type: "heading", text: "Intro" },
      { type: "paragraph", text: "..." },
      { type: "quizQuestion", question: { questionType: "true_false", text: "Q", correctAnswer: true } },
      { type: "divider" },
      { type: "activity", title: "Match it" },
    ];
    const { content, activities } = splitBlocksByPart(blocks);
    expect(content.map((b) => b.type)).toEqual(["heading", "paragraph", "divider"]);
    expect(activities.map((b) => b.type)).toEqual(["quizQuestion", "activity"]);
  });
});
