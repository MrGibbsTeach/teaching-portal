/**
 * Rewards, streaks and milestones (feature backlog rank 4).
 *
 * Pure: no storage, no React, no clock. The caller passes what it knows about
 * this device (lessons finished, dated completion events) and today's date.
 *
 * Rules the owner set:
 * - Five milestones, no more.
 * - A repeat on the same day never counts twice: events are collapsed to one
 *   per lesson and day before anything is counted.
 * - Device-local only. Nothing here is stored server-side or shown to teachers.
 * - No confetti, no notifications: the words do the work.
 */

export type RewardEvent = { lessonId: string; day: string };

/** Counts every milestone is judged on. */
export type RewardCounts = {
  /** Distinct lessons finished. */
  lessonsDone: number;
  /** Distinct days with at least one lesson finished. */
  daysActive: number;
  /** Longest run of consecutive days anywhere in the history. */
  longestStreak: number;
};

export type Milestone = {
  id: string;
  /** Short badge label. */
  name: string;
  /** What it takes, shown while it is not earned. */
  hint: string;
  test: (counts: RewardCounts) => boolean;
};

export const MILESTONES: readonly Milestone[] = [
  { id: "first-lesson", name: "First lesson", hint: "Finish one lesson.", test: (c) => c.lessonsDone >= 1 },
  { id: "five-lessons", name: "Five lessons", hint: "Finish five lessons.", test: (c) => c.lessonsDone >= 5 },
  { id: "ten-lessons", name: "Ten lessons", hint: "Finish ten lessons.", test: (c) => c.lessonsDone >= 10 },
  {
    id: "three-days",
    name: "Three days",
    hint: "Finish a lesson on three different days.",
    test: (c) => c.daysActive >= 3,
  },
  {
    id: "three-in-a-row",
    name: "Three in a row",
    hint: "Finish a lesson three days running.",
    test: (c) => c.longestStreak >= 3,
  },
];

export type Badge = { id: string; name: string; hint: string; earned: boolean };

export type RewardState = RewardCounts & {
  /** All five, in order, each marked earned or not. */
  badges: Badge[];
  earnedCount: number;
  /** The first milestone still to earn, or null once all five are earned. */
  next: Badge | null;
  /** Days in a row ending today or yesterday. Zero if the run is broken. */
  currentStreak: number;
};

/** Calendar day for a moment in time, in the class's time zone. */
export function dayInTimeZone(date: Date, timeZone = "Australia/Perth"): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Move a YYYY-MM-DD string by whole days. UTC maths, so no DST surprises. */
export function shiftDay(day: string, days: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const t = Date.UTC(y, (m ?? 1) - 1, d ?? 1) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** Collapse events to one per lesson and day, so a same-day repeat counts once. */
export function uniqueEvents(
  events: readonly RewardEvent[],
  doneLessonIds: readonly string[] = [],
): Map<string, Set<string>> {
  const byLesson = new Map<string, Set<string>>();
  const add = (lessonId: string, day: string | null) => {
    if (!lessonId) return;
    const days = byLesson.get(lessonId) ?? new Set<string>();
    if (day) days.add(day);
    byLesson.set(lessonId, days);
  };
  for (const id of doneLessonIds) add(id, null);
  for (const e of events) {
    if (!e || !e.lessonId) continue;
    add(e.lessonId, e.day && /^\d{4}-\d{2}-\d{2}$/.test(e.day) ? e.day : null);
  }
  return byLesson;
}

/** Distinct days with at least one completion event. */
export function activeDays(events: readonly RewardEvent[]): string[] {
  const days = new Set<string>();
  for (const e of events) {
    if (e && e.day && /^\d{4}-\d{2}-\d{2}$/.test(e.day)) days.add(e.day);
  }
  return [...days].sort();
}

/** Longest run of consecutive days anywhere in the list. */
export function longestStreak(days: readonly string[]): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of sorted) {
    run = previous !== null && shiftDay(previous, 1) === day ? run + 1 : 1;
    if (run > best) best = run;
    previous = day;
  }
  return best;
}

/**
 * Run of consecutive days ending today, or yesterday if today is empty, so a
 * streak is not lost until a whole day has passed with no lesson.
 */
export function currentStreak(days: readonly string[], today: string): number {
  const set = new Set(days);
  let cursor = today;
  if (!set.has(cursor)) cursor = shiftDay(today, -1);
  let run = 0;
  while (set.has(cursor)) {
    run += 1;
    cursor = shiftDay(cursor, -1);
  }
  return run;
}

export function buildRewardState(input: {
  doneLessonIds?: readonly string[];
  events?: readonly RewardEvent[];
  today: string;
}): RewardState {
  const events = input.events ?? [];
  const byLesson = uniqueEvents(events, input.doneLessonIds ?? []);
  const days = activeDays(events);
  const counts: RewardCounts = {
    lessonsDone: byLesson.size,
    daysActive: days.length,
    longestStreak: longestStreak(days),
  };
  const badges: Badge[] = MILESTONES.map((m) => ({
    id: m.id,
    name: m.name,
    hint: m.hint,
    earned: m.test(counts),
  }));
  return {
    ...counts,
    badges,
    earnedCount: badges.filter((b) => b.earned).length,
    next: badges.find((b) => !b.earned) ?? null,
    currentStreak: currentStreak(days, input.today),
  };
}
