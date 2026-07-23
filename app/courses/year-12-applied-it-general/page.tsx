import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass, getStudentProgress } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  const course = getCourseBySlug("year-12-applied-it-general");
  const content = getCourseContent("year-12-applied-it-general");
  if (!course || !content) notFound();

  let allowedTopicIds: string[] | undefined;
  let completedLessonIds: string[] | undefined;

  if (session?.role === "student" && session.classId && session.username) {
    const cls = await getClass(session.classId);
    allowedTopicIds = cls?.topicIds ?? [];
    completedLessonIds = await getStudentProgress(session.classId, session.username);
  }

  return (
    <CourseOverview
      course={course}
      content={content}
      allowedTopicIds={allowedTopicIds}
      completedLessonIds={completedLessonIds}
    />
  );
}
