import Link from "next/link";
import { getClasses, getFeedback, getQuizStats } from "@/lib/db";
import { findLesson, getCourseContent } from "@/lib/content";
import { courses } from "@/lib/courses";
import { hardestQuestions, mergeStats } from "@/lib/logic/insights";
import { resolveFeedback } from "@/app/actions/insights";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  confusing: "Confusing",
  mistake: "A mistake",
  broken: "Not working",
  "too-hard": "Too hard",
  other: "Something else",
};

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  const { class: classFilter } = await searchParams;
  const [classes, feedback] = await Promise.all([getClasses(), getFeedback()]);
  const selected = classes.filter((c) => !classFilter || c.id === classFilter);
  const stats = mergeStats(await Promise.all(selected.map((c) => getQuizStats(c.id))));

  const allContent = courses.map((c) => getCourseContent(c.slug)).filter((c): c is NonNullable<typeof c> => !!c);
  const hardest = hardestQuestions(allContent, stats).slice(0, 25);
  const shownFeedback = feedback.filter((f) => !classFilter || f.classId === classFilter || f.role === "teacher");

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What students flagged as wrong, and which quiz questions they get wrong most.
        </p>
        <form className="mt-4 flex items-center gap-2 text-sm">
          <label htmlFor="class" className="text-muted-foreground">
            Class
          </label>
          <select id="class" name="class" defaultValue={classFilter ?? ""} className="rounded-lg border bg-background px-2 py-1">
            <option value="">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border px-3 py-1 font-medium hover:bg-accent">
            Filter
          </button>
        </form>
      </div>

      <section>
        <h2 className="text-lg font-semibold">
          &ldquo;Something wrong?&rdquo; notes{" "}
          <span className="text-sm font-normal text-muted-foreground">({shownFeedback.length})</span>
        </h2>
        {shownFeedback.length === 0 ? (
          <p className="mt-3 text-sm italic text-muted-foreground">Nothing reported yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {shownFeedback.map((f) => {
              const content = getCourseContent(f.courseSlug);
              const lesson = content ? findLesson(content, f.lessonId)?.lesson : undefined;
              const resolve = async () => {
                "use server";
                await resolveFeedback(f.id);
              };
              return (
                <li key={f.id} className="border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-semibold">{CATEGORY_LABEL[f.category] ?? f.category}</span>
                    <span className="text-xs text-muted-foreground">
                      {f.role === "teacher" ? "You" : (f.displayName ?? f.username ?? "Student")} ·{" "}
                      {new Date(f.ts).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  {f.note && <p className="mt-2 whitespace-pre-line text-sm">{f.note}</p>}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <Link href={`/courses/${f.courseSlug}/lesson/${f.lessonId}`} className="text-primary hover:underline">
                      {lesson?.title ?? f.lessonId}
                    </Link>
                    <form action={resolve}>
                      <button type="submit" className="text-muted-foreground hover:text-foreground hover:underline">
                        Mark as done
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Hardest quiz questions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lowest correct rate first. Only questions with at least 3 answers. Counted from students&apos; first answer on each
          visit to a lesson (General and Foundations quizzes).
        </p>
        {hardest.length === 0 ? (
          <p className="mt-3 text-sm italic text-muted-foreground">Not enough answers yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Question</th>
                  <th className="px-3 py-2 font-medium">Correct</th>
                  <th className="px-3 py-2 font-medium">Most common wrong answer</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {hardest.map((r) => (
                  <tr key={r.key} className="align-top">
                    <td className="px-3 py-2">
                      <p>{r.text}</p>
                      <Link href={`/courses/${r.courseSlug}/lesson/${r.lessonId}`} className="text-xs text-primary hover:underline">
                        {r.lessonTitle}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 tabular-nums">
                      <span className={r.correctRate < 0.5 ? "font-semibold text-destructive" : ""}>
                        {Math.round(r.correctRate * 100)}%
                      </span>{" "}
                      <span className="text-xs text-muted-foreground">
                        ({r.right}/{r.attempts})
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {r.commonWrongAnswer ? `${r.commonWrongAnswer} (${r.commonWrongCount}×)` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
