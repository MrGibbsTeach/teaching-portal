/**
 * Term start dates (Monday of week 1) and how many teaching weeks each term has, used to label a
 * release as "Term 4, Week 3" instead of a bare date. Week numbers are school week numbers, so
 * Term 1 2027 week 1 is the week of 25 Jan (students start on the Friday, Year 11 on Mon 1 Feb).
 *
 * 2027 comes from Bunbury Catholic College's proposed calendar (updated 30 Oct 2026). 2026 is
 * CEWA's published dates as a placeholder.
 */
const TERM_STARTS: { year: number; term: number; start: string; weeks?: number }[] = [
  { year: 2026, term: 1, start: "2026-02-02" },
  { year: 2026, term: 2, start: "2026-04-20" },
  { year: 2026, term: 3, start: "2026-07-13" },
  { year: 2026, term: 4, start: "2026-10-12" },
  { year: 2027, term: 1, start: "2027-01-25", weeks: 11 },
  { year: 2027, term: 2, start: "2027-04-26", weeks: 10 },
  { year: 2027, term: 3, start: "2027-07-19", weeks: 10 },
  { year: 2027, term: 4, start: "2027-10-11", weeks: 10 },
];

export interface TermWeek {
  year: number;
  term: number;
  week: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function mondayOf(d: Date): Date {
  const out = new Date(d);
  const day = out.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  out.setDate(out.getDate() + diff);
  out.setHours(0, 0, 0, 0);
  return out;
}

/** Which term and week a date falls in, or null if before/after all known terms. */
export function termWeekFor(date: Date): TermWeek | null {
  const target = mondayOf(date).getTime();
  let best: { start: Date; year: number; term: number; weeks: number } | null = null;
  for (const t of TERM_STARTS) {
    const start = mondayOf(new Date(t.start));
    if (start.getTime() <= target) {
      if (!best || start.getTime() > best.start.getTime()) {
        best = { start, year: t.year, term: t.term, weeks: t.weeks ?? 12 };
      }
    }
  }
  if (!best) return null;
  const week = Math.floor((target - best.start.getTime()) / (7 * DAY_MS)) + 1;
  if (week < 1 || week > best.weeks) return null; // school holidays after the last week of a term
  return { year: best.year, term: best.term, week };
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "Term 4, Week 3 · Wed 28 Oct", falling back to a plain date outside term time. */
export function releaseLabel(date: Date): string {
  const tw = termWeekFor(date);
  const dateLabel = `${WEEKDAY[date.getDay()]} ${date.getDate()} ${MONTH[date.getMonth()]}`;
  if (!tw) return dateLabel;
  return `Term ${tw.term}, Week ${tw.week} · ${dateLabel}`;
}
