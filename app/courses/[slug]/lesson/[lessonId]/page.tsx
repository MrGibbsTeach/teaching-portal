import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { FoundationsLessonView } from "@/components/course/foundations/FoundationsLessonView";
import { FoundationsThemeRoot } from "@/components/course/foundations/FoundationsThemeRoot";
import { atkinson } from "@/components/course/foundations/font";
import { getCourseBySlug } from "@/lib/courses";
import { GeneralLessonView } from "@/components/course/GeneralLessonView";
import { getCourseContent, findLesson, findNextLesson } from "@/lib/content";
import { getSession } from "@/lib/session";
import { getClass, getStudentProgress } from "@/lib/db";
import { isVisibleToStudents, type Releases } from "@/lib/logic/release";
import { LessonShell } from "@/components/course/shared/LessonShell";
import { TierTheme } from "@/components/course/shared/TierTheme";
import { LessonCompleteButton } from "@/components/course/LessonCompleteButton";
import { ATARStepPlayer } from "@/components/course/ATARStepPlayer";
import {
  FOUNDATIONS_SLUGS,
  FOUNDATIONS_Y11_SLUG,
  LEGACY_FOUNDATIONS_SLUG,
  isFoundationsSlug,
} from "@/lib/logic/foundations-migration";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;

  // Legacy bookmarks: Foundations was split into Year 11 / Year 12 courses.
  if (slug === LEGACY_FOUNDATIONS_SLUG) {
    const target = FOUNDATIONS_SLUGS.find((s) => {
      const c = getCourseContent(s);
      return c && findLesson(c, lessonId);
    });
    redirect(target ? `/courses/${target}/lesson/${lessonId}` : `/courses/${FOUNDATIONS_Y11_SLUG}`);
  }

  const course = getCourseBySlug(slug);
  const content = getCourseContent(slug);
  if (!course || !content) notFound();

  const found = findLesson(content, lessonId);
  if (!found) notFound();
  const { unit, topic, lesson } = found;

  // Student access check: only show released lessons (or, for a class the teacher
  // hasn't touched the new Release buttons on yet, the old unlocked-topic list).
  const session = await getSession();
  let studentTopicIds: string[] | undefined;
  let studentReleases: Releases | undefined;
  if (session?.role === "student") {
    const cls = await getClass(session.classId!);
    if (!cls) redirect(`/courses/${slug}`);

    const usingReleases = !!cls.releases && Object.keys(cls.releases).length > 0;
    if (usingReleases) {
      if (!isVisibleToStudents(cls.releases!, lessonId)) redirect(`/courses/${slug}`);
      studentReleases = cls.releases;
    } else {
      const compoundId = `${unit.id}:${topic.id}`;
      // Accept both compound IDs (new format) and bare topic IDs (legacy format)
      const hasAccess = cls.topicIds.includes(compoundId) || cls.topicIds.includes(topic.id);
      if (!hasAccess) redirect(`/courses/${slug}`);
      studentTopicIds = cls.topicIds;
    }
  }

  // Load student progress (only for students)
  let completedLessonIds: string[] = [];
  if (session?.role === "student" && session.classId && session.username) {
    completedLessonIds = await getStudentProgress(session.classId, session.username);
  }

  const isCompleted = completedLessonIds.includes(lessonId);
  const isStudent = session?.role === "student" && !!session.classId && !!session.username;

  const completeButton = isStudent ? (
    <LessonCompleteButton
      lessonId={lessonId}
      courseSlug={slug}
      initialCompleted={isCompleted}
    />
  ) : null;

  // Find the next lesson, then hide it for students if they can't actually see it yet
  let nextLesson = findNextLesson(content, lessonId);
  if (nextLesson && studentReleases) {
    if (!isVisibleToStudents(studentReleases, nextLesson.lessonId)) nextLesson = null;
  } else if (nextLesson && studentTopicIds !== undefined) {
    const nextFound = findLesson(content, nextLesson.lessonId);
    if (nextFound) {
      const accessible =
        studentTopicIds.includes(`${nextFound.unit.id}:${nextFound.topic.id}`) ||
        studentTopicIds.includes(nextFound.topic.id);
      if (!accessible) nextLesson = null;
    }
  }

  if (course.tier === "general") {
    return (
      <LessonShell courseSlug={course.slug} lessonId={lessonId}>
        <TierTheme tier="general">
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
        </TierTheme>
        {completeButton}
      </LessonShell>
    );
  }

  if (course.tier === "atar") {
    return (
      <LessonShell courseSlug={course.slug} lessonId={lessonId}>
        <TierTheme tier="atar">
          <div className="mx-auto max-w-3xl px-6 py-10">
            <Link
              href={`/courses/${slug}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← {course.title}
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              {unit.title} / {topic.title}
            </p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
              {lesson.title}
            </h1>
            {lesson.estimatedMinutes && (
              <p className="mt-1.5 text-sm text-muted-foreground">{lesson.estimatedMinutes} min</p>
            )}

            <div className="mt-6">
              <ATARStepPlayer
                blocks={lesson.blocks}
                lessonId={lessonId}
                courseSlug={slug}
                initialCompleted={isCompleted}
              />
            </div>

            {nextLesson && (
              <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
                <span className="text-sm text-muted-foreground">Up next</span>
                <Link
                  href={`/courses/${slug}/lesson/${nextLesson.lessonId}`}
                  className="flex items-center gap-1.5 font-medium text-primary hover:underline"
                >
                  {nextLesson.lessonTitle} →
                </Link>
              </div>
            )}
          </div>
        </TierTheme>
      </LessonShell>
    );
  }

  if (isFoundationsSlug(slug)) {
    return (
      <LessonShell courseSlug={course.slug} lessonId={lessonId}>
        <FoundationsThemeRoot fontVariable={atkinson.variable}>
          <FoundationsLessonView
            courseSlug={course.slug}
            courseTitle={course.title}
            lesson={lesson}
            nextLesson={nextLesson}
          />
        </FoundationsThemeRoot>
        {completeButton}
      </LessonShell>
    );
  }

  return (
    <LessonShell courseSlug={course.slug} lessonId={lessonId}>
      <TierTheme tier={course.tier}>
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link
            href={`/courses/${slug}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← {course.title}
          </Link>
          <p className="mt-6 text-sm text-muted-foreground">
            {unit.title} / {topic.title}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            {lesson.title}
          </h1>
          {lesson.estimatedMinutes && (
            <p className="mt-1.5 text-sm text-muted-foreground">{lesson.estimatedMinutes} min</p>
          )}

          <div className="mt-8">
            {lesson.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>
          {completeButton}

          {nextLesson && (
            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              <span className="text-sm text-muted-foreground">Up next</span>
              <Link
                href={`/courses/${slug}/lesson/${nextLesson.lessonId}`}
                className="flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                {nextLesson.lessonTitle} →
              </Link>
            </div>
          )}
        </div>
      </TierTheme>
    </LessonShell>
  );
}
