import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { getCourseContent, findLesson } from "@/lib/content";
import { LiveNowButton } from "@/components/live/LiveNowButton";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { TopicIcon } from "@/components/course/shared/TopicIcon";
import { iconForTopic } from "@/lib/logic/topic-icon";
import { buildCalendar, getAssessments, nextRow } from "@/lib/plans/assessments";

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

  const assessments = buildCalendar(cls.courseSlug, getAssessments(cls.courseSlug) ?? [], cls.assessments);
  const perthToday = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Perth" }));
  const todayIso = `${perthToday.getFullYear()}-${String(perthToday.getMonth() + 1).padStart(2, "0")}-${String(perthToday.getDate()).padStart(2, "0")}`;
  const next = nextRow(assessments, todayIso);

  const Icon = iconForTopic(today?.topic.title ?? course?.title ?? "");
  return (
    <CourseTierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm font-medium text-muted-foreground">{cls.name}</p>
        <h1 className="mt-1 font-heading text-4xl font-extrabold tracking-tight">
          {course?.title ?? cls.courseSlug}
        </h1>

        <div className="mt-8">
          <LiveNowButton href={`/${normalized}/live`} code={normalized} />
        </div>

        {today ? (
          <div className="mt-6 grid overflow-hidden rounded-2xl border border-border sm:grid-cols-[1.4fr_1fr]">
            <div className="p-8">
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Today&apos;s lesson
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight">{today.lesson.title}</h2>
              <p className="mt-2 text-muted-foreground">
                {today.unit.title} / {today.topic.title}
              </p>
              {today.lesson.estimatedMinutes && (
                <p className="mt-1 text-sm text-muted-foreground">About {today.lesson.estimatedMinutes} min</p>
              )}
              <Link
                href={`/${normalized}/lesson/${today.lesson.id}`}
                className="skin-btn-primary mt-6 inline-block bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start lesson
              </Link>
            </div>
            <div className="flex items-center justify-center bg-accent p-8">
              <div className="scale-[2]"><TopicIcon icon={Icon} size="lg" /></div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-border p-8">
            <p className="text-muted-foreground">
              No lesson is on for today yet. Check back once your teacher releases one.
            </p>
          </div>
        )}

        <div className="mt-10">
          <h2 className="font-heading text-xl font-bold tracking-tight">Need to revise?</h2>
          <p className="mt-1 text-muted-foreground">Previous lessons are grouped by topic.</p>
          <Link href={`/${normalized}/lessons`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            See previous lessons →
          </Link>
        </div>

        {assessments.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-xl font-bold tracking-tight">Assessments</h2>
            <p className="mt-1 text-muted-foreground">
              {next ? `Next: ${next.task.name}, proposed ${next.due}${next.dueDate ? "" : " (" + next.dueNote.replace(" (proposed)", "") + ")"}.` : "See the proposed dates."}
            </p>
            <Link href={`/${normalized}/assessments`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              See all assessments →
            </Link>
          </div>
        )}
      </div>
    </CourseTierTheme>
  );
}
