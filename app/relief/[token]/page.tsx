import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassByReliefToken } from "@/lib/db";
import { getCourseContent, findLesson } from "@/lib/content";
import { lessonGlance } from "@/lib/logic/relief";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Relief lesson", robots: { index: false, follow: false } };

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00+08:00`).toLocaleDateString("en-AU", {
    weekday: "long", day: "numeric", month: "long", timeZone: "Australia/Perth",
  });
}

export default async function ReliefPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const found = await getClassByReliefToken(token);
  if (!found) notFound();
  const { cls, link } = found;

  const content = getCourseContent(cls.courseSlug);
  if (!content) notFound();

  const lessons = link.lessonIds
    .map((id) => findLesson(content, id))
    .filter((f): f is NonNullable<typeof f> => !!f);
  if (lessons.length === 0) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Relief lesson</p>
      <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">{cls.name}</h1>
      <p className="mt-1 text-muted-foreground">{formatDate(link.date)}</p>

      {link.summary && (
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">From the class teacher</p>
          <p className="mt-1 whitespace-pre-line">{link.summary}</p>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        Students work through each lesson on their own laptops, step by step, from the class link. You do not need
        to teach the content. Open &ldquo;View as student&rdquo; to see exactly what they see; nothing you do there is saved.
      </p>

      <div className="mt-8 space-y-10">
        {lessons.map(({ unit, topic, lesson }, n) => {
          const g = lessonGlance(lesson);
          return (
            <section key={lesson.id} className="rounded-2xl border border-border p-6">
              <p className="text-sm font-semibold text-muted-foreground">
                {lessons.length > 1 ? `Lesson ${n + 1} of ${lessons.length} · ` : ""}
                {unit.title} / {topic.title}
              </p>
              <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">{g.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">About {g.totalMinutes} minutes of work</p>

              {g.opening && (
                <>
                  <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-primary">How the lesson opens</h3>
                  <p className="mt-1">{g.opening}</p>
                </>
              )}

              <Link
                href={`/relief/${token}/lesson/${lesson.id}`}
                className="mt-5 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                View as student
              </Link>

              <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-primary">What students do</h3>
              <ol className="mt-2 space-y-1.5">
                {g.steps.map((s, i) => (
                  <li key={i} className="text-sm">
                    <div className="flex gap-3">
                      <span className="w-16 shrink-0 font-semibold">{s.kind}</span>
                      <span className="flex-1">{s.label}</span>
                      <span className="shrink-0 text-muted-foreground">~{s.minutes} min</span>
                    </div>
                    {s.youtubeId && (
                      <details className="mt-2 ml-[4.75rem] rounded-xl border border-border p-3">
                        <summary className="cursor-pointer font-semibold text-primary">
                          Play video here
                        </summary>
                        <div className="mt-3 aspect-video overflow-hidden rounded-lg">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${s.youtubeId}`}
                            title={s.label}
                            loading="lazy"
                            allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                            className="h-full w-full"
                          />
                        </div>
                        <a
                          href={`https://www.youtube.com/watch?v=${s.youtubeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
                        >
                          Open on YouTube
                        </a>
                      </details>
                    )}
                  </li>
                ))}
              </ol>

              {g.keyTerms.length > 0 && (
                <>
                  <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-primary">Key terms</h3>
                  <dl className="mt-2 space-y-1.5 text-sm">
                    {g.keyTerms.map((k) => (
                      <div key={k.term}>
                        <dt className="inline font-semibold">{k.term}: </dt>
                        <dd className="inline">{k.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}

              {g.answers.length > 0 && (
                <details className="mt-8 rounded-xl border border-border p-4">
                  <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-primary">
                    Answers ({g.answers.length})
                  </summary>
                  <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm">
                    {g.answers.map((a, i) => (
                      <li key={i}>
                        <p className="font-medium">
                          {a.question}
                          {a.marks ? <span className="text-muted-foreground"> ({a.marks} marks)</span> : null}
                        </p>
                        <p className="mt-0.5 text-muted-foreground">{a.answer}</p>
                      </li>
                    ))}
                  </ol>
                </details>
              )}

              <div className="mt-8 rounded-xl bg-muted/40 p-4 text-sm">
                <p className="font-semibold">If something goes wrong</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>A laptop will not load the lesson: refresh the page, or have the student share with a neighbour.</li>
                  <li>A student finishes early: they can reopen any earlier step and redo the activities, or work through the quiz steps again.</li>
                  <li>Students can skip an interactive step if it will not work and carry on.</li>
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
