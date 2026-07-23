import { createClass } from "@/app/actions/classes";
import { courses } from "@/lib/courses";

export default function NewClassPage() {
  const activeCourses = courses.filter((c) => c.status === "active");

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Create a Class</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Give your class a name and select the course.
      </p>

      <form action={createClass} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Class name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoFocus
            placeholder="e.g. 2026 Year 11 AIT General"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="courseSlug" className="block text-sm font-medium mb-1.5">
            Course
          </label>
          <select
            id="courseSlug"
            name="courseSlug"
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {activeCourses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.yearLevel} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Create Class
        </button>
      </form>
    </div>
  );
}
