import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent, findLesson } from "@/lib/content";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const course = getCourseBySlug(slug);
  const content = getCourseContent(slug);
  if (!course || !content) notFound();

  const found = findLesson(content, lessonId);
  if (!found) notFound();
  const { unit, topic, lesson } = found;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href={`/courses/${slug}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {course.title}
      </Link>
      <p className="mt-4 text-sm text-muted-foreground">
        {unit.title} / {topic.title}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        {lesson.estimatedMinutes && (
          <Badge variant="secondary">{lesson.estimatedMinutes} min</Badge>
        )}
      </div>

      <div className="mt-6">
        {lesson.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
