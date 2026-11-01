"use client";

import { useTransition } from "react";

/** One-click control for the usual teaching day: shows what students see now and releases the next lesson as Today's lesson. */
export function ReleaseNextBar({
  todayTitle,
  nextTitle,
  nextTopic,
  onReleaseNext,
}: {
  todayTitle?: string;
  nextTitle?: string;
  nextTopic?: string;
  onReleaseNext?: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-accent/40 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Students see today</p>
        <p className="mt-0.5 text-lg font-bold tracking-tight">{todayTitle ?? "No lesson released yet"}</p>
        {nextTitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            Next in the course: {nextTitle}
            {nextTopic ? ` (${nextTopic})` : ""}
          </p>
        )}
      </div>
      {nextTitle && onReleaseNext && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => { onReleaseNext(); })}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Releasing..." : "Release next lesson"}
        </button>
      )}
    </div>
  );
}
