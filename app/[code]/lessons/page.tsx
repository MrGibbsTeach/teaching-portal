import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent } from "@/lib/content";
import { isVisibleToStudents } from "@/lib/logic/release";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { PreviousLessonsList, type PreviousLessonEntry } from "@/components/course/code-track/PreviousLessonsList";

export const dynamic = "force-dynamic";

export default async function PreviousLessonsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();

  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();

  const course = getCourseBySlug(cls.courseSlug);
  const content = getCourseContent(cls.courseSlug);
  const releases = cls.releases ?? {};

  const entries: PreviousLessonEntry[] = [];
  if (content) {
    for (const unit of content.units) {
      for (const topic of unit.topics) {
        for (const lesson of topic.lessons) {
          if (!isVisibleToStudents(releases, lesson.id)) continue;
          entries.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            unitTitle: unit.title,
            topicTitle: topic.title,
            releasedAt: releases[lesson.id]?.releasedAt ?? new Date(0).toISOString(),
            isToday: releases[lesson.id]?.status === "today",
            isRevision: releases[lesson.id]?.status === "revision",
          });
        }
      }
    }
  }

  return (
    <CourseTierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href={`/${normalized}`} className="text-sm text-muted-foreground hover:text-primary">
          ← {cls.name}
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight">Previous lessons</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything your teacher has released so far.
        </p>
        <PreviousLessonsList classCode={normalized} entries={entries} />
      </div>
    </CourseTierTheme>
  );
}
