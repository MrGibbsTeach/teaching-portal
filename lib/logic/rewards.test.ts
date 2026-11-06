import { describe, expect, it } from "vitest";
import {
  MILESTONES,
  activeDays,
  buildRewardState,
  currentStreak,
  dayInTimeZone,
  longestStreak,
  shiftDay,
} from "./rewards";

const TODAY = "2026-11-06";

describe("milestones", () => {
  it("has exactly five, in order, with unique ids", () => {
    expect(MILESTONES.map((m) => m.id)).toEqual([
      "first-lesson",
      "five-lessons",
      "ten-lessons",
      "three-days",
      "three-in-a-row",
    ]);
  });

  it("starts with nothing earned and First lesson as the next one", () => {
    const state = buildRewardState({ today: TODAY });
    expect(state.earnedCount).toBe(0);
    expect(state.badges).toHaveLength(5);
    expect(state.next?.id).toBe("first-lesson");
    expect(state.lessonsDone).toBe(0);
    expect(state.daysActive).toBe(0);
    expect(state.currentStreak).toBe(0);
  });

  it("counts a lesson known only from the device's completed list", () => {
    const state = buildRewardState({ doneLessonIds: ["a"], today: TODAY });
    expect(state.lessonsDone).toBe(1);
    expect(state.badges[0].earned).toBe(true);
    // No dated events, so no day or streak credit.
    expect(state.daysActive).toBe(0);
    expect(state.next?.id).toBe("five-lessons");
  });
});

describe("same-day repeats do not double count", () => {
  it("collapses two finishes of one lesson on one day to a single lesson", () => {
    const events = [
      { lessonId: "a", day: TODAY },
      { lessonId: "a", day: TODAY },
    ];
    const state = buildRewardState({ events, today: TODAY });
    expect(state.lessonsDone).toBe(1);
    expect(state.daysActive).toBe(1);
    expect(state.currentStreak).toBe(1);
    expect(state.earnedCount).toBe(1);
  });

  it("does not let repeats on one day reach the five-lesson milestone", () => {
    const events = Array.from({ length: 6 }, () => ({ lessonId: "a", day: TODAY }));
    const state = buildRewardState({ events, today: TODAY });
    expect(state.lessonsDone).toBe(1);
    expect(state.badges.find((b) => b.id === "five-lessons")?.earned).toBe(false);
  });

  it("does not let repeats of one lesson across days reach a lesson milestone", () => {
    const events = [
      { lessonId: "a", day: "2026-11-04" },
      { lessonId: "a", day: "2026-11-05" },
      { lessonId: "a", day: "2026-11-06" },
    ];
    const state = buildRewardState({ events, today: TODAY });
    expect(state.lessonsDone).toBe(1);
    expect(state.daysActive).toBe(3);
    expect(state.badges.find((b) => b.id === "five-lessons")?.earned).toBe(false);
    // The day and streak milestones are about showing up, so they are earned.
    expect(state.badges.find((b) => b.id === "three-days")?.earned).toBe(true);
    expect(state.badges.find((b) => b.id === "three-in-a-row")?.earned).toBe(true);
  });

  it("counts a lesson once even if it appears in both the list and the events", () => {
    const state = buildRewardState({
      doneLessonIds: ["a"],
      events: [{ lessonId: "a", day: TODAY }],
      today: TODAY,
    });
    expect(state.lessonsDone).toBe(1);
    expect(state.daysActive).toBe(1);
  });
});

describe("lesson milestones", () => {
  it("awards five and ten at the right counts, not before", () => {
    const four = buildRewardState({
      doneLessonIds: ["a", "b", "c", "d"],
      today: TODAY,
    });
    expect(four.badges.find((b) => b.id === "five-lessons")?.earned).toBe(false);

    const five = buildRewardState({
      doneLessonIds: ["a", "b", "c", "d", "e"],
      today: TODAY,
    });
    expect(five.badges.find((b) => b.id === "five-lessons")?.earned).toBe(true);
    expect(five.badges.find((b) => b.id === "ten-lessons")?.earned).toBe(false);

    const ten = buildRewardState({
      events: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((lessonId, i) => ({
        lessonId,
        day: shiftDay("2026-11-04", i % 3),
      })),
      today: TODAY,
    });
    expect(ten.badges.find((b) => b.id === "ten-lessons")?.earned).toBe(true);
    expect(ten.next).toBeNull();
    expect(ten.earnedCount).toBe(5);
  });
});

describe("days and streaks", () => {
  it("counts three separate days even when they are not in a row", () => {
    const events = [
      { lessonId: "a", day: "2026-10-01" },
      { lessonId: "b", day: "2026-10-05" },
      { lessonId: "c", day: "2026-11-06" },
    ];
    const state = buildRewardState({ events, today: TODAY });
    expect(state.daysActive).toBe(3);
    expect(state.badges.find((b) => b.id === "three-days")?.earned).toBe(true);
    expect(state.badges.find((b) => b.id === "three-in-a-row")?.earned).toBe(false);
  });

  it("keeps the three-in-a-row badge after the run has ended", () => {
    const events = [
      { lessonId: "a", day: "2026-10-01" },
      { lessonId: "b", day: "2026-10-02" },
      { lessonId: "c", day: "2026-10-03" },
    ];
    const state = buildRewardState({ events, today: TODAY });
    expect(state.currentStreak).toBe(0);
    expect(state.badges.find((b) => b.id === "three-in-a-row")?.earned).toBe(true);
  });

  it("treats yesterday as a live streak, and the day before as broken", () => {
    const yesterday = shiftDay(TODAY, -1);
    expect(currentStreak(["2026-11-04", yesterday], TODAY)).toBe(2);
    expect(currentStreak(["2026-11-03", "2026-11-04"], TODAY)).toBe(0);
  });

  it("measures the longest run anywhere in the history", () => {
    expect(longestStreak(["2026-11-01", "2026-11-02", "2026-11-05"])).toBe(2);
    expect(longestStreak([])).toBe(0);
    expect(activeDays([])).toEqual([]);
  });
});

describe("dayInTimeZone", () => {
  it("uses the Perth calendar day, not UTC", () => {
    // 23:30 UTC on 6 Nov is 07:30 on 7 Nov in Perth.
    expect(dayInTimeZone(new Date("2026-11-06T23:30:00Z"))).toBe("2026-11-07");
    // 15:59 UTC on 6 Nov is 23:59 on 6 Nov in Perth.
    expect(dayInTimeZone(new Date("2026-11-06T15:59:00Z"))).toBe("2026-11-06");
  });
});
