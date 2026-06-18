import { notFound } from "next/navigation";
import { CoursePlaceholder } from "@/components/course/CoursePlaceholder";
import { getCourseBySlug } from "@/lib/courses";

export default function Page() {
  const course = getCourseBySlug("year-10-digital-enterprise");
  if (!course) notFound();
  return <CoursePlaceholder course={course} />;
}
