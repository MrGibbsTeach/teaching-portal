"use client";

import { useTransition } from "react";

/** Releases every lesson planned for a week and makes the first one Today's lesson. */
export function ReleaseWeekButton({
  count,
  onRelease,
}: {
  count: number;
  onRelease: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending || count === 0}
      onClick={() => startTransition(() => { onRelease(); })}
      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {isPending ? "Releasing..." : `Release this week's ${count === 1 ? "lesson" : `${count} lessons`}`}
    </button>
  );
}
