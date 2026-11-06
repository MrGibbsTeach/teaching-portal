import { describe, expect, it } from "vitest";
import {
  MILESTONES,
  activeDays,
  buildRewardState,
  currentSchoolRun,
  dayInTimeZone,
  isSchoolDay,
  longestSchoolRun,
  schoolDayIndex,
  shiftDay,
} from "./rewards";

// 6 Nov 2026 is a Friday, so the fixtures below are easy to read:
// Fri 6, Sat 7, Sun 8, Mon 9, Tue 10, Wed 11, Thu 12, Fri 13.
const FRI = "2026-11-06";
const SAT = "2026-11-07";
const SUN = "2026-11-08";
const MON = "2026-11-09";
const TUE = "2026-11-10";
const WED = "2026-11-11";
const THU = "2026-11-12";
const NEXT_FRI = "2026-11-13";

const ev = (lessonId: string, day: string) => ({ lessonId, day });

describe("milestones", () => {
  it("has exactly five, and the day-based two say different things", () => {
    expect(MILESTONES.map((m) => m.id)).toEqual([
      "first-lesson",
      "five-lessons",
      "ten-lessons",
      "five-days",
      "five-school-days",
    ]);
    const names = MILESTONES.map((m) => m.name);
    expect(names).toContain("Five active days");
    expect(names).toContain("Five school days in a row");
    expect(new Set(names).size).toBe(5);
  });

  it("starts with nothing earned and First lesson as the next one", () => {
    const state = buildRewardState({ today: FRI });
    expect(state.earnedCount).toBe(0);
    expect(state.badges).toHaveLength(5);
    expect(state.next?.id).toBe("first-lesson");
    expect(state.lessonsDone).toBe(0);
    expect(state.daysActive).toBe(0);
    expect(state.currentSchoolRun).toBe(0);
  });

  it("counts a lesson known only from the device's completed list", () => {
    const state = buildRewardState({ doneLessonIds: ["a"], today: FRI });
    expect(state.lessonsDone).toBe(1);
    expect(state.badges[0].earned).toBe(true);
    expect(state.daysActive).toBe(0);
    expect(state.next?.id).toBe("five-lessons");
  });
});

describe("same-day repeats do not double count", () => {
  it("collapses two finishes of one lesson on one day to a single lesson", () => {
    const state = buildRewardState({ events: [ev("a", FRI), ev("a", FRI)], today: FRI });
    expect(state.lessonsDone).toBe(1);
    expect(state.daysActive).toBe(1);
    expect(state.currentSchoolRun).toBe(1);
    expect(state.earnedCount).toBe(1);
  });

  it("does not let repeats on one day reach the five-lesson milestone", () => {
    const events = Array.from({ length: 6 }, () => ev("a", FRI));
    const state = buildRewardState({ events, today: FRI });
    expect(state.lessonsDone).toBe(1);
    expect(state.badges.find((b) => b.id === "five-lessons")?.earned).toBe(false);
  });

  it("does not let repeats of one lesson across days reach a lesson milestone", () => {
    const events = [ev("a", WED), ev("a", THU), ev("a", NEXT_FRI)];
    const state = buildRewardState({ events, today: NEXT_FRI });
    expect(state.lessonsDone).toBe(1);
    expect(state.daysActive).toBe(3);
    expect(state.badges.find((b) => b.id === "five-lessons")?.earned).toBe(false);
  });

  it("counts a lesson once even if it appears in both the list and the events", () => {
    const state = buildRewardState({
      doneLessonIds: ["a"],
      events: [ev("a", FRI)],
      today: FRI,
    });
    expect(state.lessonsDone).toBe(1);
    expect(state.daysActive).toBe(1);
  });
});

describe("lesson milestones", () => {
  it("awards five and ten at the right counts, not before", () => {
    expect(buildRewardState({ doneLessonIds: ["a", "b", "c", "d"], today: FRI }).badges[1].earned).toBe(false);
    expect(buildRewardState({ doneLessonIds: ["a", "b", "c", "d", "e"], today: FRI }).badges[1].earned).toBe(true);
    expect(buildRewardState({ doneLessonIds: ["a", "b", "c"], today: FRI }).badges[2].earned).toBe(false);
  });

  it("earns all five at once when everything is done", () => {
    const days = [MON, TUE, WED, THU, NEXT_FRI];
    const events = days.flatMap((day) => [
      ev(`${day}-1`, day),
      ev(`${day}-2`, day),
    ]);
    const state = buildRewardState({ events, today: NEXT_FRI });
    expect(state.lessonsDone).toBe(10);
    expect(state.earnedCount).toBe(5);
    expect(state.next).toBeNull();
  });
});

