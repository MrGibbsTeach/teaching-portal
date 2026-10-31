"use client";

import { useMemo, useState } from "react";
import type { SorterItem } from "@/lib/content/types";
import { useStepDone } from "./StepDone";

/**
 * Tap-to-sort: the learner gets one card at a time and taps the bucket it belongs in.
 * Tap-based (no drag) so it works on a school laptop trackpad, a phone and by keyboard.
 */
export function Sorter({
  title,
  instruction,
  categories,
  items,
}: {
  title?: string;
  instruction?: string;
  categories: string[];
  items: SorterItem[];
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [firstTry, setFirstTry] = useState<boolean[]>([]);

  const done = index >= items.length;
  const current = items[index];
  const score = useMemo(() => firstTry.filter(Boolean).length, [firstTry]);
  useStepDone(done);

  function choose(i: number) {
    if (picked !== null || done) return;
    setPicked(i);
    setFirstTry((f) => [...f, i === current.category]);
  }
  function next() {
    setPicked(null);
    setIndex((n) => n + 1);
  }
  function restart() {
    setIndex(0);
    setPicked(null);
    setFirstTry([]);
  }

  return (
    <section className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{title ?? "Sort it"}</h3>
        <span className="text-xs font-medium text-muted-foreground">
          {Math.min(index + 1, items.length)}/{items.length}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(index / items.length) * 100}%` }}
        />
      </div>

      {done ? (
        <div className="mt-4 rounded-xl bg-primary/5 p-4 text-center">
          <p className="text-3xl font-semibold">
            {score}/{items.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {score === items.length
              ? "Perfect sort on the first try."
              : "Right first time. Have another go and aim for a clean run."}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-3 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/40"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            {instruction ?? "Tap the group this belongs in."}
          </p>
          <div className="mt-3 rounded-xl border-2 border-dashed border-primary/40 bg-background p-4 text-base font-medium leading-snug">
            {current.text}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {categories.map((c, i) => {
              const isRight = i === current.category;
              const state =
                picked === null
                  ? "hover:bg-accent/40"
                  : isRight
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                    : picked === i
                      ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
                      : "opacity-50";
              return (
                <button
                  key={i}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => choose(i)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${state}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-3 rounded-xl bg-muted/60 p-3 text-sm" role="status">
              <p className="font-semibold">{picked === current.category ? "Correct" : "Not quite"}</p>
              <p className="mt-0.5 text-foreground/85">{current.why}</p>
              <button
                type="button"
                onClick={next}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                {index + 1 === items.length ? "See my score" : "Next card"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
