"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/content/types";
import { useStepDone } from "@/components/course/shared/StepDone";

/** Drafts survive stepping back and forth within the page; they are never stored or sent anywhere. */
const drafts = new Map<string, string>();

function storageKey(id: QuizQuestion["id"], text: string) {
  return `written:${id ?? text.slice(0, 40)}`;
}

/**
 * Short and extended answers: the student types, checks against the marking guide, then self-marks.
 * The typed text stays in this browser only (in memory); nothing is sent anywhere.
 */
export function WrittenAnswer({ question }: { question: QuizQuestion }) {
  const key = storageKey(question.id, question.text);
  const [text, setText] = useState(() => drafts.get(key) ?? "");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const maxMarks = question.marks ?? 1;
  const extended = question.questionType === "extended";

  useStepDone(score !== null);

  function onChange(v: string) {
    setText(v);
    drafts.set(key, v);
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const hasTyped = text.trim().length > 0;

  return (
    <div className="mt-3 rounded-2xl border bg-card p-4 shadow-sm">
      <p className="font-medium">{question.text}</p>
      {question.marks && <p className="mt-0.5 text-xs text-muted-foreground">{question.marks} marks</p>}

      {!checked ? (
        <>
          <label className="sr-only" htmlFor={key}>
            Your answer
          </label>
          <textarea
            id={key}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            rows={extended ? 6 : 3}
            placeholder={extended ? "Write your answer here. Use the mark value to judge how much to write." : "Write your answer here."}
            className="mt-3 w-full resize-y rounded-xl border bg-background p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!hasTyped}
              onClick={() => setChecked(true)}
              className="skin-btn-primary border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40"
            >
              Check my answer
            </button>
            <span className="text-xs text-muted-foreground">{words} words</span>
            <button
              type="button"
              onClick={() => setChecked(true)}
              className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Skip typing, show the marking guide
            </button>
          </div>
        </>
      ) : (
        <div className="mt-3 space-y-3">
          {hasTyped && (
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your answer</p>
              <p className="mt-1 whitespace-pre-line text-sm">{text}</p>
            </div>
          )}
          <div className="rounded-xl border-l-4 border-primary bg-primary/5 p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Marking guide</p>
            <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">{question.explanation}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Be honest: how many marks did your answer earn?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: maxMarks + 1 }, (_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  aria-pressed={score === n}
                  className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition-colors ${
                    score === n ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {score !== null && (
              <p className="mt-2 text-sm text-muted-foreground">
                {score === maxMarks
                  ? "Full marks. Well done."
                  : score === 0
                    ? "Read the guide again, then tweak your answer to see what was missing."
                    : `You gave yourself ${score} of ${maxMarks}. Look for the point you missed in the guide.`}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setChecked(false);
              setScore(null);
            }}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Edit my answer
          </button>
        </div>
      )}
    </div>
  );
}
