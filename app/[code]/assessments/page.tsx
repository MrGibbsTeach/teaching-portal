import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { formatDueDate, getAssessments, visibleAssessments } from "@/lib/plans/assessments";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();

  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();

  const course = getCourseBySlug(cls.courseSlug);
  const tasks = getAssessments(cls.courseSlug) ?? [];
  const list = visibleAssessments(tasks, cls.assessments);

  return (
    <CourseTierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href={`/${normalized}`} className="text-sm text-muted-foreground hover:text-primary">
          ← {cls.name}
        </Link>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight">Assessments</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          These are the proposed dates. They may change, and your teacher will give you at least one week&apos;s notice of any change.
        </p>

        {list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border p-8">
            <p className="text-muted-foreground">Your teacher has not added any assessment dates yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {list.map(({ task, dueDate }) => (
              <div key={task.id} className="rounded-2xl border border-border p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{task.type}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{task.weight}% of your course</span>
                </div>
                <h2 className="mt-3 font-heading text-xl font-bold tracking-tight">{task.name}</h2>
                <p className="mt-2 text-sm font-semibold">
                  {dueDate ? (
                    <>Proposed date: <span className="text-primary">{formatDueDate(dueDate)}</span></>
                  ) : (
                    <span className="text-muted-foreground">Date to be confirmed</span>
                  )}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Covers: {task.covers}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </CourseTierTheme>
  );
}
