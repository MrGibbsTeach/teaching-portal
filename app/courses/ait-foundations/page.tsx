import { notFound } from "next/navigation";
import { FoundationsOverview } from "@/components/course/foundations/FoundationsOverview";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";

export default function Page() {
  const course = getCourseBySlug("ait-foundations");
  const content = getCourseContent("ait-foundations");
  if (!course || !content) notFound();
  return <FoundationsOverview course={course} content={content} />;
}
