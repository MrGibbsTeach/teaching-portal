import type { Block } from "./types";

/** The two parts a released lesson is split into (redesign decision, 28 Oct 2026). */
export type LessonPart = "content" | "activities";

/**
 * Which part a block falls into by default, based on its type.
 *
 * Existing lesson JSON was written before the Content/Activities split, so
 * nothing needs re-tagging: every block classifies itself by type.
 * Interactive/graded block types go to Activities; everything else
 * (explanation, reference, worked examples) goes to Content.
 *
 * If a lesson needs a specific block moved to the other part later, add an
 * explicit per-block override then (a `part` field on `Block`) rather than
 * building that mechanism now with nothing yet to use it.
 */
export function blockPart(type: Block["type"]): LessonPart {
  switch (type) {
    case "quizQuestion":
    case "activity":
    case "codeExercise":
    case "interactiveDiagram":
    case "scenarioChallenge":
    case "spotTheThreat":
    case "checkpointVideo":
    case "flipCards":
    case "sorter":
    case "sequence":
    case "branchingScenario":
    case "placer":
    case "fileSizeLab":
      return "activities";
    default:
      return "content";
  }
}

export function splitBlocksByPart(blocks: Block[]): { content: Block[]; activities: Block[] } {
  const content: Block[] = [];
  const activities: Block[] = [];
  for (const b of blocks) {
    (blockPart(b.type) === "activities" ? activities : content).push(b);
  }
  return { content, activities };
}
