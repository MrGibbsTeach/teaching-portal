"use client";

import { useEffect, useState, useTransition } from "react";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { endLiveSession, setLiveRevealed, setLiveSlide, startLiveSession } from "@/app/actions/live";
import { choiceLabels, correctChoice, type SlideSummary, type StudentStatus } from "@/lib/logic/live";
import type { Block } from "@/lib/content/types";

export interface LessonOption {
  id: string;
  title: string;
  group: string;
}

interface TeacherPayload {
  active: boolean;
  lessonTitle?: string;
  slideIndex?: number;
  slideCount?: number;
  revealed?: boolean;
  block?: Block;
  slides?: { index: number; label: string }[];
  roster?: { username: string; displayName: string }[];
  summary?: SlideSummary;
}

const POLL_MS = 2000;
const CHIP: Record<StudentStatus, string> = {
  correct: "bg-primary text-primary-foreground",
  wrong: "bg-destructive text-white",
  answered: "border border-primary text-primary",
  none: "bg-muted text-muted-foreground",
};

export function LiveTeacher({ classId, lessons }: { classId: string; lessons: LessonOption[] }) {
  const [data, setData] = useState<TeacherPayload | null>(null);
  const [lessonId, setLessonId] = useState(lessons[0]?.id ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);

  async function refresh() {
    try {
      const r = await fetch(`/api/live?classId=${encodeURIComponent(classId)}`, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      setData((await r.json()) as TeacherPayload);
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    let stop = false;
    const run = () => {
      if (!stop) void refresh();
    };
    run();
    const t = setInterval(run, POLL_MS);
    return () => {
      stop = true;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  function act(fn: () => Promise<{ ok: boolean }>) {
    start(async () => {
      await fn();
      await refresh();
    });
  }

  const groups = [...new Set(lessons.map((l) => l.group))];

  if (!data?.active || data.slideIndex === undefined || !data.block) {
    return (
      <div className="space-y-4 border border-border p-5">
        <p className="font-medium">Choose a lesson to teach live</p>
        <p className="text-sm text-muted-foreground">
          Each block of the lesson becomes a slide. Students follow along on their own screens.
        </p>
        <select
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          className="w-full border border-border bg-background p-2 text-sm"
          aria-label="Lesson"
        >
          {groups.map((g) => (
            <optgroup key={g} label={g}>
              {lessons
                .filter((l) => l.group === g)
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <button
          type="button"
          disabled={pending || !lessonId}
          onClick={() => act(() => startLiveSession(classId, lessonId))}
          className="bg-primary px-5 py-2 font-medium text-primary-foreground disabled:opacity-50"
        >
          Start live session
        </button>
        {error && <p className="text-sm text-destructive">Could not reach the server. Retrying…</p>}
      </div>
    );
  }

  const { slideIndex, slideCount = 0, block, summary, roster = [], slides = [] } = data;
  const labels = choiceLabels(block);
  const right = correctChoice(block);
  const totalStudents = roster.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{data.lessonTitle}</p>
          <p className="text-sm text-muted-foreground">
            Slide {slideIndex + 1} of {slideCount}
            {error && <strong className="ml-2 text-destructive">Reconnecting…</strong>}
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => act(() => endLiveSession(classId))}
          className="border border-destructive px-4 py-2 text-sm font-medium text-destructive"
        >
          End session
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || slideIndex === 0}
          onClick={() => act(() => setLiveSlide(classId, slideIndex - 1))}
          className="border border-border px-4 py-2 font-medium disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          type="button"
          disabled={pending || slideIndex >= slideCount - 1}
          onClick={() => act(() => setLiveSlide(classId, slideIndex + 1))}
          className="bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-40"
        >
          Next →
        </button>
        {right !== undefined && (
          <button
            type="button"
            disabled={pending}
            onClick={() => act(() => setLiveRevealed(classId, !data.revealed))}
            className="border border-border px-4 py-2 font-medium"
          >
            {data.revealed ? "Hide answer" : "Show answer to students"}
          </button>
        )}
      </div>

      <div className="border border-border p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">What students see</p>
        <BlockRenderer block={block} />
      </div>

      {summary && totalStudents > 0 && (
        <section aria-label="Responses" className="space-y-4 border border-border p-4">
          <p className="font-semibold">
            Responses: {summary.answered} of {totalStudents}
            {right !== undefined && summary.answered > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">({summary.correct} correct)</span>
            )}
          </p>

          {labels.length > 0 && (
            <ul className="space-y-1.5">
              {labels.map((label, i) => {
                const n = summary.counts[i] ?? 0;
                const pct = totalStudents ? Math.round((n / totalStudents) * 100) : 0;
                return (
                  <li key={i} className="text-sm">
                    <div className="flex justify-between">
                      <span className={right === i ? "font-semibold" : ""}>
                        {right === i && "✓ "}
                        {label}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{n}</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-muted">
                      <div
                        className={`h-full ${right === i ? "bg-primary" : "bg-primary/40"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex flex-wrap gap-1.5">
            {roster.map((s) => {
              const status = summary.byStudent[s.username] ?? "none";
              return (
                <span key={s.username} title={status} className={`px-3 py-1 text-xs font-medium ${CHIP[status]}`}>
                  {s.displayName}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">Filled = correct, red = wrong, outline = answered, grey = not yet.</p>
        </section>
      )}

      <details className="border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium">All slides</summary>
        <ol className="mt-2 space-y-1">
          {slides.map((s) => (
            <li key={s.index}>
              <button
                type="button"
                disabled={pending}
                onClick={() => act(() => setLiveSlide(classId, s.index))}
                className={`w-full px-2 py-1 text-left text-sm hover:bg-accent/40 ${s.index === slideIndex ? "bg-primary/10 font-semibold" : ""}`}
              >
                {s.index + 1}. {s.label}
              </button>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
