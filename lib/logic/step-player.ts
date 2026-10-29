/**
 * Pure grading logic for the no-login Activities step player (redesign-plan.md,
 * build sequence item 3, 28 Oct 2026). Only `quizQuestion` blocks are auto-gradable
 * (mcq / true_false have a clear right answer); every other activity block type is
 * self-reported "done" and isn't part of the score, so a lesson with no quiz
 * questions in Activities always counts as passed.
 */

export const PASS_THRESHOLD = 0.7;
export const MAX_ATTEMPTS_BEFORE_REVEAL = 3;

export interface QuizOutcome {
  attempts: number;
  correct: boolean;
  /** True once the worked answer has been shown (3 wrong tries, no further attempts needed). */
  revealed: boolean;
}

/** Records one attempt at a quiz step. A correct attempt always resolves it; a wrong attempt
 *  reveals the worked answer once MAX_ATTEMPTS_BEFORE_REVEAL has been reached. */
export function recordQuizAttempt(prev: QuizOutcome | undefined, isCorrect: boolean): QuizOutcome {
  if (prev?.correct || prev?.revealed) return prev; // already resolved, ignore further attempts
  const attempts = (prev?.attempts ?? 0) + 1;
  if (isCorrect) return { attempts, correct: true, revealed: false };
  return { attempts, correct: false, revealed: attempts >= MAX_ATTEMPTS_BEFORE_REVEAL };
}

/** Whether a quiz step is resolved (so the player can move past it). */
export function quizStepResolved(outcome: QuizOutcome | undefined): boolean {
  return !!outcome && (outcome.correct || outcome.revealed);
}

/** Fraction of quiz steps answered correctly (not counting ones resolved only by reveal). */
export function activitiesScore(outcomes: (QuizOutcome | undefined)[]): number {
  if (outcomes.length === 0) return 1;
  const correct = outcomes.filter((o) => o?.correct).length;
  return correct / outcomes.length;
}

export function hasPassed(outcomes: (QuizOutcome | undefined)[]): boolean {
  return activitiesScore(outcomes) >= PASS_THRESHOLD;
}
