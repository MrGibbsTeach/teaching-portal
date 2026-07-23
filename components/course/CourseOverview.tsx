import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/courses";
import type { CourseContent } from "@/lib/content/types";

export function CourseOverview({
  course,
  content,
  allowedTopicIds,
  completedLessonIds,
}: {
  course: Course;
  content: CourseContent;
  allowedTopicIds?: string[];
  completedLessonIds?: string[];
}) {
  const visibleUnits = allowedTopicIds
    ? content.units
        .map((u) => ({
          ...u,
          topics: u.topics.filter((t) => allowedTopicIds.includes(t.id)),
        }))
        .filter((u) => u.topics.length > 0)
    : content.units;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Badge variant="secondary">{course.yearLevel}</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-3 text-muted-foreground">{course.description}</p>

      {visibleUnits.length === 0 && allowedTopicIds !== undefined && (
        <div className="mt-10 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No topics have been unlocked for you yet. Check back after your teacher sets up your class.
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
                      {topic.lessons.map((lesson) => {
                        const isComplete = completedLessonIds?.includes(lesson.id) ?? false;
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={`/courses/${course.slug}/lesson/${lesson.id}`}
                              className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent"
                            >
                              <span className="flex items-center gap-2">
                                {isComplete ? (
                                  <span
                                    title="Completed"
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      className="h-2.5 w-2.5"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                ) : completedLessonIds !== undefined ? (
                                  <span className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/30" />
                                ) : null}
                                <span className={isComplete ? "text-muted-foreground" : ""}>
                                  {lesson.title}
                                </span>
                              </span>
                              {lesson.estimatedMinutes && (
                                <span className="text-xs text-muted-foreground">
                                  {lesson.estimatedMinutes} min
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
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
