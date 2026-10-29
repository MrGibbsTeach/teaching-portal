"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
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
          className="skin-card flex items-center justify-between gap-3 border p-3 hover:bg-accent/40 transition-colors"
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
            <>
              {/* Arcade gets a star, Portfolio/Study a plain tick — toggled by
                  the .theme-{tier} ancestor class, see globals.css. */}
              <Star className="skin-tick-star h-5 w-5 shrink-0 fill-primary text-primary" />
              <Check className="skin-tick-check h-5 w-5 shrink-0 text-primary" />
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
