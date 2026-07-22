import { notFound } from "next/navigation";
import Link from "next/link";
import { getClass } from "@/lib/db";
import { getCourseContent } from "@/lib/content";
import { getCourseBySlug } from "@/lib/courses";
import { updateAccess, addStudent, removeStudent, removeClass } from "@/app/actions/classes";

export default async function ClassManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cls = await getClass(id);
  if (!cls) notFound();

  const course = getCourseBySlug(cls.courseSlug);
  const content = getCourseContent(cls.courseSlug);

  const updateAccessForClass = updateAccess.bind(null, cls.id);
  const addStudentToClass = addStudent.bind(null, cls.id);
  const deleteClass = removeClass.bind(null, cls.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-12">
      {/* Header */}
      <div>
        <Link href="/teacher" className="text-sm text-muted-foreground hover:underline">
          ← All classes
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{cls.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {course?.title ?? cls.courseSlug} · {course?.yearLevel}
        </p>
      </div>

      {/* Unit Access */}
      <section>
        <h2 className="text-lg font-semibold">Unit Access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle which units students in this class can see.
        </p>

        {!content ? (
          <p className="mt-4 text-sm text-muted-foreground italic">
            Course content not yet available.
          </p>
        ) : (
          <form action={updateAccessForClass} className="mt-4 space-y-3">
            {content.units.map((unit) => {
              const checked = cls.unitIds.includes(unit.id);
              return (
                <label
                  key={unit.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                    checked ? "border-primary bg-primary/5" : "hover:bg-accent"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="unitId"
                    value={unit.id}
                    defaultChecked={checked}
                    className="h-4 w-4 accent-primary"
                  />
                  <div>
                    {unit.subtitle && (
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        {unit.subtitle}
                      </p>
                    )}
                    <p className="font-medium">{unit.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {unit.topics.length} topics ·{" "}
                      {unit.topics.reduce((n, t) => n + t.lessons.length, 0)} lessons
                    </p>
                  </div>
                </label>
              );
            })}
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Save Access
            </button>
          </form>
        )}
      </section>

      {/* Students */}
      <section>
        <h2 className="text-lg font-semibold">Students</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Students use their username and passcode to log in.
        </p>

        {/* Add Student */}
        <form action={addStudentToClass} className="mt-4 flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">
              Full name
            </label>
            <input
              name="displayName"
              type="text"
              required
              placeholder="Alex Johnson"
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">
              Passcode
            </label>
            <input
              name="passcode"
              type="text"
              required
              placeholder="dog42"
              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary w-28"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Add Student
          </button>
        </form>

        {cls.students.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground italic">
            No students yet. Add them above.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Username</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Passcode</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cls.students.map((s) => {
                  const removeAction = removeStudent.bind(null, cls.id, s.username);
                  return (
                    <tr key={s.username} className="hover:bg-muted/20">
                      <td className="px-4 py-3">{s.displayName}</td>
                      <td className="px-4 py-3 font-mono text-xs">{s.username}</td>
                      <td className="px-4 py-3 font-mono text-xs">{s.passcode}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={removeAction}>
                          <button
                            type="submit"
                            className="text-xs text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {cls.students.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Students log in at <strong>/login/student</strong> with their username and passcode above.
          </p>
        )}
      </section>

      {/* Danger zone */}
      <section className="border-t pt-8">
        <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
        <form action={deleteClass} className="mt-3">
          <button
            type="submit"
            className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-white transition-colors"
            onClick={(e) => {
              if (!confirm(`Delete "${cls.name}"? This cannot be undone.`)) e.preventDefault();
            }}
          >
            Delete this class
          </button>
        </form>
      </section>
    </div>
  );
}
