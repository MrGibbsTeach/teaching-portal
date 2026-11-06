"use client";

import { useEffect, useState } from "react";
import { BadgeRow } from "@/components/course/shared/BadgeRow";
import { buildRewardState, dayInTimeZone, type RewardState } from "@/lib/logic/rewards";
import { getCompletedLessons, getLessonEvents } from "@/lib/local-progress";

/**
 * The badges section on the student class home (code-track classes only).
 *
 * Everything is read from this browser at mount, so nothing is stored
 * server-side and teachers never see it. The wording is deliberately flat:
 * small wins, no confetti, no notifications, nothing to dismiss.
 */
export function RewardsBadges({ classCode }: { classCode: string }) {
  const [state, setState] = useState<RewardState | null>(null);

  useEffect(() => {
    // Deferred like PreviousLessonsList: localStorage cannot be read during
    // render, and the rule set dislikes setState straight from an effect body.
    const id = setTimeout(() => {
      setState(
        buildRewardState({
          doneLessonIds: getCompletedLessons(classCode),
          events: getLessonEvents(classCode),
          today: dayInTimeZone(new Date()),
        }),
      );
    }, 0);
    return () => clearTimeout(id);
  }, [classCode]);

  // Before hydration there is nothing to show, and an empty shell would jump.
  if (!state) return null;

  return (
    <section aria-labelledby="badges-heading" className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="badges-heading" className="font-heading text-xl font-bold tracking-tight">
          Milestones
        </h2>
        <span className="text-sm text-muted-foreground">
          {state.earnedCount} of {state.badges.length} · kept on this device
        </span>
      </div>
      <BadgeRow badges={state.badges} className="mt-3" />
      <p className="mt-2 text-sm text-muted-foreground">
        {state.next
          ? `Next: ${state.next.hint.charAt(0).toLowerCase()}${state.next.hint.slice(1)}`
          : "All five earned. Nothing else to collect."}
        {state.currentSchoolRun >= 2
          ? ` ${state.currentSchoolRun} school days in a row so far.`
          : ""}
      </p>
    </section>
  );
}