describe("five active days", () => {
  it("counts five separate days that are not in a row", () => {
    const events = [ev("a", "2026-11-02"), ev("b", "2026-11-04"), ev("c", SAT), ev("d", SUN), ev("e", TUE)];
    const state = buildRewardState({ events, today: TUE });
    expect(state.daysActive).toBe(5);
    expect(state.badges.find((b) => b.id === "five-days")?.earned).toBe(true);
    expect(state.badges.find((b) => b.id === "five-school-days")?.earned).toBe(false);
  });

  it("counts weekend days as activity", () => {
    const days = activeDays([ev("a", SAT), ev("b", SUN)]);
    expect(days).toEqual([SAT, SUN]);
  });
});

describe("five school days in a row", () => {
  it("runs Monday to Friday", () => {
    const events = [MON, TUE, WED, THU, NEXT_FRI].map((day, i) => ev(`l${i}`, day));
    const state = buildRewardState({ events, today: NEXT_FRI });
    expect(state.longestSchoolRun).toBe(5);
    expect(state.badges.find((b) => b.id === "five-school-days")?.earned).toBe(true);
  });

  it("treats Friday then Monday as consecutive, because the weekend does not break it", () => {
    expect(longestSchoolRun([FRI, MON])).toBe(2);
    expect(longestSchoolRun([FRI, SAT, SUN, MON])).toBe(2);
  });

  it("does not let a weekend add to the run", () => {
    // Friday and Monday are two school days, however much happened at the weekend.
    const state = buildRewardState({
      events: [ev("a", FRI), ev("b", SAT), ev("c", SUN), ev("d", MON)],
      today: MON,
    });
    expect(state.daysActive).toBe(4);
    expect(state.longestSchoolRun).toBe(2);
  });

  it("breaks when a school day is skipped", () => {
    expect(longestSchoolRun([MON, WED])).toBe(1);
    expect(longestSchoolRun([MON, TUE, THU, NEXT_FRI])).toBe(2);
  });

  it("spans a weekend in the middle of a run of five", () => {
    // Thu 5, Fri 6, (weekend), Mon 9, Tue 10, Wed 11 = five school days.
    const days = ["2026-11-05", FRI, MON, TUE, WED];
    expect(longestSchoolRun(days)).toBe(5);
  });

  it("keeps the badge after the run has ended", () => {
    const events = [MON, TUE, WED, THU, NEXT_FRI].map((day, i) => ev(`l${i}`, day));
    const state = buildRewardState({ events, today: "2026-11-20" });
    expect(state.currentSchoolRun).toBe(0);
    expect(state.badges.find((b) => b.id === "five-school-days")?.earned).toBe(true);
  });

  it("keeps a run alive across Monday when the last finish was Friday", () => {
    expect(currentSchoolRun([FRI, MON], MON)).toBe(2);
    expect(currentSchoolRun([FRI], MON)).toBe(1);
    expect(currentSchoolRun([WED], MON)).toBe(0);
  });
});

describe("school day helpers", () => {
  it("knows weekends", () => {
    expect(isSchoolDay(FRI)).toBe(true);
    expect(isSchoolDay(SAT)).toBe(false);
    expect(isSchoolDay(SUN)).toBe(false);
  });

  it("makes Friday and the following Monday adjacent, and Saturday null", () => {
    const fri = schoolDayIndex(FRI);
    const sat = schoolDayIndex(SAT);
    const mon = schoolDayIndex(MON);
    expect(sat).toBeNull();
    expect(fri).not.toBeNull();
    expect(mon).toBe((fri as number) + 1);
  });

  it("does not count a weekend in the sequence", () => {
    const wed = schoolDayIndex(WED) as number;
    const fri = schoolDayIndex(NEXT_FRI) as number;
    expect(fri - wed).toBe(2);
  });
});

describe("dayInTimeZone", () => {
  it("uses the Perth calendar day, not UTC", () => {
    expect(dayInTimeZone(new Date("2026-11-06T23:30:00Z"))).toBe("2026-11-07");
    expect(dayInTimeZone(new Date("2026-11-06T15:59:00Z"))).toBe("2026-11-06");
  });
});

describe("shiftDay", () => {
  it("moves across a month and a year boundary", () => {
    expect(shiftDay("2026-11-30", 1)).toBe("2026-12-01");
    expect(shiftDay("2026-12-31", 1)).toBe("2027-01-01");
    expect(shiftDay("2026-11-01", -1)).toBe("2026-10-31");
  });
});
