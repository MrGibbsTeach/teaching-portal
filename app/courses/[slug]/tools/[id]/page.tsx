import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import { getTool, pageTier } from "@/lib/interactives";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { HtmlInteractive } from "@/components/course/shared/HtmlInteractive";

export default async function CourseToolPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const course = getCourseBySlug(slug);
  const tool = getTool(id);
  if (!course || !tool || !tool.tiers.includes(course.tier)) notFound();
  return (
    <CourseTierTheme tier={course.tier}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href={`/courses/${slug}/tools`} className="text-sm text-muted-foreground hover:text-primary">
          ← Interactive tools
        </Link>
        <HtmlInteractive title={tool.title} src={tool.src} tier={pageTier(course.tier)} instruction={tool.blurb} minHeight={tool.minHeight} />
      </div>
    </CourseTierTheme>
  );
}
