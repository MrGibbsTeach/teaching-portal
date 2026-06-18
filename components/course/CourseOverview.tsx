import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/courses";
import type { CourseContent } from "@/lib/content/types";

export function CourseOverview({
  course,
  content,
}: {
  course: Course;
  content: CourseContent;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Badge variant="secondary">{course.yearLevel}</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-3 text-muted-foreground">{course.description}</p>

      <div className="mt-10 space-y-8">
        {content.units.map((unit) => (
          <section key={unit.id}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight">{unit.title}</h2>
              {unit.status === "coming_soon" && (
                <Badge variant="outline">Coming soon</Badge>
              )}
            </div>
            {unit.subtitle && (
              <p className="text-sm text-muted-foreground">{unit.subtitle}</p>
            )}

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
