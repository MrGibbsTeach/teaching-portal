import { describe, expect, it } from "vitest";
import { getCourseContent } from "@/lib/content";
import { PLANS } from "./general-2027";
import { currentPlanWeek, resolveLessonRef } from "./index";
import { termWeekFor } from "@/lib/term-dates";

describe("2027 term plans", () => {
  for (const [slug, plan] of Object.entries(PLANS)) {
    const content = getCourseContent(slug);
    const ids = content ? content.units.flatMap((u) => u.topics.flatMap((t) => t.lessons.map((l) => l.id))) : [];

    it(`${slug}: every planned lesson ref resolves to exactly one lesson`, () => {
      expect(content).toBeTruthy();
      for (const w of plan) for (const ref of w.lessons) {
        expect(resolveLessonRef(ref, ids), `T${w.term} W${w.week}: ${ref}`).toBeTruthy();
      }
    });

    it(`${slug}: weeks start on a Monday and agree with the term dates`, () => {
      for (const w of plan) {
        const d = new Date(w.monday + "T00:00:00");
        expect(d.getDay(), `${w.monday} is not a Monday`).toBe(1);
        expect(termWeekFor(d), w.monday).toEqual({ year: 2027, term: w.term, week: w.week });
      }
    });

    it(`${slug}: weeks run in order with no gaps in week numbers`, () => {
      let prev: { term: number; week: number; t: number } | null = null;
      for (const w of plan) {
        const t = new Date(w.monday + "T00:00:00").getTime();
        if (prev) {
          expect(t).toBeGreaterThan(prev.t);
          if (w.term === prev.term) expect(w.week).toBe(prev.week + 1);
          else expect(w.week).toBe(1);
        }
        prev = { term: w.term, week: w.week, t };
      }
    });
  }

  it("finds the current plan week, or the next one in the holidays", () => {
    const plan = PLANS["year-12-applied-it-general"];
    expect(currentPlanWeek(plan, new Date("2027-02-03T10:00:00"))).toMatchObject({ term: 1, week: 2 });
    expect(currentPlanWeek(plan, new Date("2027-04-14T10:00:00"))).toMatchObject({ term: 2, week: 1 });
  });
});
