"use client";

import { useState } from "react";
import Link from "next/link";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { CodeExercise } from "@/components/course/shared/CodeExercise";
import { submitLiveAnswer } from "@/app/actions/live";
import { useLivePoll } from "@/components/live/useLivePoll";
import { choiceLabels, correctChoice, type LiveAnswer } from "@/lib/logic/live";
import type { Block } from "@/lib/content/types";

interface StudentPayload {
  active: boolean;
  courseSlug?: string;
  lessonTitle?: string;
  slideIndex?: number;
  slideCount?: number;
  revealed?: boolean;
  heading?: string | null;
  block?: Block;
  myAnswer?: LiveAnswer | null;
}

async function loadSlide(code?: string): Promise<StudentPayload> {
  const r = await fetch(code ? `/api/live?code=${encodeURIComponent(code)}` : "/api/live", { cache: "no-store" });
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as StudentPayload;
}

/** Follows the teacher's live session: polls for the current slide and sends answers back. */
export function LiveStudent({ courseHref, code }: { courseHref: string; code?: string }) {
  const { data, offline } = useLivePoll(() => loadSlide(code), (d) => d.active);

  if (!data) return <p className="text-muted-foreground">Connecting…</p>;

  if (!data.active || !data.block || data.slideIndex === undefined) {
    return (
      <div className="border border-dashed border-border p-10 text-center">
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
          {offline && <strong className="ml-2 text-destructive">Reconnecting…</strong>}
        </span>
      </div>
      {/* Keyed by slide so local answer state resets when the teacher moves on. */}
      {data.heading && <h2 className="font-heading text-xl font-semibold tracking-tight">{data.heading}</h2>}
      <LiveSlide key={`${data.lessonTitle}-${data.slideIndex}`} data={data} block={data.block} slideIndex={data.slideIndex} anonymous={!!code} />
    </div>
  );
}

function LiveSlide({ data, block, slideIndex, anonymous }: { data: StudentPayload; block: Block; slideIndex: number; anonymous: boolean }) {
  if (block.type === "codeExercise") {
    return (
      <CodeExercise
        block={block}
        onResult={(score) => {
          if (!anonymous) void submitLiveAnswer(slideIndex, { score });
        }}
      />
    );
  }
  if (block.type === "quizQuestion" && choiceLabels(block).length > 0) {
    return <LiveQuestion block={block} slideIndex={slideIndex} revealed={!!data.revealed} saved={data.myAnswer} anonymous={anonymous} />;
  }
  return <BlockRenderer block={block} />;
}

function LiveQuestion({
  block,
  slideIndex,
  revealed,
  saved,
  anonymous,
}: {
  block: Block;
  slideIndex: number;
  revealed: boolean;
  saved?: LiveAnswer | null;
  anonymous: boolean;
}) {
  const labels = choiceLabels(block);
  const right = correctChoice(block);
  const [picked, setPicked] = useState<number | null>(saved && "choice" in saved ? saved.choice : null);
  const [failed, setFailed] = useState(false);
  const q = block.type === "quizQuestion" ? block.question : null;

  async function choose(i: number) {
    if (revealed) return;
    setPicked(i);
    // No-login classes have no student identity, so the answer stays on this screen only.
    if (anonymous) return;
    const r = await submitLiveAnswer(slideIndex, { choice: i });
    setFailed(!r.ok);
  }

  return (
    <div className="space-y-3 border-2 border-border p-5">
      <p className="text-lg font-semibold">{q?.text}</p>
      <div className="grid gap-2">
        {labels.map((label, i) => {
          const showRight = revealed && right === i;
          const showWrong = revealed && picked === i && right !== i;
          // Once revealed, every option that is not the answer carries a cross.
          const showCross = revealed && right !== undefined && right !== i;
          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              aria-pressed={picked === i}
              onClick={() => void choose(i)}
              className={`border px-4 py-3 text-left font-medium ${
                showRight
                  ? "border-2 border-green-600 bg-green-100 text-green-900"
                  : showWrong
                    ? "border-2 border-red-600 bg-red-100 text-red-900"
                    : picked === i
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
              }`}
            >
              {showRight && <span aria-hidden className="mr-2 font-bold text-green-700">✓</span>}
              {showCross && (
                <span aria-hidden className={`mr-2 font-bold ${showWrong ? "text-red-700" : "text-muted-foreground"}`}>
                  ✗
                </span>
              )}
              {label}
              {showRight && <span className="sr-only"> (correct answer)</span>}
              {showWrong && <span className="sr-only"> (your answer, incorrect)</span>}
              {showCross && !showWrong && <span className="sr-only"> (incorrect)</span>}
            </button>
          );
        })}
      </div>
      <p role="status" className="text-sm font-medium">
        {failed
          ? "Your answer did not send. Tap it again."
          : revealed
            ? picked === right
              ? "Correct!"
              : "The right answer is highlighted in green."
            : picked !== null
              ? anonymous
                ? "Locked in on your screen. Your teacher will show the answer."
                : "Answer sent. You can change it until your teacher shows the answer."
              : ""}
      </p>
      {revealed && q?.explanation && <p className="bg-muted p-3 text-sm">{q.explanation}</p>}
    </div>
  );
}
