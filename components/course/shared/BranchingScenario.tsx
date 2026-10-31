"use client";

import { useState } from "react";
import type { BranchStep } from "@/lib/content/types";
import { useStepDone } from "./StepDone";

/** A short decision story. Each step shows a situation; the learner picks, sees why, and moves on. */
export function BranchingScenario({
  title,
  intro,
  steps,
}: {
  title?: string;
  intro?: string;
  steps: BranchStep[];
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [good, setGood] = useState(0);
  const done = index >= steps.length;
  const step = steps[index];
  useStepDone(done);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (step.choices[i].correct) setGood((g) => g + 1);
  }
  function next() {
    setPicked(null);
    setIndex((n) => n + 1);
  }
  function restart() {
    setIndex(0);
    setPicked(null);
    setGood(0);
  }

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="bg-primary/10 px-4 py-2.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Case file</p>
        <h3 className="text-base font-semibold tracking-tight">{title ?? "What would you do?"}</h3>
      </div>
      <div className="p-4">
        {intro && index === 0 && picked === null && (
          <p className="mb-3 text-sm text-muted-foreground">{intro}</p>
        )}
        {done ? (
          <div className="text-center">
            <p className="text-3xl font-semibold">
              {good}/{steps.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {good === steps.length
                ? "Every call was the strongest option on the first try."
                : "Read the feedback on the ones you missed, then replay."}
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-3 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/40"
            >
              Replay
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-muted-foreground">
              Decision {index + 1} of {steps.length}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{step.situation}</p>
            <p className="mt-3 font-semibold">{step.prompt}</p>
            <div className="mt-2 grid gap-2">
              {step.choices.map((c, i) => {
                const show = picked !== null;
                const cls = !show
                  ? "bg-background hover:bg-accent/40"
                  : c.correct
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : picked === i
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                      : "opacity-60";
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={show}
                    onClick={() => pick(i)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${cls}`}
                  >
                    {c.text}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="mt-3 rounded-xl bg-muted/60 p-3 text-sm" role="status">
                <p className="font-semibold">{step.choices[picked].correct ? "Strong choice" : "Think again"}</p>
                <p className="mt-0.5 text-foreground/85">{step.choices[picked].feedback}</p>
                {!step.choices[picked].correct && (
                  <p className="mt-1 text-foreground/85">
                    <span className="font-semibold">Best option:</span>{" "}
                    {step.choices.find((c) => c.correct)?.feedback}
                  </p>
                )}
                <button
                  type="button"
                  onClick={next}
                  className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  {index + 1 === steps.length ? "Finish" : "Next decision"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
