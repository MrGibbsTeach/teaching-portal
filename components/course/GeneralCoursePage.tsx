import { notFound } from "next/navigation";
import { MasteryTree } from "@/components/course/shared/MasteryTree";
import { TierTheme } from "@/components/course/shared/TierTheme";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass, getStudentProgress } from "@/lib/db";
import { withGeneralPrerequisites } from "@/lib/logic/general-tree";

/** Year 11 / Year 12 General overview: one mastery map per unit. */
export async function GeneralCoursePage({ slug }: { slug: string }) {
  const session = await getSession();
  const course = getCourseBySlug(slug);
  const content = getCourseContent(slug);
  if (!course || !content) notFound();

  let allowedTopicIds: string[] | undefined;
  let completed: string[] | undefined;
  if (session?.role === "student" && session.classId && session.username) {
    const cls = await getClass(session.classId);
    allowedTopicIds = cls?.topicIds ?? [];
    completed = await getStudentProgress(session.classId, session.username);
  }
  const isStudent = allowedTopicIds !== undefined;
  const completedSet = new Set(completed ?? []);

  // Students only see topics their teacher unlocked (compound `unit:topic` or legacy bare id).
  const units = content.units
    .map((u) => ({
      ...u,
      topics: withGeneralPrerequisites(u.topics).filter(
        (t) => !allowedTopicIds || allowedTopicIds.includes(`${u.id}:${t.id}`) || allowedTopicIds.includes(t.id),
      ),
    }))
    .filter((u) => u.topics.length > 0);

  const topicCount = units.reduce((total, unit) => total + unit.topics.length, 0);
  const lessonCount = units.reduce(
    (total, unit) => total + unit.topics.reduce((topicTotal, topic) => topicTotal + topic.lessons.length, 0),
    0,
  );
  const completedCount = units.reduce(
    (total, unit) => total + unit.topics.reduce(
      (topicTotal, topic) => topicTotal + topic.lessons.filter((lesson) => completedSet.has(lesson.id)).length,
      0,
    ),
    0,
  );

  return (
    <TierTheme tier="general">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        <header className="relative overflow-hidden border-y border-border py-8 sm:py-10">
          <div aria-hidden className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-2 sm:flex">
            <span className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <span className="h-px w-8 bg-primary/40" />
            <span className="h-4 w-4 rounded-full bg-primary" />
            <span className="h-px w-8 bg-primary/40" />
            <span className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{course.yearLevel} · Applied Information Technology</p>
          <h1 className="mt-3 max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{course.description} Work through the topics, practise each skill, then apply it in a project.</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span><strong className="text-foreground">{topicCount}</strong> topics</span>
            <span><strong className="text-foreground">{lessonCount}</strong> lessons</span>
            {isStudent && <span><strong className="text-foreground">{completedCount} / {lessonCount}</strong> lessons complete</span>}
          </div>
          {isStudent && (
            <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-muted" aria-label={`${completedCount} of ${lessonCount} lessons complete`} role="img">
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${lessonCount ? (completedCount / lessonCount) * 100 : 0}%` }} />
            </div>
          )}
        </header>

        {units.length === 0 && isStudent && (
          <div className="mt-10 border-t border-b border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No topics have been unlocked for you yet. Check back after your teacher sets up your class.
          </div>
        )}

        <div className="mt-10 space-y-12 sm:mt-12">
          {units.map((unit) => (
            <section key={unit.id}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
                <div>
                  {unit.subtitle && (
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">{unit.subtitle}</p>
                  )}
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-heading text-2xl tracking-tight">{unit.title}</h2>
                    {unit.status === "coming_soon" && (
                      <span className="text-sm text-muted-foreground">Coming soon</span>
                    )}
                  </div>
                </div>
                {isStudent && unit.status !== "coming_soon" && (() => {
                  const total = unit.topics.reduce((sum, topic) => sum + topic.lessons.length, 0);
                  const done = unit.topics.reduce((sum, topic) => sum + topic.lessons.filter((lesson) => completedSet.has(lesson.id)).length, 0);
                  return <p className="text-xs tabular-nums text-muted-foreground">{done} / {total} lessons</p>;
                })()}
              </div>
              {unit.status === "coming_soon" ? (
                <p className="py-6 text-sm text-muted-foreground">Content coming soon.</p>
              ) : (
                <div className="mt-5">
                  <MasteryTree
                    topics={unit.topics}
                    completed={completedSet}
                    unlockAll={!isStudent}
                    showProgress={isStudent}
                    lessonHref={(l) => `/courses/${course.slug}/lesson/${l.id}`}
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </TierTheme>
  );
}
