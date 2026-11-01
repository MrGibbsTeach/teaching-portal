"use client";

import Link from "next/link";
import { useLivePoll } from "@/components/live/useLivePoll";

interface Status {
  active: boolean;
  lessonTitle?: string;
}

/**
 * Flashing "Live now" button for class homepages. Renders nothing until the teacher
 * starts a live lesson, then appears by itself (polls at the idle pace, and not at
 * all while the tab is hidden).
 */
export function LiveNowButton({ href, code }: { href: string; code?: string }) {
  const { data } = useLivePoll<Status>(
    async () => {
      const r = await fetch(`/api/live?status=1${code ? `&code=${encodeURIComponent(code)}` : ""}`, {
        cache: "no-store",
      });
      if (!r.ok) throw new Error(String(r.status));
      return (await r.json()) as Status;
    },
    (d) => d.active,
  );

  if (!data?.active) return null;

  return (
    <div className="mb-10 flex flex-col items-center gap-2" role="status">
      <Link
        href={href}
        className="live-now-btn inline-flex items-center gap-3 rounded-full bg-red-600 px-8 py-4 text-base font-bold uppercase tracking-wider text-white"
      >
        <span className="live-now-dot inline-block h-3 w-3 rounded-full bg-white" aria-hidden />
        Live now · Join lesson
      </Link>
      {data.lessonTitle && <p className="text-sm text-muted-foreground">{data.lessonTitle}</p>}
    </div>
  );
}
