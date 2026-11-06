"use client";

/**
 * Per-device lesson-completion tracking for the no-login (code track) student
 * pages. There is no account to store this against server-side, so it lives in
 * the browser's localStorage only: lost if the student switches device or
 * clears the browser (redesign-plan.md, 28 Oct 2026). The teacher's only real
 * record of who did what is the Microsoft Forms exit ticket.
 *
 * Two keys per class:
 * - `mg_progress_<code>`: the lessons finished, since 28 Oct 2026.
 * - `mg_progress_days_<code>`: the same finishes with the day they happened,
 *   added 6 Nov 2026 so the rewards row can tell a streak from a single session.
 *   Older finishes have no day and still count as lessons finished.
 */

import { dayInTimeZone, type RewardEvent } from "@/lib/logic/rewards";

/** Keeps localStorage bounded; oldest days drop off first. */
const MAX_EVENTS = 400;

function key(classCode: string): string {
  return `mg_progress_${classCode}`;
}

function eventsKey(classCode: string): string {
  return `mg_progress_days_${classCode}`;
}

export function getCompletedLessons(classCode: string): string[] {
  try {
    const raw = localStorage.getItem(key(classCode));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Lesson finishes with the day they happened, oldest first. Never throws. */
export function getLessonEvents(classCode: string): RewardEvent[] {
  try {
    const raw = localStorage.getItem(eventsKey(classCode));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is RewardEvent =>
        !!x &&
        typeof x.lessonId === "string" &&
        typeof x.day === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(x.day),
    );
  } catch {
    return [];
  }
}

function recordLessonDay(classCode: string, lessonId: string): void {
  try {
    const events = getLessonEvents(classCode);
    const day = dayInTimeZone(new Date());
    if (events.some((e) => e.lessonId === lessonId && e.day === day)) return;
    const next = [...events, { lessonId, day }];
    localStorage.setItem(
      eventsKey(classCode),
      JSON.stringify(next.length > MAX_EVENTS ? next.slice(-MAX_EVENTS) : next),
    );
  } catch {
    // localStorage unavailable (private mode, blocked storage); the day is just not recorded.
  }
}

export function markLessonComplete(classCode: string, lessonId: string): void {
  try {
    const done = new Set(getCompletedLessons(classCode));
    done.add(lessonId);
    localStorage.setItem(key(classCode), JSON.stringify([...done]));
  } catch {
    // localStorage unavailable (private mode, blocked storage); progress just won't persist.
  }
  recordLessonDay(classCode, lessonId);
}

export function isLessonComplete(classCode: string, lessonId: string): boolean {
  return getCompletedLessons(classCode).includes(lessonId);
}
