/**
 * Rewards, streaks and milestones (feature backlog rank 4).
 *
 * Pure: no storage, no React, no clock. The caller passes what it knows about
 * this device (lessons finished, dated completion events) and today's date.
 *
 * Rules the owner set:
 * - Five milestones, no more, and each has to mean something different:
 *   lessons finished, then days turned up, then a run of school days.
 * - A repeat on the same day never counts twice: events are collapsed to one
 *   per lesson and day before anything is counted.
 * - Weekends do not break a run, so Friday then Monday counts as consecutive.
 *   Saturday and Sunday still count as activity for "five active days".
 * - Device-local only. Nothing here is stored server-side or shown to teachers.
 * - No confetti, no notifications: the words do the work.
 */

export type RewardEvent = { lessonId: string; day: string };

/** Counts every milestone is judged on. */
export type RewardCounts = {
  /** Distinct lessons finished. */
  lessonsDone: number;
  /** Distinct days with at least one lesson finished, weekends included. */
  daysActive: number;
  /** Longest run of school days (Mon to Fri) with a finish, weekends skipped. */
  longestSchoolRun: number;
};

export type Milestone = {
  id: string;
  /** Short label on the badge. */
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
    id: "five-days",
    name: "Five active days",
    hint: "Finish a lesson on five different days.",
    test: (c) => c.daysActive >= 5,
  },
  {
    id: "five-school-days",
    name: "Five school days in a row",
    hint: "Finish a lesson five school days running. Weekends do not break it.",
    test: (c) => c.longestSchoolRun >= 5,
  },
];

export type Badge = { id: string; name: string; hint: string; earned: boolean };

export type RewardState = RewardCounts & {
  /** All five, in order, each marked earned or not. */
  badges: Badge[];
  earnedCount: number;
  /** The first milestone still to earn, or null once all five are earned. */
  next: Badge | null;
  /** School days in a row ending at the latest school day, or the one before. */
  currentSchoolRun: number;
};

const DAY_MS = 86_400_000;

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
  const t = Date.UTC(y, (m ?? 1) - 1, d ?? 1) + days * DAY_MS;
  return new Date(t).toISOString().slice(0, 10);
}

/** Whole days since 1970-01-01, which was a Thursday. */
function serial(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return Math.round(Date.UTC(y, (m ?? 1) - 1, d ?? 1) / DAY_MS);
}

/** 0 = Sunday, 6 = Saturday. */
function weekday(s: number): number {
  return (((s + 4) % 7) + 7) % 7;
}

export function isSchoolDay(day: string): boolean {
  const w = weekday(serial(day));
  return w !== 0 && w !== 6;
}

/** How many school days have passed before this serial day. */
function schoolDaysBefore(s: number): number {
  const weeks = Math.floor(s / 7);
  const rem = s % 7;
  let count = weeks * 5;
  for (let i = 0; i < rem; i += 1) {
    const w = (i + 4) % 7;
    if (w !== 0 && w !== 6) count += 1;
  }
  return count;
}

/**
 * Position of a date in the sequence of school days, so Friday and the
 * following Monday differ by one. Null on Saturday and Sunday, which are not
 * school days and neither extend nor break a run.
 */
export function schoolDayIndex(day: string): number | null {
  return isSchoolDay(day) ? schoolDaysBefore(serial(day)) : null;
}

/** The most recent school day on or before the given date, as an index. */
function latestSchoolDayIndex(day: string): number | null {
  for (let back = 0; back <= 2; back += 1) {
    const candidate = schoolDayIndex(shiftDay(day, -back));
    if (candidate !== null) return candidate;
  }
  return null;
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

/** Distinct days with at least one completion event, weekends included. */
export function activeDays(events: readonly RewardEvent[]): string[] {
  const days = new Set<string>();
  for (const e of events) {
    if (e && e.day && /^\d{4}-\d{2}-\d{2}$/.test(e.day)) days.add(e.day);
  }
  return [...days].sort();
}

/** Longest run of school days with a finish, weekends skipped. */
export function longestSchoolRun(days: readonly string[]): number {
  const indices = [
    ...new Set(days.map(schoolDayIndex).filter((x): x is number => x !== null)),
  ].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let previous: number | null = null;
  for (const index of indices) {
    run = previous !== null && index === previous + 1 ? run + 1 : 1;
    if (run > best) best = run;
    previous = index;
  }
  return best;
}

/**
 * Run of school days ending at the latest school day on or before today, or
 * the one before it, so a run is not lost until a whole school day is missed.
 */
export function currentSchoolRun(days: readonly string[], today: string): number {
  const set = new Set(
    days.map(schoolDayIndex).filter((x): x is number => x !== null),
  );
  let cursor = latestSchoolDayIndex(today);
  if (cursor === null) return 0;
  if (!set.has(cursor)) cursor -= 1;
  let run = 0;
  while (set.has(cursor)) {
    run += 1;
    cursor -= 1;
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
    longestSchoolRun: longestSchoolRun(days),
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
    currentSchoolRun: currentSchoolRun(days, input.today),
  };
}
