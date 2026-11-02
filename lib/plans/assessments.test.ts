import { describe, expect, it } from "vitest";
import { ASSESSMENTS, buildCalendar, formatDueDate, isValidDueDate, nextRow, plannedMonday, totalWeight, typeTotals } from "./assessments";

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

describe("buildCalendar", () => {
  const slug = "year-12-applied-it-general";
  const tasks = ASSESSMENTS[slug];

  it("shows every task from day one, in planned order, with a running total that reaches 100", () => {
    const rows = buildCalendar(slug, tasks, undefined);
    expect(rows).toHaveLength(9);
    expect(rows.map((r) => r.task.no)).toEqual([1, 3, 2, 4, 5, 6, 7, 8, 9]);
    expect(rows[rows.length - 1].cumulative).toBe(100);
    expect(rows[0]).toMatchObject({ due: "Term 1, Wk 5", dueNote: "week of 22 Feb (proposed)" });
  });

  it("shows the Externally Set Task as date TBC until the teacher enters a date", () => {
    const row = buildCalendar(slug, tasks, undefined).find((r) => r.task.no === 5)!;
    expect(row).toMatchObject({ due: "Term 2, date TBC", dueNote: "Set by the Authority", tbc: true });
    const dated = buildCalendar(slug, tasks, { t5: { visible: true, dueDate: "2027-06-02" } }).find((r) => r.task.no === 5)!;
    expect(dated).toMatchObject({ due: "Wed 2 Jun 2027", dueNote: "Term 2, Wk 6", tbc: false });
  });

  it("a teacher's date changes the label and the order", () => {
    const rows = buildCalendar(slug, tasks, { t2: { visible: true, dueDate: "2027-02-10" } });
    expect(rows[0].task.no).toBe(2);
    expect(rows[0]).toMatchObject({ due: "Wed 10 Feb 2027", dueNote: "Term 1, Wk 3", dueDate: "2027-02-10" });
  });

  it("hides only the tasks the teacher switched off and re-totals", () => {
    const rows = buildCalendar(slug, tasks, { t5: { visible: false } });
    expect(rows).toHaveLength(8);
    expect(rows[rows.length - 1].cumulative).toBe(85);
  });

  it("totals the course by type and finds the next assessment", () => {
    const rows = buildCalendar(slug, tasks, undefined);
    expect(typeTotals(rows)).toEqual([
      { type: "Project", weight: 50 },
      { type: "Short answer", weight: 20 },
      { type: "Extended answer", weight: 15 },
      { type: "Externally set task", weight: 15 },
    ]);
    expect(nextRow(rows, "2027-03-01")?.task.no).toBe(3);
    expect(nextRow(rows, "2027-12-01")).toBeUndefined();
  });
});
