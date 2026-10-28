import type { ClassConfig, LessonRelease } from "@/lib/auth-types";

/**
 * Pure release-state transitions for the Today's-lesson model (redesign-plan.md
 * decisions, 28 Oct 2026). Kept separate from the server actions that call them
 * so they're easy to unit test without a Redis connection.
 */

export type Releases = Record<string, LessonRelease>;

function withRelease(releases: Releases, lessonId: string, status: LessonRelease["status"]): Releases {
  return { ...releases, [lessonId]: { status, releasedAt: new Date().toISOString() } };
}

/** Release a lesson (Content and Activities together) without making it Today's lesson. */
export function release(releases: Releases, lessonId: string): Releases {
  return withRelease(releases, lessonId, "released");
}

/**
 * Release a lesson and make it Today's lesson. Any other lesson currently marked
 * "today" drops back to plain "released" (there is only ever one Today's lesson).
 */
export function makeToday(releases: Releases, lessonId: string): Releases {
  const next: Releases = {};
  for (const [id, r] of Object.entries(releases)) {
    next[id] = r.status === "today" ? { ...r, status: "released" } : r;
  }
  return withRelease(next, lessonId, "today");
}

/** Pull a lesson back to not released. */
export function pullBack(releases: Releases, lessonId: string): Releases {
  const next = { ...releases };
  delete next[lessonId];
  return next;
}

/** Open a lesson for revision without changing Today's lesson. */
export function openForRevision(releases: Releases, lessonId: string): Releases {
  return withRelease(releases, lessonId, "revision");
}

/** Close revision access, returning the lesson to not released. */
export function closeRevision(releases: Releases, lessonId: string): Releases {
  return pullBack(releases, lessonId);
}

/** The lesson id currently marked as Today's lesson, if any. */
export function todayLessonId(releases: Releases): string | undefined {
  return Object.entries(releases).find(([, r]) => r.status === "today")?.[0];
}

/** Whether a student (no login) can open this lesson at all. */
export function isVisibleToStudents(releases: Releases, lessonId: string): boolean {
  const status = releases[lessonId]?.status;
  return status === "released" || status === "today" || status === "revision";
}

/** Sync a class's derived `todayLessonId` field after a release-state change. */
export function syncTodayLessonId(cls: ClassConfig, releases: Releases): ClassConfig {
  return { ...cls, releases, todayLessonId: todayLessonId(releases) };
}
