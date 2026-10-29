import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { TierTheme } from "@/components/course/shared/TierTheme";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass, getStudentProgress } from "@/lib/db";
import type { Releases } from "@/lib/logic/release";

/** Shared overview page for the Year 11 and Year 12 ATAR courses. */
export async function ATARCoursePage({ slug }: { slug: string }) {
  const session = await getSession();
  const course = getCourseBySlug(slug);
  const content = getCourseContent(slug);
  if (!course || !content) notFound();

  let allowedTopicIds: string[] | undefined;
  let releases: Releases | undefined;
  let completedLessonIds: string[] | undefined;

  if (session?.role === "student" && session.classId && session.username) {
    const cls = await getClass(session.classId);
    completedLessonIds = await getStudentProgress(session.classId, session.username);
    // Today's-lesson release model replaces the old topic-unlock checkboxes
    // (redesign-plan.md, 28 Oct 2026), but a class a teacher hasn't touched the
    // new Release buttons on yet has no `releases` entries at all - fall back to
    // the topic-unlock it was already using so no currently-enrolled student
    // loses access they already had.
    if (cls?.releases && Object.keys(cls.releases).length > 0) {
      releases = cls.releases;
    } else {
      allowedTopicIds = cls?.topicIds ?? [];
    }
  }

  return (
    <TierTheme tier="atar">
      <CourseOverview
        course={course}
        content={content}
        allowedTopicIds={allowedTopicIds}
        releases={releases}
        completedLessonIds={completedLessonIds}
      />
    </TierTheme>
  );
}
