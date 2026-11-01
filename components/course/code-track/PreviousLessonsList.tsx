"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCompletedLessons } from "@/lib/local-progress";
import { releaseLabel } from "@/lib/term-dates";
import { TopicIcon } from "@/components/course/shared/TopicIcon";
import { iconForTopic } from "@/lib/logic/topic-icon";

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

  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? entries.filter((e) => `${e.lessonTitle} ${e.topicTitle}`.toLowerCase().includes(q)) : entries;
  }, [entries, query]);
  const groups = useMemo(() => groupByTopic(shown), [shown]);

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
    <div className="mt-6">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search lessons and topics"
        aria-label="Search lessons and topics"
        className="w-full max-w-md rounded-full border border-border bg-muted px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      {groups.length === 0 && <p className="mt-6 text-sm text-muted-foreground italic">No lessons match.</p>}
      <div className="mt-8 space-y-10">
        {groups.map((group) => (
          <section key={group.key}>
            <div className="flex items-center gap-3">
              <TopicIcon icon={iconForTopic(group.topicTitle)} />
              <div>
                <h2 className="font-heading text-xl font-bold leading-tight tracking-tight">{group.topicTitle}</h2>
                <p className="text-xs text-muted-foreground">{group.unitTitle}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {group.entries.map((e) => (
                <Link
                  key={e.lessonId}
                  href={`/${classCode}/lesson/${e.lessonId}`}
                  className="skin-card flex items-center justify-between gap-3 border border-border bg-background p-4 transition hover:border-primary hover:shadow-md"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">{releaseLabel(new Date(e.releasedAt))}</p>
                    <p className="font-semibold">
                      {e.lessonTitle}
                      {e.lessonId === latestLessonId && (
                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 align-middle text-[0.65rem] font-bold text-primary-foreground">Latest</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.isToday ? "Today's lesson" : e.isRevision ? "Open for revision" : "Content and activities"}
                    </p>
                  </div>
                  {completed.has(e.lessonId) && (
                    <>
                      {/* Arcade gets a star, Portfolio/Study a plain tick, toggled by the .theme-{tier} ancestor class. */}
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
    </div>
  );
}
