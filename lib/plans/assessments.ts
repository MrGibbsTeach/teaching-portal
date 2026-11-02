// Assessment tasks for the 2027 AIT General courses, from the owner's assessment outlines.
// Dates are indicative: the teacher sets the proposed due date per class and chooses when students see a task.
import { getPlan } from "./index";
import type { AssessmentSetting } from "@/lib/auth-types";
import { termWeekFor } from "@/lib/term-dates";

export interface AssessmentTask {
  /** Stable id, used to store the teacher's settings. */
  id: string;
  /** Task number as in the school's outline (Y11 skips 5 and 10, which are exams). */
  no: number;
  name: string;
  type: "Project" | "Short answer" | "Extended answer" | "Externally set task";
  /** Percent of the course. */
  weight: number;
  /** Planned term and week (school week numbers), for the teacher's reference. */
  term: number;
  week: number;
  /** The date is not known yet (set by the Authority). */
  tbc?: boolean;
  covers: string;
}

const t = (
  no: number, name: string, type: AssessmentTask["type"], weight: number,
  term: number, week: number, covers: string, tbc = false,
): AssessmentTask => ({ id: `t${no}`, no, name, type, weight, term, week, covers, ...(tbc ? { tbc: true } : {}) });

export const ASSESSMENTS: Record<string, AssessmentTask[]> = {
  "year-12-applied-it-general": [
    t(1, "Design Book: Digital Wellbeing Awareness Video", "Project", 10, 1, 5, "Unit 3: Project management; Design concepts; Impacts of technology; Application skills"),
    t(2, "Production: Digital Wellbeing Awareness Video", "Project", 15, 1, 9, "Unit 3: Design concepts; Application skills; Project management; Impacts of technology. Unit 4: Application skills"),
    t(3, "Short Answer Test (Unit 3)", "Short answer", 10, 1, 8, "Unit 3: Hardware; Impacts of technology; Application skills"),
    t(4, "Extended Answer Test (Unit 3)", "Extended answer", 5, 2, 4, "Unit 3: Design concepts; Project management"),
    t(5, "Externally Set Task", "Externally set task", 15, 2, 6, "Unit 3 content nominated by the School Curriculum and Standards Authority", true),
    t(6, "Design Book: Subject Selection Guide", "Project", 10, 3, 2, "Unit 3: Design concepts; Project management. Unit 4: Project management; Managing data; Application skills"),
    t(7, "Production: Subject Selection Guide (interactive PDF)", "Project", 15, 3, 6, "Unit 4: Application skills; Managing data; Project management. Unit 3: Design concepts"),
    t(8, "Short Answer Test (Unit 4)", "Short answer", 10, 3, 7, "Unit 4: Managing data; Impacts of technology; Application skills"),
    t(9, "Extended Answer Test (Units 3 and 4)", "Extended answer", 10, 3, 9, "Unit 3: Design concepts. Unit 4: Networks; Managing data"),
  ],
  "year-11-applied-it-general": [
    t(1, "Design Plan: Discover Bunbury Launch Campaign", "Project", 15, 1, 8, "Unit 1: Project management; Design concepts"),
    t(2, "In-Class Test: Impacts of Technology", "Short answer", 10, 1, 9, "Unit 1: Impacts of technology"),
    t(3, "Production: Discover Bunbury Launch Campaign", "Project", 20, 2, 3, "Unit 1: Design concepts; Application skills; Project management. Unit 2: Managing data; Impacts of technology"),
    t(4, "Scenario Task: Unit 1", "Extended answer", 5, 2, 6, "Unit 1: Hardware; Application skills; Design concepts"),
    t(6, "Design Plan: Animated House Page", "Project", 15, 3, 4, "Unit 2: Project management; Application skills"),
    t(7, "In-Class Test: Managing Data and Networks", "Short answer", 10, 3, 8, "Unit 2: Managing data; Networks"),
    t(8, "Production: Animated House Page", "Project", 20, 4, 3, "Unit 2: Application skills; Managing data; Project management"),
    t(9, "Scenario Task: Unit 2", "Extended answer", 5, 4, 5, "Unit 2: Application skills; Networks; Impacts of technology; Project management. Unit 1: Design concepts"),
  ],
};

