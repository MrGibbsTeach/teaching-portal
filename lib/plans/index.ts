import type { PlanWeek, TermPlan } from "./types";
import { PLANS } from "./general-2027";

export type { PlanWeek, TermPlan, PlanEvent, PlanNote } from "./types";

/** The 2027 teaching plan for a course, or undefined if that course has none. */
export function getPlan(courseSlug: string): TermPlan | undefined {
  return PLANS[courseSlug];
}

/** Resolve a plan lesson ref (exact id, or an id prefix followed by "-") to a lesson id. */
export function resolveLessonRef(ref: string, lessonIds: string[]): string | undefined {
  if (lessonIds.includes(ref)) return ref;
  const hits = lessonIds.filter((id) => id.startsWith(ref + "-"));
  return hits.length === 1 ? hits[0] : undefined;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** The plan week containing a date (Monday to Sunday), or the next one if the date is in a gap. */
export function currentPlanWeek(plan: TermPlan, date: Date): PlanWeek | undefined {
  const t = date.getTime();
  const starts = plan.map((w) => ({ w, start: new Date(w.monday + "T00:00:00").getTime() }));
  const inside = starts.find((s) => t >= s.start && t < s.start + 7 * DAY_MS);
  if (inside) return inside.w;
  const next = starts.find((s) => s.start > t);
  return next?.w ?? plan[plan.length - 1];
}
