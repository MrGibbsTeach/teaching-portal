import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassByReliefToken } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent, findLesson } from "@/lib/content";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { ReliefPreviewPlayer } from "@/components/relief/ReliefPreviewPlayer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Relief lesson preview", robots: { index: false, follow: false } };

export default async function ReliefLessonPreview({
  params,
}: {
  params: Promise<{ token: string; lessonId: string }>;
}) {
  const { token, lessonId } = await params;
  const found = await getClassByReliefToken(token);
  if (!found || !found.link.lessonIds.includes(lessonId)) notFound();

  const content = getCourseContent(found.cls.courseSlug);
  const lesson = content && findLesson(content, lessonId);
  if (!lesson) notFound();

  const course = getCourseBySlug(found.cls.courseSlug);

  return (
    <CourseTierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href={`/relief/${token}`} className="text-sm text-muted-foreground hover:text-primary">
          ← Back to relief page
        </Link>
        <p className="mt-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
          Preview as student. Nothing here is saved.
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight">{lesson.lesson.title}</h1>
        <div className="mt-6">
          <ReliefPreviewPlayer
            blocks={lesson.lesson.blocks.filter((b) => !(b.type === "videoSlot" && !b.youtubeId))}
            lessonId={lessonId}
          />
        </div>
      </div>
    </CourseTierTheme>
  );
}
