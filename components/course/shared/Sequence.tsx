"use client";

import { useMemo, useState } from "react";
import { useStepDone } from "./StepDone";

function shuffled(n: number): number[] {
  // Deterministic rotation-based shuffle so server and client render the same markup.
  const a = Array.from({ length: n }, (_, i) => i);
  const out: number[] = [];
  let k = 1;
  while (a.length) {
    k = (k * 5 + 3) % (a.length * 7 + 1);
    out.push(a.splice(k % a.length, 1)[0]);
  }
  if (out.every((v, i) => v === i) && n > 1) out.reverse();
  return out;
}

/** Tap the items in the correct order. `items` is given in the correct order. */
export function Sequence({
  title,
  instruction,
  items,
  explanation,
}: {
  title?: string;
  instruction?: string;
  items: string[];
  explanation?: string;
}) {
  const order = useMemo(() => shuffled(items.length), [items.length]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const done = chosen.length === items.length;
  useStepDone(done);

  function tap(i: number) {
    if (done || chosen.includes(i)) return;
    if (i === chosen.length) {
      setChosen([...chosen, i]);
      setWrong(null);
    } else {
      setWrong(i);
      setMistakes((m) => m + 1);
    }
  }
  function reset() {
    setChosen([]);
    setWrong(null);
    setMistakes(0);
  }

  return (
    <section className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
      <h3 className="text-base font-semibold tracking-tight">{title ?? "Put it in order"}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {instruction ?? "Tap the steps in the right order, starting with the first."}
      </p>
      <div className="mt-3 grid gap-2">
        {order.map((i) => {
          const pos = chosen.indexOf(i);
          const placed = pos !== -1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => tap(i)}
              disabled={placed || done}
              className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                placed
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                  : wrong === i
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                    : "bg-background hover:bg-accent/40"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  placed ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {placed ? pos + 1 : "?"}
              </span>
              <span>{items[i]}</span>
            </button>
          );
        })}
      </div>
      {wrong !== null && !done && (
        <p className="mt-3 text-sm text-rose-700 dark:text-rose-300" role="status">
          Not that one yet. What has to happen before it?
        </p>
      )}
      {done && (
        <div className="mt-3 rounded-xl bg-primary/5 p-3 text-sm" role="status">
          <p className="font-semibold">
            {mistakes === 0 ? "Perfect order, no wrong taps." : `In order. ${mistakes} wrong tap${mistakes === 1 ? "" : "s"}.`}
          </p>
          {explanation && <p className="mt-1 text-foreground/85">{explanation}</p>}
          <button type="button" onClick={reset} className="mt-2 text-sm font-medium text-primary underline-offset-2 hover:underline">
            Reset
          </button>
        </div>
      )}
    </section>
  );
}
