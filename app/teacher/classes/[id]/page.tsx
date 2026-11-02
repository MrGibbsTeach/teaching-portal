import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { getClass, getLiveState, getStudentProgress, getStudentQuizStats } from "@/lib/db";
import { getCourseContent } from "@/lib/content";
import { getCourseBySlug } from "@/lib/courses";
import {
  updateAccess,
  addStudent,
  removeStudent,
  removeClass,
  ensureClassCode,
  releaseLesson,
  makeTodayLesson,
  pullBackLesson,
  openRevisionLesson,
  closeRevisionLesson,
} from "@/app/actions/classes";
import DeleteClassButton from "@/components/teacher/DeleteClassButton";
import { AddStudentForm } from "@/components/teacher/AddStudentForm";
import { ClassCodeBox } from "@/components/teacher/ClassCodeBox";
import { StopLiveButton } from "@/components/teacher/StopLiveButton";
import { LessonReleaseRow } from "@/components/teacher/LessonReleaseRow";
import { ReleaseNextBar } from "@/components/teacher/ReleaseNextBar";
import { TermPlanView } from "@/components/teacher/TermPlan";
import { ReliefPanel } from "@/components/teacher/ReliefPanel";
import { liveReliefLinks } from "@/lib/logic/relief";
import { currentPlanWeek, getPlan } from "@/lib/plans";
import { AssessmentCalendar } from "@/components/teacher/AssessmentCalendar";
import { getAssessments } from "@/lib/plans/assessments";
import { mergeStats, studentQuizTotals } from "@/lib/logic/insights";

export const dynamic = "force-dynamic";

