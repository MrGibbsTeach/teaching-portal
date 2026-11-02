import { LessonReleaseRow } from "@/components/teacher/LessonReleaseRow";
import { ReleaseWeekButton } from "@/components/teacher/ReleaseWeekButton";
import {
  releaseLesson,
  makeTodayLesson,
  pullBackLesson,
  openRevisionLesson,
  closeRevisionLesson,
  releaseWeekLessons,
} from "@/app/actions/classes";
import { resolveLessonRef, type PlanEvent, type PlanWeek, type TermPlan } from "@/lib/plans";
import type { LessonRelease } from "@/lib/auth-types";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function span(monday: string): string {
  const [y, m, d] = monday.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(y, m - 1, d + 4);
  return `${start.getDate()} ${MONTH[start.getMonth()]} to ${end.getDate()} ${MONTH[end.getMonth()]}`;
}

const PILL: Record<PlanEvent["kind"], string> = {
  cp: "border-indigo-200 bg-indigo-50 text-indigo-700",
  due: "border-amber-200 bg-amber-50 text-amber-800",
  test: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-border bg-muted text-foreground",
};

/**
 * The 2027 term plan for a class: weeks laid out by term, each with its planned lessons,
 * assessment points and calendar notes, and release controls on every lesson.
 * Dates are indicative (see claude/general-2027-term-plan.md), so release is still the teacher's call.
 */
export function TermPlanView({
  classId,
  plan,
  lessons,
  releases,
  currentWeek,
  today,
}: {
  classId: string;
  plan: TermPlan;
  lessons: { id: string; title: string }[];
  releases: Record<string, LessonRelease>;
  currentWeek?: PlanWeek;
  today: Date;
}) {
  const ids = lessons.map((l) => l.id);
  const titleOf = new Map(lessons.map((l) => [l.id, l.title]));
  const terms = [...new Set(plan.map((w) => w.term))];
  const status = (id: string) => releases[id]?.status ?? "not_released";

  return (
    <div className="mt-4 space-y-4">
      {terms.map((term) => {
        const weeks = plan.filter((w) => w.term === term);
        return (
          <details key={term} open={currentWeek?.term === term} className="rounded-2xl border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
              <span className="text-base font-bold tracking-tight">Term {term}</span>
              <span className="text-xs text-muted-foreground">{weeks.length} weeks</span>
            </summary>
            <div className="space-y-3 px-4 pb-4">
              {weeks.map((w) => {
                const resolved = [...new Set(w.lessons.map((r) => resolveLessonRef(r, ids)).filter((x): x is string => !!x))];
                const done = resolved.filter((id) => status(id) !== "not_released").length;
                const isFocus = currentWeek?.term === w.term && currentWeek.week === w.week;
                const start = new Date(w.monday + "T00:00:00").getTime();
                const isNow = isFocus && today.getTime() >= start && today.getTime() < start + 7 * 24 * 60 * 60 * 1000;
                return (
                  <details
                    key={`${w.term}-${w.week}`}
                    open={isFocus}
                    className={`rounded-xl border ${isFocus ? "border-primary" : "border-border"}`}
                  >
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-4 py-3">
                      <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-sm font-bold">Week {w.week}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {span(w.monday)} · {w.days} {w.days === 1 ? "day" : "days"}
                        </span>
                        {isFocus && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[0.7rem] font-semibold text-primary-foreground">{isNow ? "This week" : "Up next"}</span>
                        )}
                        <span className="truncate text-sm text-muted-foreground">{w.topic}</span>
                      </span>
                      <span className="flex flex-wrap items-center gap-2">
                        {w.events.map((e, i) => (
                          <span key={i} className={`rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold ${PILL[e.kind]}`}>{e.text}</span>
                        ))}
                        {resolved.length > 0 && (
                          <span className="text-xs text-muted-foreground tabular-nums">{done} of {resolved.length} released</span>
                        )}
                      </span>
                    </summary>
                    <div className="space-y-3 px-4 pb-4">
                      <p className="text-sm text-muted-foreground">{w.body}</p>
                      {w.notes.map((n, i) => (
                        <p
                          key={i}
                          className={`rounded-lg border-l-4 px-3 py-2 text-xs ${
                            n.soft ? "border-border bg-muted text-muted-foreground" : "border-amber-500 bg-amber-50 text-amber-900"
                          }`}
                        >
                          {n.text}
                        </p>
                      ))}
                      {resolved.length === 0 ? (
                        <p className="text-sm italic text-muted-foreground">
                          No existing lessons are planned for this week. Project build sessions and catch-up happen outside the course pages.
                        </p>
                      ) : (
                        <>
                          <div className="flex justify-end">
                            <ReleaseWeekButton count={resolved.length} onRelease={releaseWeekLessons.bind(null, classId, resolved)} />
                          </div>
                          <div className="space-y-2">
                            {resolved.map((id) => (
                              <LessonReleaseRow
                                key={id}
                                title={titleOf.get(id) ?? id}
                                status={status(id)}
                                onRelease={releaseLesson.bind(null, classId, id)}
                                onMakeToday={makeTodayLesson.bind(null, classId, id)}
                                onPullBack={pullBackLesson.bind(null, classId, id)}
                                onOpenRevision={openRevisionLesson.bind(null, classId, id)}
                                onCloseRevision={closeRevisionLesson.bind(null, classId, id)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
