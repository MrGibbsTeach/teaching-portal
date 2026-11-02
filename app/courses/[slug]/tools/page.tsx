import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import { toolsForTier } from "@/lib/interactives";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { ToolsGrid } from "@/components/tools/ToolsGrid";

export default async function CourseToolsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();
  return (
    <CourseTierTheme tier={course.tier}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href={`/courses/${slug}`} className="text-sm text-muted-foreground hover:text-primary">
          ← {course.title}
        </Link>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight">Interactive tools</h1>
        <p className="mt-2 text-muted-foreground">Practise any time, without finding the lesson first. Your work stays in this browser.</p>
        <ToolsGrid tools={toolsForTier(course.tier)} hrefFor={(t) => `/courses/${slug}/tools/${t.id}`} />
      </div>
    </CourseTierTheme>
  );
}
