import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent, findLesson } from "@/lib/content";
import { isVisibleToStudents } from "@/lib/logic/release";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { StepPlayer } from "@/components/course/code-track/StepPlayer";

export const dynamic = "force-dynamic";

export default async function CodeTrackLessonPage({
  params,
}: {
  params: Promise<{ code: string; lessonId: string }>;
}) {
  const { code, lessonId } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();

  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();

  const course = getCourseBySlug(cls.courseSlug);
  const content = getCourseContent(cls.courseSlug);
  if (!content) notFound();

  const found = findLesson(content, lessonId);
  if (!found) notFound();

  const releases = cls.releases ?? {};
  if (!isVisibleToStudents(releases, lessonId)) notFound();

  const { unit, topic, lesson } = found;

  return (
    <CourseTierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href={`/${normalized}`} className="text-sm text-muted-foreground hover:text-primary">
          ← {cls.name}
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          {unit.title} / {topic.title}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">{lesson.title}</h1>
        {lesson.estimatedMinutes && (
          <p className="mt-1.5 text-sm text-muted-foreground">{lesson.estimatedMinutes} min</p>
        )}

        <div className="mt-6">
          <StepPlayer blocks={lesson.blocks} classCode={normalized} lessonId={lesson.id} />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-sm">
          <Link href={`/${normalized}`} className="font-medium text-primary hover:underline">
            Today&apos;s lesson
          </Link>
          <Link href={`/${normalized}/lessons`} className="font-medium text-primary hover:underline">
            Previous lessons →
          </Link>
        </div>
      </div>
    </CourseTierTheme>
  );
}
