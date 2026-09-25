import { notFound } from "next/navigation";
import { FoundationsOverview } from "@/components/course/foundations/FoundationsOverview";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass, getStudentProgress } from "@/lib/db";

/** Shared overview page for the Year 11 and Year 12 Foundations courses. */
export async function FoundationsCoursePage({ slug }: { slug: string }) {
  const session = await getSession();
  const course = getCourseBySlug(slug);
  const content = getCourseContent(slug);
  if (!course || !content) notFound();

  let allowedTopicIds: string[] | undefined;
  let completedLessonIds: string[] | undefined;
  if (session?.role === "student") {
    const cls = await getClass(session.classId!);
    allowedTopicIds = cls?.topicIds ?? [];
    if (cls && session.username) {
      completedLessonIds = await getStudentProgress(cls.id, session.username);
    }
  }

  return (
    <FoundationsOverview
      course={course}
      content={content}
      allowedTopicIds={allowedTopicIds}
      completedLessonIds={completedLessonIds}
    />
  );
}
