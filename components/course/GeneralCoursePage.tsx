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

  return (
    <TierTheme tier="general">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {course.yearLevel}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {course.title}
        </h1>
        <p className="mt-3 max-w-prose text-muted-foreground">{course.description}</p>

        {units.length === 0 && isStudent && (
          <div className="mt-10 border-t border-b border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No topics have been unlocked for you yet. Check back after your teacher sets up your class.
          </div>
        )}

        <div className="mt-12 space-y-12">
          {units.map((unit) => (
            <section key={unit.id}>
              <div className="border-b border-border pb-2">
                {unit.subtitle && (
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">{unit.subtitle}</p>
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
