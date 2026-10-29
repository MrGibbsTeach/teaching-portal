import { describe, expect, it } from "vitest";
import {
  activitiesScore,
  hasPassed,
  recordQuizAttempt,
  quizStepResolved,
  type QuizOutcome,
} from "./step-player";

describe("recordQuizAttempt", () => {
  it("resolves immediately on a correct attempt", () => {
    const o = recordQuizAttempt(undefined, true);
    expect(o).toEqual({ attempts: 1, correct: true, revealed: false });
    expect(quizStepResolved(o)).toBe(true);
  });

  it("does not reveal before 3 wrong attempts", () => {
    let o: QuizOutcome | undefined;
    o = recordQuizAttempt(o, false);
    expect(quizStepResolved(o)).toBe(false);
    o = recordQuizAttempt(o, false);
    expect(quizStepResolved(o)).toBe(false);
  });

  it("reveals the worked answer on the 3rd wrong attempt", () => {
    let o: QuizOutcome | undefined;
    o = recordQuizAttempt(o, false);
    o = recordQuizAttempt(o, false);
    o = recordQuizAttempt(o, false);
    expect(o).toEqual({ attempts: 3, correct: false, revealed: true });
    expect(quizStepResolved(o)).toBe(true);
  });

  it("ignores further attempts once resolved", () => {
    let o: QuizOutcome | undefined = recordQuizAttempt(undefined, true);
    o = recordQuizAttempt(o, false);
    expect(o).toEqual({ attempts: 1, correct: true, revealed: false });
  });
});

describe("activitiesScore / hasPassed", () => {
  it("counts a lesson with no quiz steps as fully passed", () => {
    expect(activitiesScore([])).toBe(1);
    expect(hasPassed([])).toBe(true);
  });

  it("scores only correct-on-the-day answers, not revealed ones", () => {
    const outcomes: QuizOutcome[] = [
      { attempts: 1, correct: true, revealed: false },
      { attempts: 3, correct: false, revealed: true },
      { attempts: 2, correct: true, revealed: false },
      { attempts: 1, correct: true, revealed: false },
    ];
    expect(activitiesScore(outcomes)).toBe(0.75);
    expect(hasPassed(outcomes)).toBe(true);
  });

  it("fails below the 70% threshold", () => {
    const outcomes: QuizOutcome[] = [
      { attempts: 1, correct: true, revealed: false },
      { attempts: 3, correct: false, revealed: true },
      { attempts: 3, correct: false, revealed: true },
    ];
    expect(activitiesScore(outcomes)).toBeCloseTo(0.333, 2);
    expect(hasPassed(outcomes)).toBe(false);
  });
});
