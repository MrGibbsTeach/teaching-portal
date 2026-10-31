"use client";

import { createContext, useContext, useEffect } from "react";

/**
 * Lets an interactive block tell the step player "the learner has finished me", so Next unlocks
 * from real work instead of a self-pressed "Done" button. Outside a step player it does nothing.
 */
export const StepDoneContext = createContext<(() => void) | null>(null);

/** Block types that report their own completion through useStepDone. */
export const SELF_COMPLETING = new Set([
  "sorter",
  "sequence",
  "branchingScenario",
  "placer",
  "flipCards",
  "fileSizeLab",
]);

/** Call from an interactive block: marks the step done once `complete` becomes true. */
export function useStepDone(complete: boolean) {
  const markDone = useContext(StepDoneContext);
  useEffect(() => {
    if (complete && markDone) markDone();
  }, [complete, markDone]);
}
