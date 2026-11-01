"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { endLiveSession } from "@/app/actions/live";

/** Ends the class's live session so the Live now button disappears from student screens. */
export function StopLiveButton({ classId }: { classId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await endLiveSession(classId);
            setFailed(!r.ok);
            if (r.ok) router.refresh();
          })
        }
        className="mt-3 ml-3 inline-block rounded-lg border-2 border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Stopping…" : "Stop live lesson"}
      </button>
      {failed && <span className="ml-3 text-sm text-red-700">Could not stop it. Try again.</span>}
    </>
  );
}
