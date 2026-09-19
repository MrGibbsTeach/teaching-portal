"use client";

import { useState } from "react";
import { checkBuckets, checkOrder, shuffleUnsolved, type BucketPlacement } from "@/lib/logic/activity-check";

const btn =
  "rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Tap an item, then tap the bucket it belongs in. Tap a placed item to send it back. */
export function BucketSort({
  categories,
  onSolved,
}: {
  categories: { label: string; items: string[] }[];
  onSolved?: () => void;
}) {
  const allItems = categories.flatMap((c) => c.items);
  const [items] = useState(() => shuffleUnsolved(allItems, allItems.length + 7));
  const [placement, setPlacement] = useState<BucketPlacement>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const unplaced = items.filter((i) => !placement[i]);

  function place(label: string) {
    if (!selected || solved) return;
    setPlacement((p) => ({ ...p, [selected]: label }));
    setSelected(null);
    setWrong([]);
  }

  function unplace(item: string) {
    if (solved) return;
    setPlacement((p) => {
      const next = { ...p };
      delete next[item];
      return next;
    });
    setWrong([]);
  }

  function check() {
    const r = checkBuckets(categories, placement);
    setWrong(r.wrong);
    if (r.correct) {
      setSolved(true);
      onSolved?.();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex min-h-12 flex-wrap gap-2" aria-label="Items to sort">
        {unplaced.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={selected === item}
            onClick={() => setSelected(selected === item ? null : item)}
            className={`${btn} ${selected === item ? "border-primary bg-primary/10" : "bg-card"}`}
          >
            {item}
          </button>
        ))}
        {unplaced.length === 0 && !solved && (
          <p className="text-sm text-muted-foreground">Everything is sorted. Press Check.</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <div key={c.label} className="rounded-xl border-2 border-dashed p-3">
            <button
              type="button"
              onClick={() => place(c.label)}
              disabled={!selected}
              className="mb-2 w-full rounded-lg bg-muted px-3 py-2 text-left font-semibold disabled:opacity-70"
            >
              {c.label}
              {selected && <span className="ml-2 text-xs font-normal">← put “{selected}” here</span>}
            </button>
            <div className="flex flex-wrap gap-2">
              {items
                .filter((i) => placement[i] === c.label)
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => unplace(item)}
                    className={`${btn} ${
                      wrong.includes(item)
                        ? "border-red-500 bg-red-50 text-red-900"
                        : solved
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                          : "bg-card"
                    }`}
                  >
                    {item}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {!solved && (
        <button
          type="button"
          onClick={check}
          disabled={unplaced.length > 0}
          className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-50"
        >
          Check
        </button>
      )}
      <p role="status" className="text-sm font-medium">
        {solved ? "✅ All sorted!" : wrong.length > 0 ? "Not quite. The red ones are in the wrong place." : ""}
      </p>
    </div>
  );
}

/** Reorder with up/down buttons (works on touch and keyboard). */
export function OrderSteps({
  orderedItems,
  onSolved,
}: {
  orderedItems: string[];
  onSolved?: () => void;
}) {
  const [items, setItems] = useState(() => shuffleUnsolved(orderedItems, orderedItems.length + 3));
  const [misplaced, setMisplaced] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (solved || j < 0 || j >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setMisplaced([]);
  }

  function check() {
    const r = checkOrder(orderedItems, items);
    setMisplaced(r.misplaced);
    if (r.correct) {
      setSolved(true);
      onSolved?.();
    }
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li
            key={item}
            className={`flex items-center gap-2 rounded-lg border p-2 ${
              misplaced.includes(i)
                ? "border-red-500 bg-red-50"
                : solved
                  ? "border-emerald-500 bg-emerald-50"
                  : "bg-card"
            }`}
          >
            <span className="w-6 text-center text-sm font-bold">{i + 1}</span>
            <span className="flex-1 text-sm">{item}</span>
            <button
              type="button"
              aria-label={`Move “${item}” up`}
              disabled={solved || i === 0}
              onClick={() => move(i, -1)}
              className="rounded border px-2 py-1 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Move “${item}” down`}
              disabled={solved || i === items.length - 1}
              onClick={() => move(i, 1)}
              className="rounded border px-2 py-1 disabled:opacity-30"
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
      {!solved && (
        <button
          type="button"
          onClick={check}
          className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground"
        >
          Check
        </button>
      )}
      <p role="status" className="text-sm font-medium">
        {solved ? "✅ Right order!" : misplaced.length > 0 ? "Not quite. The red ones are in the wrong place." : ""}
      </p>
    </div>
  );
}
