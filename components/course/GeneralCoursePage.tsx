import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MasteryTree } from "@/components/course/shared/MasteryTree";
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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Badge variant="secondary">{course.yearLevel}</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-3 text-muted-foreground">{course.description}</p>

      {units.length === 0 && isStudent && (
        <div className="mt-10 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No topics have been unlocked for you yet. Check back after your teacher sets up your class.
        </div>
      )}

      <div className="mt-10 space-y-12">
        {units.map((unit) => (
          <section key={unit.id}>
            {unit.subtitle && (
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">{unit.subtitle}</p>
            )}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight">{unit.title}</h2>
              {unit.status === "coming_soon" && <Badge variant="outline">Coming soon</Badge>}
            </div>
            {unit.status === "coming_soon" ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Content coming soon.
              </div>
            ) : (
              <MasteryTree
                topics={unit.topics}
                completed={completedSet}
                unlockAll={!isStudent}
                showProgress={isStudent}
                lessonHref={(l) => `/courses/${course.slug}/lesson/${l.id}`}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