export function getAssessments(courseSlug: string): AssessmentTask[] | undefined {
  return ASSESSMENTS[courseSlug];
}

export function totalWeight(tasks: AssessmentTask[]): number {
  return tasks.reduce((n, x) => n + x.weight, 0);
}

/** Monday (YYYY-MM-DD) of the week a task is planned for, from the term plan. */
export function plannedMonday(courseSlug: string, task: AssessmentTask): string | undefined {
  return getPlan(courseSlug)?.find((w) => w.term === task.term && w.week === task.week)?.monday;
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function isValidDueDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d && y >= 2026 && y <= 2028;
}

/** "Fri 26 Feb 2027" */
export function formatDueDate(s: string): string {
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${WEEKDAY[dt.getDay()]} ${d} ${MONTH[m - 1]} ${y}`;
}

/** A task is shown to students unless the teacher has switched it off. */
export function isShown(settings: Record<string, AssessmentSetting> | undefined, taskId: string): boolean {
  return settings?.[taskId]?.visible !== false;
}

const addDays = (iso: string, n: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

export interface CalendarRow {
  task: AssessmentTask;
  /** Teacher's proposed date, if entered. */
  dueDate?: string;
  /** Main due label, e.g. "Fri 26 Feb 2027" or "Term 1, Wk 5". */
  due: string;
  /** Second line, e.g. "Term 1, Wk 5" or "week of 22 Feb (proposed)". */
  dueNote: string;
  /** Date (YYYY-MM-DD) used to order rows: the teacher's date, else the planned Monday. */
  sortKey: string;
  /** Last day of the due week (or the due date), used to find the next assessment. */
  endKey: string;
  /** Percent of the course assessed up to and including this row, in date order. */
  cumulative: number;
  /** The date is still to be confirmed (e.g. set by the Authority). */
  tbc: boolean;
}

/**
 * The calendar students see: every task the teacher has not hidden, in date order, with a running total.
 * A teacher's date wins; without one the row shows the planned term and week.
 */
export function buildCalendar(
  courseSlug: string,
  tasks: AssessmentTask[],
  settings: Record<string, AssessmentSetting> | undefined,
): CalendarRow[] {
  const rows = tasks
    .filter((x) => isShown(settings, x.id))
    .map((task) => {
      const dueDate = settings?.[task.id]?.dueDate || undefined;
      const monday = plannedMonday(courseSlug, task) ?? "9999-12-31";
      const planned = `Term ${task.term}, Wk ${task.week}`;
      let due: string, dueNote: string;
      if (dueDate) {
        const tw = termWeekFor(new Date(dueDate + "T00:00:00"));
        due = formatDueDate(dueDate);
        dueNote = tw ? `Term ${tw.term}, Wk ${tw.week}` : "School holidays";
      } else if (task.tbc) {
        due = `Term ${task.term}, date TBC`;
        dueNote = "Set by the Authority";
      } else {
        due = planned;
        const [, m, d] = monday.split("-").map(Number);
        dueNote = `week of ${d} ${MONTH[m - 1]} (proposed)`;
      }
      return {
        task, dueDate, due, dueNote,
        sortKey: dueDate ?? monday,
        endKey: dueDate ?? addDays(monday, 4),
        cumulative: 0,
        tbc: !dueDate && !!task.tbc,
      };
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.task.no - b.task.no);
  let run = 0;
  for (const r of rows) { run += r.task.weight; r.cumulative = run; }
  return rows;
}

/** Percent of the course per assessment type, for the shown tasks. */
export function typeTotals(rows: CalendarRow[]): { type: string; weight: number }[] {
  const out = new Map<string, number>();
  for (const r of rows) out.set(r.task.type, (out.get(r.task.type) ?? 0) + r.task.weight);
  return [...out].map(([type, weight]) => ({ type, weight }));
}

/** The first row whose due date (or due week) has not passed, given today as YYYY-MM-DD. */
export function nextRow(rows: CalendarRow[], today: string): CalendarRow | undefined {
  return rows.find((r) => r.endKey >= today);
}
