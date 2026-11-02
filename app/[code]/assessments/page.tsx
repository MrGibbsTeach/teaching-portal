import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { buildCalendar, getAssessments, typeTotals } from "@/lib/plans/assessments";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();

  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();

  const course = getCourseBySlug(cls.courseSlug);
  const tasks = getAssessments(cls.courseSlug) ?? [];
  const rows = buildCalendar(cls.courseSlug, tasks, cls.assessments);
  const totals = typeTotals(rows);
  const total = rows.length ? rows[rows.length - 1].cumulative : 0;

  return (
    <CourseTierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href={`/${normalized}`} className="text-sm text-muted-foreground hover:text-primary">
          ← {cls.name}
        </Link>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight">Assessment calendar</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {rows.length} tasks, {total}% in total. These are proposed dates. They may change, and your teacher will give you at
          least one week&apos;s notice of any change.
        </p>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border p-8">
            <p className="text-muted-foreground">Your teacher has not added any assessments yet.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-border text-left text-xs font-semibold text-muted-foreground">
                    <th className="px-2 py-2">#</th>
                    <th className="px-2 py-2">Task</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2 text-right">Weight</th>
                    <th className="px-2 py-2">Due</th>
                    <th className="px-2 py-2">Running total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.task.id} className="border-b border-border align-top">
                      <td className="px-2 py-3 tabular-nums text-muted-foreground">{r.task.no}</td>
                      <td className="px-2 py-3">
                        <p className="font-bold">{r.task.name}</p>
                        <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">{r.task.covers}</p>
                      </td>
                      <td className="px-2 py-3">{r.task.type}</td>
                      <td className="px-2 py-3 text-right font-semibold tabular-nums">{r.task.weight}%</td>
                      <td className="px-2 py-3">
                        <p className={r.dueDate ? "font-semibold text-primary" : "font-medium"}>{r.due}</p>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{r.dueNote}</p>
                      </td>
                      <td className="px-2 py-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${r.cumulative}%` }} />
                        </div>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{r.cumulative}% done</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {totals.map((t) => (
                <span key={t.type} className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm">
                  {t.type}: <strong>{t.weight}%</strong>
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </CourseTierTheme>
  );
}
