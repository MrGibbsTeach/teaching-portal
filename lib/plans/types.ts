export type PlanEventKind = "cp" | "due" | "test" | "info";

export interface PlanEvent {
  kind: PlanEventKind;
  text: string;
}

export interface PlanNote {
  text: string;
  /** Soft notes are reference only (OLNA, holidays). Others are things to watch. */
  soft: boolean;
}

export interface PlanWeek {
  term: number;
  week: number;
  /** Monday of the week, YYYY-MM-DD (school week numbers, term 1 week 1 is the week of 25 Jan 2027). */
  monday: string;
  /** School days students are in for this class (0 means no students that week). */
  days: number;
  topic: string;
  body: string;
  events: PlanEvent[];
  notes: PlanNote[];
  /** Lesson ids, or id prefixes, planned for this week. */
  lessons: string[];
}

export type TermPlan = PlanWeek[];
