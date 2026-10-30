"use client";

import { useState } from "react";

export function FlipCards({
  title,
  instruction,
  cards,
}: {
  title?: string;
  instruction?: string;
  cards: { front: string; back: string; tag?: string }[];
}) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{title ?? "Flip the cards"}</h3>
        <span className="text-xs font-medium text-muted-foreground">
          {flipped.size}/{cards.length} flipped
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {instruction ?? "Read the front, say your answer out loud, then tap to check."}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {cards.map((c, i) => {
          const open = flipped.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={open}
              className={`min-h-[8.5rem] rounded-xl border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                open ? "border-primary/50 bg-primary/5" : "bg-background hover:bg-accent/40"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                {open ? "Answer" : (c.tag ?? "Tap to flip")}
              </span>
              <span className={`mt-2 block text-sm leading-relaxed ${open ? "" : "font-medium text-base"}`}>
                {open ? c.back : c.front}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
