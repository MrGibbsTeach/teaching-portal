"use client";

import { useTransition } from "react";
import type { LessonReleaseStatus } from "@/lib/auth-types";

const STATUS_LABEL: Record<LessonReleaseStatus, string> = {
  not_released: "Not released",
  released: "Released",
  today: "Today's lesson",
  revision: "Open for revision",
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

  const chip: Record<LessonReleaseStatus, string> = {
    not_released: "bg-muted text-muted-foreground",
    released: "bg-accent text-accent-foreground",
    today: "bg-primary text-primary-foreground",
    revision: "bg-amber-100 text-amber-800",
  };
  const btn = "rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50";
  const primary = "rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50";

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${status === "today" ? "border-primary" : "border-border"}`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${chip[status]}`}>{STATUS_LABEL[status]}</span>
        <p className="text-sm font-medium">{title}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {status === "not_released" && (
          <>
            <button type="button" disabled={isPending} onClick={() => run(onMakeToday)} className={primary}>
              Make today&apos;s lesson
            </button>
            <button type="button" disabled={isPending} onClick={() => run(onRelease)} className={btn}>
              Release only
            </button>
            <button type="button" disabled={isPending} onClick={() => run(onOpenRevision)} className={btn}>
              Open for revision
            </button>
          </>
        )}
        {status === "released" && (
          <>
            <button type="button" disabled={isPending} onClick={() => run(onMakeToday)} className={primary}>
              Make today&apos;s lesson
            </button>
            <button type="button" disabled={isPending} onClick={() => run(onPullBack)} className={btn}>
              Pull back
            </button>
          </>
        )}
        {status === "today" && (
          <button type="button" disabled={isPending} onClick={() => run(onPullBack)} className={btn}>
            Pull back
          </button>
        )}
        {status === "revision" && (
          <button type="button" disabled={isPending} onClick={() => run(onCloseRevision)} className={btn}>
            Close revision
          </button>
        )}
      </div>
    </div>
  );
}
