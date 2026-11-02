import { describe, expect, it } from "vitest";
import { ASSESSMENTS, formatDueDate, isValidDueDate, nextAssessment, plannedMonday, totalWeight, visibleAssessments } from "./assessments";

describe("assessment tasks", () => {
  for (const [slug, tasks] of Object.entries(ASSESSMENTS)) {
    it(`${slug}: weights total 100 and ids are unique`, () => {
      expect(totalWeight(tasks)).toBe(100);
      expect(new Set(tasks.map((x) => x.id)).size).toBe(tasks.length);
    });
    it(`${slug}: every task is planned in a week that exists in the term plan`, () => {
      for (const x of tasks) expect(plannedMonday(slug, x), `task ${x.no}`).toBeTruthy();
    });
  }
  it("Year 12 has nine tasks and Year 11 has eight (no exam tasks)", () => {
    expect(ASSESSMENTS["year-12-applied-it-general"]).toHaveLength(9);
    expect(ASSESSMENTS["year-11-applied-it-general"]).toHaveLength(8);
  });
});

describe("due dates", () => {
  it("validates and formats dates", () => {
    expect(isValidDueDate("2027-02-26")).toBe(true);
    expect(isValidDueDate("2027-02-30")).toBe(false);
    expect(isValidDueDate("26/02/2027")).toBe(false);
    expect(isValidDueDate("")).toBe(false);
    expect(formatDueDate("2027-02-26")).toBe("Fri 26 Feb 2027");
  });
});

describe("visibleAssessments", () => {
  const tasks = ASSESSMENTS["year-12-applied-it-general"];
  it("shows only tasks the teacher switched on, dated ones first in date order", () => {
    const list = visibleAssessments(tasks, {
      t1: { visible: true, dueDate: "2027-02-26" },
      t3: { visible: true },
      t2: { visible: true, dueDate: "2027-02-19" },
      t4: { visible: false, dueDate: "2027-05-21" },
    });
    expect(list.map((x) => x.task.id)).toEqual(["t2", "t1", "t3"]);
  });
  it("shows nothing by default", () => {
    expect(visibleAssessments(tasks, undefined)).toEqual([]);
  });
  it("finds the next dated task on or after today", () => {
    const list = visibleAssessments(tasks, { t1: { visible: true, dueDate: "2027-02-26" }, t2: { visible: true, dueDate: "2027-03-26" } });
    expect(nextAssessment(list, "2027-02-26")?.task.id).toBe("t1");
    expect(nextAssessment(list, "2027-02-27")?.task.id).toBe("t2");
    expect(nextAssessment(list, "2027-04-01")).toBeUndefined();
  });
});
