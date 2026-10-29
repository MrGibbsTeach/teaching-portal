"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCompletedLessons } from "@/lib/local-progress";
import { releaseLabel } from "@/lib/term-dates";

export interface PreviousLessonEntry {
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
  topicTitle: string;
  /** ISO timestamp the lesson was released, used for in-topic ordering and the term/week label. */
  releasedAt: string;
  isToday: boolean;
  isRevision: boolean;
}

interface TopicGroup {
  key: string;
  unitTitle: string;
  topicTitle: string;
  entries: PreviousLessonEntry[];
}

/**
 * Group entries under their topic, in course order of topics (the order they
 * first appear, matching the page's own unit/topic/lesson traversal), with
 * lessons inside a topic in release order, oldest first (redesign-plan.md S2).
 */
function groupByTopic(entries: PreviousLessonEntry[]): TopicGroup[] {
  const groups = new Map<string, TopicGroup>();
  for (const e of entries) {
    const key = `${e.unitTitle}::${e.topicTitle}`;
    let group = groups.get(key);
    if (!group) {
      group = { key, unitTitle: e.unitTitle, topicTitle: e.topicTitle, entries: [] };
      groups.set(key, group);
    }
    group.entries.push(e);
  }
  for (const group of groups.values()) {
    group.entries.sort((a, b) => a.releasedAt.localeCompare(b.releasedAt));
  }
  return [...groups.values()];
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

  const groups = useMemo(() => groupByTopic(entries), [entries]);

  const latestLessonId = useMemo(() => {
    let latest: PreviousLessonEntry | null = null;
    for (const e of entries) {
      if (!latest || e.releasedAt.localeCompare(latest.releasedAt) > 0) latest = e;
    }
    return latest?.lessonId;
  }, [entries]);

  if (entries.length === 0) {
    return <p className="mt-6 text-sm text-muted-foreground italic">No lessons released yet.</p>;
  }

  return (
    <div className="mt-4 space-y-8">
      {groups.map((group) => (
        <section key={group.key}>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {group.topicTitle}
          </h2>
          <p className="text-xs text-muted-foreground/70">{group.unitTitle}</p>
          <div className="mt-2 space-y-2">
            {group.entries.map((e) => (
              <Link
                key={e.lessonId}
                href={`/${classCode}/lesson/${e.lessonId}`}
                className="skin-card flex items-center justify-between gap-3 border p-3 hover:bg-accent/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{e.lessonTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {releaseLabel(new Date(e.releasedAt))}
                    {e.lessonId === latestLessonId && " · Latest"}
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
        </section>
      ))}
    </div>
  );
}
