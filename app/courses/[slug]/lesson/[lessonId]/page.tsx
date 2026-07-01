import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { FoundationsLessonView } from "@/components/course/foundations/FoundationsLessonView";
import { FoundationsThemeRoot } from "@/components/course/foundations/FoundationsThemeRoot";
import { atkinson } from "@/components/course/foundations/font";
import { getCourseBySlug } from "@/lib/courses";
import { GeneralLessonView } from "@/components/course/GeneralLessonView";
import { getCourseContent, findLesson, findNextLesson } from "@/lib/content";

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

  const isGeneral = slug === "year-11-applied-it-general" || slug === "year-12-applied-it-general";
  if (isGeneral) {
    const nextLesson = findNextLesson(content, lessonId);
    return (
      <GeneralLessonView
        courseSlug={course.slug}
        courseTitle={course.title}
        unitTitle={unit.title}
        topicTitle={topic.title}
        topicId={topic.id}
        lessonTitle={lesson.title}
        estimatedMinutes={lesson.estimatedMinutes}
        blocks={lesson.blocks}
        nextLesson={nextLesson}
      />
    );
  }

  if (slug === "ait-foundations") {
    const nextLesson = findNextLesson(content, lessonId);
    return (
      <FoundationsThemeRoot fontVariable={atkinson.variable}>
        <FoundationsLessonView
          courseSlug={course.slug}
          courseTitle={course.title}
          lesson={lesson}
          nextLesson={nextLesson}
        />
      </FoundationsThemeRoot>
    );
  }

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
