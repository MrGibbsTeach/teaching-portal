import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/courses";
import type { CourseContent } from "@/lib/content/types";

export function CourseOverview({
  course,
  content,
  allowedUnitIds,
}: {
  course: Course;
  content: CourseContent;
  allowedUnitIds?: string[];
}) {
  const visibleUnits = allowedUnitIds
    ? content.units.filter((u) => allowedUnitIds.includes(u.id))
    : content.units;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Badge variant="secondary">{course.yearLevel}</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-3 text-muted-foreground">{course.description}</p>

      {visibleUnits.length === 0 && allowedUnitIds !== undefined && (
        <div className="mt-10 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No units have been unlocked for you yet. Check back after your teacher sets up your class.
        </div>
      )}

      <div className="mt-10 space-y-8">
        {visibleUnits.map((unit) => (
          <section key={unit.id}>
            {unit.subtitle && (
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                {unit.subtitle}
              </p>
            )}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight">{unit.title}</h2>
              {unit.status === "coming_soon" && (
                <Badge variant="outline">Coming soon</Badge>
              )}
            </div>

            {unit.status === "coming_soon" ? (
              <div className="mt-3 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Content coming soon.
              </div>
            ) : (
              <div className="mt-3 space-y-4">
                {unit.topics.map((topic) => (
                  <details key={topic.id} className="rounded-lg border p-4" open>
                    <summary className="cursor-pointer font-medium">
                      {topic.title}
                      {topic.description && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {topic.description}
                        </span>
                      )}
                    </summary>
                    <ul className="mt-3 space-y-1">
                      {topic.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/courses/${course.slug}/lesson/${lesson.id}`}
                            className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <span>{lesson.title}</span>
                            {lesson.estimatedMinutes && (
                              <span className="text-xs text-muted-foreground">
                                {lesson.estimatedMinutes} min
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
