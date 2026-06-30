import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";

export default function Page() {
  const course = getCourseBySlug("year-12-applied-it-general");
  const content = getCourseContent("year-12-applied-it-general");
  if (!course || !content) notFound();
  return <CourseOverview course={course} content={content} />;
}