export default async function ClassManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cls = await getClass(id);
  if (!cls) notFound();

  const course = getCourseBySlug(cls!.courseSlug);
  const content = getCourseContent(cls!.courseSlug);

  // Existing classes created before the code/account split default by course tier,
  // so nothing breaks until the teacher (or ensureClassCode) touches them.
  const authMode = cls!.authMode ?? (course?.tier === "atar" ? "account" : "code");
  const releases = cls!.releases ?? {};
  const liveState = await getLiveState(cls!.id);

  const updateAccessForClass = updateAccess.bind(null, cls!.id);
  const addStudentToClass = addStudent.bind(null, cls!.id);
  const deleteClass = removeClass.bind(null, cls!.id);
  const ensureClassCodeForClass = ensureClassCode.bind(null, cls!.id);

  let origin = "mrgibbsteach.com";
  if (authMode === "code") {
    const h = await headers();
    const host = h.get("host");
    if (host) origin = host;
  }

  // Count total lessons in unlocked topics
  // Accepts both compound IDs (new: "unitId:topicId") and bare IDs (legacy)
  const totalUnlockedLessons = content
    ? content.units.reduce((unitSum, u) => {
        const unlocked = u.topics.filter(
          (t) =>
            cls!.topicIds.includes(`${u.id}:${t.id}`) ||
            cls!.topicIds.includes(t.id)
        );
        return unitSum + unlocked.reduce((s, t) => s + t.lessons.length, 0);
      }, 0)
    : 0;

  // Load progress and quiz results for every student in parallel
  const studentProgressList = await Promise.all(
    cls!.students.map(async (s) => {
      const [completedIds, quizStats] = await Promise.all([
        getStudentProgress(cls!.id, s.username),
        getStudentQuizStats(cls!.id, s.username),
      ]);
      const { attempts, right } = studentQuizTotals(mergeStats([quizStats]));
      return { username: s.username, completedCount: completedIds.length, quizAttempts: attempts, quizRight: right };
    })
  );
  const progressByUsername = Object.fromEntries(
    studentProgressList.map(({ username, completedCount }) => [username, completedCount])
  );
  const quizByUsername = Object.fromEntries(
    studentProgressList.map(({ username, quizAttempts, quizRight }) => [username, { quizAttempts, quizRight }])
  );

  // Today's-lesson release controls: shared by every tier (account-mode ATAR
  // classes get this alongside their existing Topic Access checkboxes, so a
  // teacher can either keep using Topic Access or switch a class over to the
  // same release model as everyone else, per the agreed "ATAR needs to
  // follow [the release model], makes it easy" direction).
  const flatLessons = content
    ? content.units.flatMap((u) => u.topics.flatMap((t) => t.lessons.map((l) => ({ id: l.id, title: l.title, topic: t.title }))))
    : [];
  const todayIdx = flatLessons.findIndex((l) => releases[l.id]?.status === "today");
  const isOpen = (id: string) => (releases[id]?.status ?? "not_released") === "not_released";
  const nextLesson =
    flatLessons.slice(todayIdx + 1).find((l) => isOpen(l.id)) ?? flatLessons.find((l) => isOpen(l.id));
  const todayLesson = todayIdx >= 0 ? flatLessons[todayIdx] : undefined;

  // 2027 term plan, when this course has one (Y11 and Y12 AIT General).
  const plan = getPlan(cls!.courseSlug);
  const perthNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Perth" }));
  const thisWeek = plan ? currentPlanWeek(plan, perthNow) : undefined;
  const assessmentTasks = getAssessments(cls!.courseSlug);

  const lessonsSection = (
    <section>
      <h2 className="text-lg font-semibold">Lessons</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Release a lesson so students can see it, or make it Today&apos;s lesson so it&apos;s what
        they land on. Pulled-back and revision-only lessons sit in Previous lessons.
      </p>

      <ReleaseNextBar
        todayTitle={todayLesson?.title}
        nextTitle={nextLesson?.title}
        nextTopic={nextLesson?.topic}
        onReleaseNext={nextLesson ? makeTodayLesson.bind(null, cls!.id, nextLesson.id) : undefined}
      />

      {assessmentTasks && (
        <AssessmentCalendar
          classId={cls!.id}
          courseSlug={cls!.courseSlug}
          tasks={assessmentTasks}
          settings={cls!.assessments ?? {}}
        />
      )}

      {plan && content && (
        <div className="mt-8">
          <h3 className="text-base font-semibold">Term plan 2027</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The year laid out by week, with assessment points and calendar notes. Dates are indicative and will
            change, so release is still your call: open a week and release its lessons, or release them one at a time.
          </p>
          <TermPlanView
            classId={cls!.id}
            plan={plan}
            lessons={flatLessons.map((l) => ({ id: l.id, title: l.title }))}
            releases={releases}
            currentWeek={thisWeek}
            today={perthNow}
          />
          <h3 className="mt-10 text-base font-semibold">All lessons by topic</h3>
        </div>
      )}

      {!content ? (
        <p className="mt-4 text-sm text-muted-foreground italic">
          Course content not yet available.
        </p>
      ) : (
        <div className="mt-4 space-y-6">
          {content.units.map((unit) => (
            <div key={unit.id} className="border border-border p-4">
              {unit.subtitle && (
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">
                  {unit.subtitle}
                </p>
              )}
              <p className="font-semibold mb-3">{unit.title}</p>
              <div className="space-y-4">
                {unit.topics.map((topic) => (
                  <details
                    key={topic.id}
                    open={topic.lessons.some((l) => ["today", "released", "revision"].includes(releases[l.id]?.status ?? ""))}
                    className="group rounded-xl border border-border"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                      <span className="text-sm font-semibold">{topic.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {topic.lessons.filter((l) => (releases[l.id]?.status ?? "not_released") !== "not_released").length} of {topic.lessons.length} released
                      </span>
                    </summary>
                    <div className="space-y-2 px-4 pb-4">
                      {topic.lessons.map((lesson) => {
                        const status = releases[lesson.id]?.status ?? "not_released";
                        return (
                          <LessonReleaseRow
                            key={lesson.id}
                            title={lesson.title}
                            status={status}
                            onRelease={releaseLesson.bind(null, cls!.id, lesson.id)}
                            onMakeToday={makeTodayLesson.bind(null, cls!.id, lesson.id)}
                            onPullBack={pullBackLesson.bind(null, cls!.id, lesson.id)}
                            onOpenRevision={openRevisionLesson.bind(null, cls!.id, lesson.id)}
                            onCloseRevision={closeRevisionLesson.bind(null, cls!.id, lesson.id)}
                          />
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-12">
      {/* Header */}
      <div>
        <Link href="/teacher" className="text-sm text-muted-foreground hover:underline">
          ← All classes
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{cls!.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {course?.title ?? cls!.courseSlug} · {course?.yearLevel}
            </p>
          </div>
          <a
            href={`/api/export?classId=${encodeURIComponent(cls!.id)}`}
            className="shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors"
          >
            Download backup (CSV)
          </a>
        </div>
      </div>

      {/* Code-track classes: the daily release controls come first. */}
      {cls!.authMode === "code" && lessonsSection}

      {content && (
        <ReliefPanel
          classId={cls!.id}
          units={content.units}
          defaultStartId={(todayIdx >= 0 ? flatLessons[todayIdx + 1] : undefined)?.id ?? nextLesson?.id ?? flatLessons[0]?.id}
          links={liveReliefLinks(cls!.reliefLinks)}
          canRelease={authMode === "code"}
          titleById={Object.fromEntries(flatLessons.map((l) => [l.id, l.title]))}
          defaultDate={new Date(perthNow.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-CA")}
        />
      )}

      {/* Live session */}
      <section>
        <h2 className="flex items-center gap-3 text-lg font-semibold">
          Live session
          {liveState && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <span className="live-now-dot inline-block h-2 w-2 rounded-full bg-white" aria-hidden />
              Live now
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Teach a lesson slide by slide. As soon as you start, a flashing Live now button appears on your
          class homepage so students can join. You see their answers as they come in.
        </p>
        <Link
          href={`/teacher/classes/${cls!.id}/live`}
          className={`mt-3 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90 ${
            liveState ? "live-now-btn bg-red-600" : "bg-primary text-primary-foreground"
          }`}
        >
          {liveState ? "Live now: return to session" : "Start live lesson"}
        </Link>
        {liveState && <StopLiveButton classId={cls!.id} />}
      </section>

      {authMode === "account" ? (
        <>
          {/* Legacy whole-topic unlock, kept for classes already using it.
              The Lessons section below is the preferred way to manage access now. */}
          <section>
            <h2 className="text-lg font-semibold">Topic Access</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose exactly which topics students can see. Release them one at a time as you cover them.
            </p>

            {!content ? (
              <p className="mt-4 text-sm text-muted-foreground italic">
                Course content not yet available.
              </p>
            ) : (
              <form action={updateAccessForClass} className="mt-4 space-y-4">
                {content.units.map((unit) => (
                  <div key={unit.id} className="border border-border p-4">
                    {unit.subtitle && (
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">
                        {unit.subtitle}
                      </p>
                    )}
                    <p className="font-semibold mb-3">{unit.title}</p>
                    <div className="space-y-2">
                      {unit.topics.map((topic) => {
                        const compoundId = `${unit.id}:${topic.id}`;
                        // Accept both compound IDs (new format) and bare topic IDs (legacy format)
                        const checked =
                          cls!.topicIds.includes(compoundId) ||
                          cls!.topicIds.includes(topic.id);
                        return (
                          <label
                            key={topic.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                              checked ? "border-primary bg-primary/5" : "hover:bg-accent"
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="topicId"
                              value={compoundId}
                              defaultChecked={checked}
                              className="h-4 w-4 accent-primary shrink-0"
                            />
                            <div>
                              <p className="text-sm font-medium">{topic.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {topic.lessons.length} lessons
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Save Access
                </button>
              </form>
            )}
          </section>

          {lessonsSection}

          {/* Students */}
          <section>
            <h2 className="text-lg font-semibold">Students</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Students use their username and passcode to log in.
            </p>

            {/* Add Student */}
            <AddStudentForm action={addStudentToClass} />

            {cls!.students.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground italic">
                No students yet. Add them above.
              </p>
            ) : (
              <div className="mt-4 overflow-hidden border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Username</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Passcode</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Progress</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Quiz results</th>
                      <th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cls!.students.map((s) => {
                      const removeAction = removeStudent.bind(null, cls!.id, s.username);
                      const completedCount = progressByUsername[s.username] ?? 0;
                      const pct = totalUnlockedLessons > 0
                        ? Math.round((completedCount / totalUnlockedLessons) * 100)
                        : 0;
                      const { quizAttempts, quizRight } = quizByUsername[s.username] ?? { quizAttempts: 0, quizRight: 0 };
                      return (
                        <tr key={s.username} className="hover:bg-muted/20">
                          <td className="px-4 py-3">{s.displayName}</td>
                          <td className="px-4 py-3 font-mono text-xs">{s.username}</td>
                          <td className="px-4 py-3 font-mono text-xs">{s.passcode}</td>
                          <td className="px-4 py-3">
                            {totalUnlockedLessons > 0 ? (
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                  {completedCount}/{totalUnlockedLessons}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">No topics unlocked</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {quizAttempts > 0 ? (
                              <Link
                                href={`/teacher/classes/${cls!.id}/students/${encodeURIComponent(s.username)}`}
                                className="text-primary hover:underline"
                              >
                                {quizRight}/{quizAttempts} correct
                              </Link>
                            ) : (
                              <span className="text-xs text-muted-foreground">No attempts yet</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <form action={removeAction}>
                              <button
                                type="submit"
                                className="text-xs text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {cls!.students.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Students log in at <strong>/login/student</strong> with their username and passcode above.
              </p>
            )}
          </section>
        </>
      ) : (
        <>
          {/* No-login class code */}
          <section>
            <h2 className="text-lg font-semibold">Class link</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No accounts. Students open the link or enter the code, no sign-in. Nothing about who they
              are reaches the server.
            </p>
            {cls!.classCode ? (
              <ClassCodeBox code={cls!.classCode} origin={origin} />
            ) : (
              <form action={ensureClassCodeForClass} className="mt-4">
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Generate class code
                </button>
              </form>
            )}
          </section>
        </>
      )}

      {/* Danger zone */}
      <section className="border-t pt-8">
        <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
        <form action={deleteClass} className="mt-3">
          <DeleteClassButton className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-white transition-colors">
            Delete this class
          </DeleteClassButton>
        </form>
      </section>
    </div>
  );
}
