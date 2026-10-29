"use client";

import { useTransition } from "react";
import type { LessonReleaseStatus } from "@/lib/auth-types";

const STATUS_LABEL: Record<LessonReleaseStatus, string> = {
  not_released: "Not released",
  released: "Released",
  today: "Today's lesson",
  revision: "Open for revision",
};

const STATUS_CLASS: Record<LessonReleaseStatus, string> = {
  not_released: "text-muted-foreground",
  released: "text-primary",
  today: "text-primary font-semibold",
  revision: "text-amber-600",
};

export function LessonReleaseRow({
  title,
  status,
  onRelease,
  onMakeToday,
  onPullBack,
  onOpenRevision,
  onCloseRevision,
}: {
  title: string;
  status: LessonReleaseStatus;
  onRelease: () => Promise<void>;
  onMakeToday: () => Promise<void>;
  onPullBack: () => Promise<void>;
  onOpenRevision: () => Promise<void>;
  onCloseRevision: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(() => {
      action();
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className={`text-xs ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</p>
      </div>
      <div className="flex gap-1.5">
        {status === "not_released" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(onRelease)}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Release
          </button>
        )}
        {status === "released" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(onMakeToday)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Make today&apos;s lesson
          </button>
        )}
        {(status === "released" || status === "today") && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(onPullBack)}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Pull back
          </button>
        )}
        {status === "not_released" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(onOpenRevision)}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Open for revision
          </button>
        )}
        {status === "revision" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(onCloseRevision)}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Close revision
          </button>
        )}
      </div>
    </div>
  );
}
