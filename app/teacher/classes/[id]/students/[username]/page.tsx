import Link from "next/link";
import { notFound } from "next/navigation";
import { getClass, getStudentQuizStats } from "@/lib/db";
import { getCourseContent } from "@/lib/content";
import { getCourseBySlug } from "@/lib/courses";
import { hardestQuestions, mergeStats } from "@/lib/logic/insights";

export const dynamic = "force-dynamic";

export default async function StudentQuizResultsPage({
  params,
}: {
  params: Promise<{ id: string; username: string }>;
}) {
  const { id, username } = await params;
  const cls = await getClass(id);
  if (!cls) notFound();

  const student = cls.students.find((s) => s.username === username);
  if (!student) notFound();

  const course = getCourseBySlug(cls.courseSlug);
  const content = getCourseContent(cls.courseSlug);
  const stats = mergeStats([await getStudentQuizStats(cls.id, username)]);
  // minAttempts: 1, unlike the class-wide report — one student's own single
  // attempt is still worth showing, it just isn't meaningful as a class trend.
  const rows = hardestQuestions(content ? [content] : [], stats, 1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <div>
        <Link href={`/teacher/classes/${cls.id}`} className="text-sm text-muted-foreground hover:underline">
          ← {cls.name}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{student.displayName}&apos;s quiz results</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {course?.title ?? cls.courseSlug} · Lowest correct rate first.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">No quiz answers recorded yet.</p>
      ) : (
        <div className="overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Question</th>
                <th className="px-3 py-2 font-medium">Correct</th>
                <th className="px-3 py-2 font-medium">Most common wrong answer</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r) => (
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
    </div>
  );
}
