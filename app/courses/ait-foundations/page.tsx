import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";

export default function Page() {
  const course = getCourseBySlug("ait-foundations");
  const content = getCourseContent("ait-foundations");
  if (!course || !content) notFound();
  return <CourseOverview course={course} content={content} />;
}
