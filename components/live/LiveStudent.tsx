"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { CodeExercise } from "@/components/course/shared/CodeExercise";
import { submitLiveAnswer } from "@/app/actions/live";
import { choiceLabels, correctChoice, type LiveAnswer } from "@/lib/logic/live";
import type { Block } from "@/lib/content/types";

interface StudentPayload {
  active: boolean;
  courseSlug?: string;
  lessonTitle?: string;
  slideIndex?: number;
  slideCount?: number;
  revealed?: boolean;
  block?: Block;
  myAnswer?: LiveAnswer | null;
}

const POLL_MS = 2000;

/** Follows the teacher's live session: polls for the current slide and sends answers back. */
export function LiveStudent({ courseHref }: { courseHref: string }) {
  const [data, setData] = useState<StudentPayload | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const r = await fetch("/api/live", { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const j = (await r.json()) as StudentPayload;
        if (!stop) {
          setData(j);
          setOffline(false);
        }
      } catch {
        if (!stop) setOffline(true);
      }
    }
    tick();
    const t = setInterval(tick, POLL_MS);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, []);

  if (!data) return <p className="text-muted-foreground">Connecting…</p>;

  if (!data.active || !data.block || data.slideIndex === undefined) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="text-lg font-medium">Waiting for your teacher to start…</p>
        <p className="mt-1 text-sm text-muted-foreground">This page updates by itself. Keep it open.</p>
        <Link href={courseHref} className="mt-4 inline-block text-sm underline">
          Back to my course
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{data.lessonTitle}</span>
        <span>
          Slide {data.slideIndex + 1} of {data.slideCount}
          {offline && <strong className="ml-2 text-red-600">Reconnecting…</strong>}
        </span>
      </div>
      {/* Keyed by slide so local answer state resets when the teacher moves on. */}
      <LiveSlide key={`${data.lessonTitle}-${data.slideIndex}`} data={data} block={data.block} slideIndex={data.slideIndex} />
    </div>
  );
}

function LiveSlide({ data, block, slideIndex }: { data: StudentPayload; block: Block; slideIndex: number }) {
  if (block.type === "codeExercise") {
    return (
      <CodeExercise
        block={block}
        onResult={(score) => void submitLiveAnswer(slideIndex, { score })}
      />
    );
  }
  if (block.type === "quizQuestion" && choiceLabels(block).length > 0) {
    return <LiveQuestion block={block} slideIndex={slideIndex} revealed={!!data.revealed} saved={data.myAnswer} />;
  }
  return <BlockRenderer block={block} />;
}

function LiveQuestion({
  block,
  slideIndex,
  revealed,
  saved,
}: {
  block: Block;
  slideIndex: number;
  revealed: boolean;
  saved?: LiveAnswer | null;
}) {
  const labels = choiceLabels(block);
  const right = correctChoice(block);
  const [picked, setPicked] = useState<number | null>(saved && "choice" in saved ? saved.choice : null);
  const [failed, setFailed] = useState(false);
  const q = block.type === "quizQuestion" ? block.question : null;

  async function choose(i: number) {
    if (revealed) return;
    setPicked(i);
    const r = await submitLiveAnswer(slideIndex, { choice: i });
    setFailed(!r.ok);
  }

  return (
    <div className="space-y-3 rounded-xl border-2 p-5">
      <p className="text-lg font-semibold">{q?.text}</p>
      <div className="grid gap-2">
        {labels.map((label, i) => {
          const showRight = revealed && right === i;
          const showWrong = revealed && picked === i && right !== i;
          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              aria-pressed={picked === i}
              onClick={() => void choose(i)}
              className={`rounded-lg border-2 px-4 py-3 text-left font-medium ${
                showRight
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : showWrong
                    ? "border-red-500 bg-red-50 text-red-900"
                    : picked === i
                      ? "border-primary bg-primary/10"
                      : "bg-card"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p role="status" className="text-sm font-medium">
        {failed
          ? "Your answer did not send. Tap it again."
          : revealed
            ? picked === right
              ? "✅ Correct!"
              : "The right answer is highlighted."
            : picked !== null
              ? "✅ Answer sent. You can change it until your teacher shows the answer."
              : ""}
      </p>
      {revealed && q?.explanation && <p className="rounded-lg bg-muted p-3 text-sm">{q.explanation}</p>}
    </div>
  );
}
