"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCompletedLessons } from "@/lib/local-progress";

export interface PreviousLessonEntry {
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
  topicTitle: string;
  isToday: boolean;
  isRevision: boolean;
}

export function PreviousLessonsList({
  classCode,
  entries,
}: {
  classCode: string;
  entries: PreviousLessonEntry[];
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Deferred (not a synchronous setState-in-effect) so this never fires during
    // the render that mounts the component, matching the pattern used elsewhere
    // in this codebase for client-only reads (see CodeExercise's srcDoc effect).
    const id = setTimeout(() => setCompleted(new Set(getCompletedLessons(classCode))), 0);
    return () => clearTimeout(id);
  }, [classCode]);

  if (entries.length === 0) {
    return <p className="mt-6 text-sm text-muted-foreground italic">No lessons released yet.</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {entries.map((e) => (
        <Link
          key={e.lessonId}
          href={`/${classCode}/lesson/${e.lessonId}`}
          className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:bg-accent/40 transition-colors"
        >
          <div>
            <p className="text-sm font-medium">{e.lessonTitle}</p>
            <p className="text-xs text-muted-foreground">
              {e.unitTitle} / {e.topicTitle}
              {e.isToday && " · Today's lesson"}
              {e.isRevision && " · Open for revision"}
            </p>
          </div>
          {completed.has(e.lessonId) && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 shrink-0 text-primary"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Link>
      ))}
    </div>
  );
}
