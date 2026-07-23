import { notFound } from "next/navigation";
import { FoundationsOverview } from "@/components/course/foundations/FoundationsOverview";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  const course = getCourseBySlug("ait-foundations");
  const content = getCourseContent("ait-foundations");
  if (!course || !content) notFound();

  let allowedTopicIds: string[] | undefined;
  if (session?.role === "student") {
    const cls = await getClass(session.classId!);
    allowedTopicIds = cls?.topicIds ?? [];
  }

  return <FoundationsOverview course={course} content={content} allowedTopicIds={allowedTopicIds} />;
}
