import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { TierTheme } from "@/components/course/shared/TierTheme";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass, getStudentProgress } from "@/lib/db";

/** Shared overview page for the Year 11 and Year 12 ATAR courses. */
export async function ATARCoursePage({ slug }: { slug: string }) {
  const session = await getSession();
  const course = getCourseBySlug(slug);
  const content = getCourseContent(slug);
  if (!course || !content) notFound();

  let allowedTopicIds: string[] | undefined;
  let completedLessonIds: string[] | undefined;

  if (session?.role === "student" && session.classId && session.username) {
    const cls = await getClass(session.classId);
    allowedTopicIds = cls?.topicIds ?? [];
    completedLessonIds = await getStudentProgress(session.classId, session.username);
  }

  return (
    <TierTheme tier="atar">
      <CourseOverview
        course={course}
        content={content}
        allowedTopicIds={allowedTopicIds}
        completedLessonIds={completedLessonIds}
      />
    </TierTheme>
  );
}
