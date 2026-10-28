import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent, findLesson } from "@/lib/content";
import { TierTheme } from "@/components/course/shared/TierTheme";

export const dynamic = "force-dynamic";

export default async function ClassCodeHome({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();

  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();

  const course = getCourseBySlug(cls.courseSlug);
  const content = getCourseContent(cls.courseSlug);
  const today = cls.todayLessonId ? content && findLesson(content, cls.todayLessonId) : undefined;

  return (
    <TierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">{cls.name}</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          {course?.title ?? cls.courseSlug}
        </h1>

        <div className="mt-10">
          {today ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Today&apos;s lesson</p>
              <h2 className="mt-2 text-xl font-semibold">{today.lesson.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {today.unit.title} / {today.topic.title}
              </p>
              <Link
                href={`/${normalized}/lesson/${today.lesson.id}`}
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Start
              </Link>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No lesson is on for today yet. Check back once your teacher releases one.
            </p>
          )}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <Link href={`/${normalized}/lessons`} className="text-sm font-medium text-primary hover:underline">
            Previous lessons →
          </Link>
        </div>
      </div>
    </TierTheme>
  );
}
