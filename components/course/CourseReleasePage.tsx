import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { TierTheme } from "@/components/course/shared/TierTheme";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass, getStudentProgress } from "@/lib/db";
import type { Releases } from "@/lib/logic/release";

/**
 * Overview page for courses that use the teacher release model and the course's own tier theme
 * (Year 9 Digital Innovations). Same release and unlock rules as the ATAR overview, minus its live-session button.
 */
export async function CourseReleasePage({ slug }: { slug: string }) {
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
    // A class with no release entries yet falls back to the topic-unlock list, as in the ATAR overview.
    if (cls?.releases && Object.keys(cls.releases).length > 0) {
      releases = cls.releases;
    } else {
      allowedTopicIds = cls?.topicIds ?? [];
    }
  }

  return (
    <TierTheme tier={course.tier}>
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
