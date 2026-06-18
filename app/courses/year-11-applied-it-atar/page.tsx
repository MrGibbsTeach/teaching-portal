import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";

export default function Page() {
  const course = getCourseBySlug("year-11-applied-it-atar");
  const content = getCourseContent("year-11-applied-it-atar");
  if (!course || !content) notFound();
  return <CourseOverview course={course} content={content} />;
}
