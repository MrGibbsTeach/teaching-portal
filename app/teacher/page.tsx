import Link from "next/link";
import { getClasses } from "@/lib/db";

export default async function TeacherDashboard() {
  const classes = await getClasses();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your Classes</h1>
        <Link
          href="/teacher/classes/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          + New Class
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No classes yet.</p>
          <Link
            href="/teacher/classes/new"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Create your first class →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/teacher/classes/${cls.id}`}
              className="flex items-center justify-between rounded-xl border bg-card p-5 hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-semibold">{cls.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {cls.courseSlug.replace(/-/g, " ")} ·{" "}
                  {cls.students.length} student{cls.students.length !== 1 ? "s" : ""} ·{" "}
                  {cls.unitIds.length} unit{cls.unitIds.length !== 1 ? "s" : ""} unlocked
                </p>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
