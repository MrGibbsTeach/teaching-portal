"use client";

import { useMemo, useState } from "react";
import type { Block } from "@/lib/content/types";
import { splitBlocksByPart } from "@/lib/content/parts";
import {
  activitiesScore,
  hasPassed,
  recordQuizAttempt,
  quizStepResolved,
  type QuizOutcome,
} from "@/lib/logic/step-player";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { markLessonComplete } from "@/lib/local-progress";

type Tab = "content" | "activities";

function isGradableQuiz(block: Block): block is Block & { type: "quizQuestion" } {
  return (
    block.type === "quizQuestion" &&
    (block.question.questionType === "mcq" || block.question.questionType === "true_false")
  );
}

function QuizStep({
  block,
  outcome,
  onAttempt,
}: {
  block: Block & { type: "quizQuestion" };
  outcome: QuizOutcome | undefined;
  onAttempt: (correct: boolean) => void;
}) {
  const q = block.question;
  const resolved = quizStepResolved(outcome);
  const [picked, setPicked] = useState<number | boolean | null>(null);

  function pick(value: number | boolean, isCorrect: boolean) {
    if (resolved) return;
    setPicked(value);
    onAttempt(isCorrect);
  }

  return (
    <div>
      <p className="font-medium text-lg">{q.text}</p>
      {q.questionType === "mcq" && q.options && (
        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isPicked = picked === i;
            const show = resolved || isPicked;
            return (
              <button
                key={i}
                type="button"
                disabled={resolved}
                onClick={() => pick(i, isCorrect)}
                className={`flex w-full items-center justify-between border px-4 py-2.5 text-left text-sm transition-colors ${
                  show && isCorrect
                    ? "border-primary bg-primary/5 font-medium text-primary"
                    : show && isPicked
                      ? "border-destructive text-destructive"
                      : "border-border hover:bg-accent/40"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
      {q.questionType === "true_false" && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[true, false].map((val) => {
            const isCorrect = val === q.correctAnswer;
            const isPicked = picked === val;
            const show = resolved || isPicked;
            return (
              <button
                key={String(val)}
                type="button"
                disabled={resolved}
                onClick={() => pick(val, isCorrect)}
                className={`border py-3 font-medium transition-colors ${
                  show && isCorrect
                    ? "border-primary bg-primary/5 text-primary"
                    : show && isPicked
                      ? "border-destructive text-destructive"
                      : "border-border hover:bg-accent/40"
                }`}
              >
                {val ? "True" : "False"}
              </button>
            );
          })}
        </div>
      )}

      {!resolved && outcome && outcome.attempts > 0 && (
        <p className="mt-3 text-sm text-destructive">
          Not quite — try again ({outcome.attempts}/3).
        </p>
      )}
      {resolved && outcome?.revealed && (
        <div className="mt-3 rounded-lg bg-amber-500/10 p-3 text-sm">
          <p className="font-medium">Worked answer</p>
          <p className="mt-1 text-muted-foreground">{q.explanation ?? "See the correct option above."}</p>
        </div>
      )}
      {resolved && outcome?.correct && q.explanation && (
        <p className="mt-3 text-sm text-muted-foreground">{q.explanation}</p>
      )}
    </div>
  );
}

export function StepPlayer({
  blocks,
  classCode,
  lessonId,
  onFinish,
}: {
  blocks: Block[];
  classCode: string;
  lessonId: string;
  /** Called once when the lesson is marked complete. Defaults to localStorage
   *  (no-login code track); ATAR passes a Redis-backed callback instead. */
  onFinish?: () => void;
}) {
  const { content, activities } = useMemo(() => splitBlocksByPart(blocks), [blocks]);
  const [tab, setTab] = useState<Tab>("content");
  const [stepIndex, setStepIndex] = useState(0);
  const [quizOutcomes, setQuizOutcomes] = useState<Record<number, QuizOutcome>>({});
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  const step = activities[stepIndex];
  const gradableSteps = activities.filter(isGradableQuiz);
  const gradableIndexes = activities
    .map((b, i) => (isGradableQuiz(b) ? i : -1))
    .filter((i) => i >= 0);
  const outcomesInOrder = gradableIndexes.map((i) => quizOutcomes[i]);

  const stepResolved = step
    ? isGradableQuiz(step)
      ? quizStepResolved(quizOutcomes[stepIndex])
      : !!done[stepIndex]
    : true;

  function finish() {
    if (onFinish) onFinish();
    else markLessonComplete(classCode, lessonId);
    setFinished(true);
  }

  function next() {
    if (stepIndex >= activities.length - 1) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  if (finished) {
    const score = activitiesScore(outcomesInOrder);
    const passed = hasPassed(outcomesInOrder);
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div
          className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${
            passed ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Lesson complete</h2>
        {gradableSteps.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {passed
              ? `Nice work — ${Math.round(score * 100)}% on the activities.`
              : `${Math.round(score * 100)}% on the activities — worth a quick review before next lesson.`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("content")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "content" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setTab("activities")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "activities" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Activities{activities.length > 0 ? ` (${activities.length})` : ""}
        </button>
      </div>

      {tab === "content" && (
        <div className="py-8">
          {content.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
          {activities.length > 0 ? (
            <button
              type="button"
              onClick={() => setTab("activities")}
              className="mt-8 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Go to activities →
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="mt-8 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Mark lesson complete
            </button>
          )}
        </div>
      )}

      {tab === "activities" && step && (
        <div className="py-8">
          <p className="text-xs font-medium text-muted-foreground">
            Step {stepIndex + 1} of {activities.length}
          </p>
          <div className="mt-3">
            {isGradableQuiz(step) ? (
              <QuizStep
                block={step}
                outcome={quizOutcomes[stepIndex]}
                onAttempt={(correct) =>
                  setQuizOutcomes((prev) => ({
                    ...prev,
                    [stepIndex]: recordQuizAttempt(prev[stepIndex], correct),
                  }))
                }
              />
            ) : (
              <div>
                <BlockRenderer block={step} />
                {!done[stepIndex] && (
                  <button
                    type="button"
                    onClick={() => setDone((prev) => ({ ...prev, [stepIndex]: true }))}
                    className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Done, continue
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!stepResolved}
              onClick={next}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {stepIndex >= activities.length - 1 ? "Finish lesson" : "Next →"}
            </button>
          </div>
        </div>
      )}

      {tab === "activities" && activities.length === 0 && (
        <div className="py-8">
          <p className="text-sm text-muted-foreground italic">No activities in this lesson.</p>
          <button
            type="button"
            onClick={finish}
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Mark lesson complete
          </button>
        </div>
      )}
    </div>
  );
}
