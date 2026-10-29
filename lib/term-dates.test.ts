import { describe, expect, it } from "vitest";
import { releaseLabel, termWeekFor } from "./term-dates";

describe("termWeekFor", () => {
  it("places the sample release date (Wed 28 Oct 2026) in Term 4, Week 3", () => {
    expect(termWeekFor(new Date("2026-10-28T09:00:00"))).toEqual({ year: 2026, term: 4, week: 3 });
  });

  it("week 1 starts on the term's Monday", () => {
    expect(termWeekFor(new Date("2026-10-12T00:00:00"))).toEqual({ year: 2026, term: 4, week: 1 });
  });

  it("any day in a week maps to the same week", () => {
    expect(termWeekFor(new Date("2026-10-16T23:00:00"))).toEqual({ year: 2026, term: 4, week: 1 });
    expect(termWeekFor(new Date("2026-10-19T00:00:00"))).toEqual({ year: 2026, term: 4, week: 2 });
  });

  it("returns null for a date before the first known term", () => {
    expect(termWeekFor(new Date("2025-01-01"))).toBeNull();
  });
});

describe("releaseLabel", () => {
  it("formats a release with its term and week", () => {
    expect(releaseLabel(new Date("2026-10-28T09:00:00"))).toBe("Term 4, Week 3 · Wed 28 Oct");
  });
});
