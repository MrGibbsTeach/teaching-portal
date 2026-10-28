import Link from "next/link";
import type { Course } from "@/lib/courses";
import type { CourseContent } from "@/lib/content/types";
import type { Releases } from "@/lib/logic/release";
import { isVisibleToStudents, todayLessonId as findTodayLessonId } from "@/lib/logic/release";

export function CourseOverview({
  course,
  content,
  allowedTopicIds,
  releases,
  completedLessonIds,
}: {
  course: Course;
  content: CourseContent;
  /** Legacy whole-topic unlock model. Ignored when `releases` is given. */
  allowedTopicIds?: string[];
  /** Today's-lesson release model (redesign-plan.md, 28 Oct 2026): filters per lesson, not per topic. */
  releases?: Releases;
  completedLessonIds?: string[];
}) {
  const todayId = releases ? findTodayLessonId(releases) : undefined;

  const visibleUnits = releases
    ? content.units
        .map((u) => ({
          ...u,
          topics: u.topics
            .map((t) => ({ ...t, lessons: t.lessons.filter((l) => isVisibleToStudents(releases, l.id)) }))
            .filter((t) => t.lessons.length > 0),
        }))
        .filter((u) => u.topics.length > 0)
    : allowedTopicIds
      ? content.units
          .map((u) => ({
            ...u,
            topics: u.topics.filter(
              (t) =>
                // New compound format: "unitId:topicId"
                allowedTopicIds.includes(`${u.id}:${t.id}`) ||
                // Legacy format: bare "topicId" (kept for backward-compat)
                allowedTopicIds.includes(t.id)
            ),
          }))
          .filter((u) => u.topics.length > 0)
      : content.units;

  const todayLesson =
    todayId &&
    visibleUnits
      .flatMap((u) => u.topics.flatMap((t) => t.lessons.map((l) => ({ lesson: l, unit: u, topic: t }))))
      .find(({ lesson }) => lesson.id === todayId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        {course.yearLevel}
      </p>
      <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {course.title}
      </h1>
      <p className="mt-3 max-w-prose text-muted-foreground">{course.description}</p>

      {todayLesson && (
        <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Today&apos;s lesson</p>
          <h2 className="mt-1 text-lg font-semibold">{todayLesson.lesson.title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {todayLesson.unit.title} / {todayLesson.topic.title}
          </p>
          <Link
            href={`/courses/${course.slug}/lesson/${todayLesson.lesson.id}`}
            className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Start
          </Link>
        </div>
      )}

      {visibleUnits.length === 0 && allowedTopicIds !== undefined && !releases && (
        <div className="mt-10 border-t border-b border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No topics have been unlocked for you yet. Check back after your teacher sets up your class.
        </div>
      )}

      {visibleUnits.length === 0 && releases && (
        <div className="mt-10 border-t border-b border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No lessons have been released yet. Check back after your teacher releases one.
        </div>
      )}

      <div className="mt-12 space-y-12">
        {visibleUnits.map((unit) => (
          <section key={unit.id}>
            <div className="border-b border-border pb-2">
              {unit.subtitle && (
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {unit.subtitle}
                </p>
              )}
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-heading text-2xl tracking-tight">{unit.title}</h2>
                {unit.status === "coming_soon" && (
                  <span className="text-sm text-muted-foreground">Coming soon</span>
                )}
              </div>
            </div>

            {unit.status === "coming_soon" ? (
              <p className="py-6 text-sm text-muted-foreground">Content coming soon.</p>
            ) : (
              <div className="mt-5 space-y-6">
                {unit.topics.map((topic) => (
                  <div key={topic.id}>
                    <h3 className="font-medium">
                      {topic.title}
                      {topic.description && (
                        <span className="ml-2 font-normal text-muted-foreground">
                          — {topic.description}
                        </span>
                      )}
                    </h3>
                    <ul className="mt-2">
                      {topic.lessons.map((lesson) => {
                        const isComplete = completedLessonIds?.includes(lesson.id) ?? false;
                        return (
                          <li key={lesson.id} className="border-t border-border first:border-t-0">
                            <Link
                              href={`/courses/${course.slug}/lesson/${lesson.id}`}
                              className="group flex items-center justify-between gap-4 py-2.5 text-sm hover:text-primary"
                            >
                              <span className="flex items-center gap-2.5">
                                <span
                                  aria-hidden
                                  className={`w-3 shrink-0 text-center ${
                                    isComplete ? "text-primary" : "text-muted-foreground/50"
                                  }`}
                                >
                                  {isComplete ? "✓" : completedLessonIds !== undefined ? "·" : ""}
                                </span>
                                <span className={isComplete ? "text-muted-foreground" : ""}>
                                  {lesson.title}
                                </span>
                              </span>
                              {lesson.estimatedMinutes && (
                                <span className="shrink-0 text-xs text-muted-foreground">
                                  {lesson.estimatedMinutes} min
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
