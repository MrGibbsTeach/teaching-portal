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

  it("2027: Term 1 week 1 is the week of 25 Jan, so Year 11 start in week 2", () => {
    expect(termWeekFor(new Date("2027-01-29T09:00:00"))).toEqual({ year: 2027, term: 1, week: 1 });
    expect(termWeekFor(new Date("2027-02-01T09:00:00"))).toEqual({ year: 2027, term: 1, week: 2 });
  });

  it("2027: Term 1 has 11 weeks and the holidays after it are not a week", () => {
    expect(termWeekFor(new Date("2027-04-05T09:00:00"))).toEqual({ year: 2027, term: 1, week: 11 });
    expect(termWeekFor(new Date("2027-04-12T09:00:00"))).toBeNull();
    expect(termWeekFor(new Date("2027-04-26T09:00:00"))).toEqual({ year: 2027, term: 2, week: 1 });
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
