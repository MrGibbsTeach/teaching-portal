"use client";

/**
 * Per-device lesson-completion tracking for the no-login (code track) student
 * pages. There is no account to store this against server-side, so it lives in
 * the browser's localStorage only: lost if the student switches device or
 * clears the browser (redesign-plan.md, 28 Oct 2026). The teacher's only real
 * record of who did what is the Microsoft Forms exit ticket.
 */

function key(classCode: string): string {
  return `mg_progress_${classCode}`;
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

export function markLessonComplete(classCode: string, lessonId: string): void {
  try {
    const done = new Set(getCompletedLessons(classCode));
    done.add(lessonId);
    localStorage.setItem(key(classCode), JSON.stringify([...done]));
  } catch {
    // localStorage unavailable (private mode, blocked storage); progress just won't persist.
  }
}

export function isLessonComplete(classCode: string, lessonId: string): boolean {
  return getCompletedLessons(classCode).includes(lessonId);
}
