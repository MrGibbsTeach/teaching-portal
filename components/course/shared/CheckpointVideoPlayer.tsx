"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Block, QuizQuestion, VideoCheckpoint } from "@/lib/content/types";
import { blockingCheckpoint, maxSeekTime, resolveCheckpointTimes } from "@/lib/logic/checkpoints";
import { BucketSort, OrderSteps } from "./InteractiveActivities";
import { DiagramRunner } from "./DiagramRunner";

interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  pauseVideo(): void;
  playVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}
interface YTApi {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: { onReady?: () => void };
    },
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const rank = (at: number | "end") => (at === "end" ? Infinity : at);

let apiPromise: Promise<YTApi> | null = null;
function loadYouTubeApi(): Promise<YTApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT as YTApi);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return apiPromise;
}

/**
 * Edpuzzle-style player: pauses at each checkpoint and cannot continue (or be
 * skipped past) until the checkpoint block is answered.
 */
export function CheckpointVideoPlayer({
  youtubeId,
  title,
  checkpoints,
  onComplete,
}: {
  youtubeId: string;
  title?: string;
  checkpoints: VideoCheckpoint[];
  onComplete?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const answeredRef = useRef<Set<number>>(new Set());
  const maxWatchedRef = useRef(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number>(-1);
  const sorted = useMemo(
    () => checkpoints.map((c, i) => ({ ...c, i })).sort((a, b) => rank(a.atSeconds) - rank(b.atSeconds)),
    [checkpoints],
  );

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;
      const mount = document.createElement("div");
      hostRef.current.appendChild(mount);
      const player = new YT.Player(mount, {
        videoId: youtubeId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, disablekb: 1 },
      });
      playerRef.current = player;

      timer = setInterval(() => {
        const p = playerRef.current;
        if (!p || typeof p.getCurrentTime !== "function") return;
        const t = p.getCurrentTime();
        // Anti-skip: jumping ahead of what has been watched snaps back.
        if (t > maxWatchedRef.current + 2) {
          p.seekTo(maxWatchedRef.current, true);
          return;
        }
        maxWatchedRef.current = Math.max(maxWatchedRef.current, t);
        const times = resolveCheckpointTimes(checkpoints, p.getDuration?.() ?? 0);
        const limit = maxSeekTime(times, answeredRef.current);
        // Stop skipping past an unanswered checkpoint.
        const target = t > limit + 1 ? limit : t;
        if (target !== t) p.seekTo(limit, true);
        const idx = blockingCheckpoint(times, answeredRef.current, target);
        if (idx !== -1) {
          p.pauseVideo();
          setActive((cur) => (cur === -1 ? idx : cur));
        }
      }, 250);
    });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [youtubeId, checkpoints]);

  function resolveActive() {
    if (active === -1) return;
    const next = new Set(answeredRef.current).add(active);
    answeredRef.current = next;
    setAnswered(next);
    setActive(-1);
    playerRef.current?.playVideo();
    if (next.size === checkpoints.length) onComplete?.();
  }

  const activeCp = active === -1 ? null : checkpoints[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black">
        <div ref={hostRef} className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full" aria-label={title ?? "video"} />
        {activeCp && (
          <div className="absolute inset-0 overflow-y-auto bg-background p-4 sm:p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">
              Quick check {answered.size + 1} of {checkpoints.length}
            </p>
            <CheckpointBlock key={active} block={activeCp.block} onSolved={resolveActive} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-1" aria-label="Checkpoint progress">
        {sorted.map((c) => (
          <span
            key={c.i}
            className={`h-2.5 flex-1 rounded-full ${answered.has(c.i) ? "bg-emerald-500" : "bg-muted"}`}
          />
        ))}
      </div>
    </div>
  );
}

function CheckpointBlock({ block, onSolved }: { block: Block; onSolved: () => void }) {
  if (block.type === "interactiveDiagram") return <DiagramRunner block={block} onSolved={onSolved} />;
  if (block.type === "activity") {
    if (block.categories) return <ActivityShell title={block.title} instruction={block.instruction}><BucketSort categories={block.categories} onSolved={onSolved} /></ActivityShell>;
    if (block.orderedItems) return <ActivityShell title={block.title} instruction={block.instruction}><OrderSteps orderedItems={block.orderedItems} onSolved={onSolved} /></ActivityShell>;
  }
  if (block.type === "quizQuestion") return <QuickQuestion q={block.question} onSolved={onSolved} />;
  // Unsupported checkpoint content: never trap the learner.
  return (
    <button type="button" onClick={onSolved} className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">
      Continue
    </button>
  );
}

function ActivityShell({ title, instruction, children }: { title?: string; instruction?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {title && <p className="text-lg font-semibold">{title}</p>}
      {instruction && <p className="text-sm">{instruction}</p>}
      {children}
    </div>
  );
}

function QuickQuestion({ q, onSolved }: { q: QuizQuestion; onSolved: () => void }) {
  const isTF = q.questionType === "true_false";
  const options = isTF ? ["True", "False"] : (q.options ?? []);
  const correct = isTF ? (q.correctAnswer ? 0 : 1) : q.correctIndex;
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  // Question types without a single right option cannot be auto-checked here.
  if (options.length === 0 || correct === undefined) {
    return (
      <div className="space-y-3">
        <p className="text-lg font-semibold">{q.text}</p>
        <button type="button" onClick={onSolved} className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">
          Continue
        </button>
      </div>
    );
  }

  function choose(i: number) {
    if (done) return;
    setPicked(i);
    if (i === correct) {
      setDone(true);
      setTimeout(onSolved, 700);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold">{q.text}</p>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            onClick={() => choose(i)}
            className={`rounded-lg border-2 px-4 py-3 text-left font-medium ${
              picked === i ? (i === correct ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-red-500 bg-red-50 text-red-900") : "bg-card"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p role="status" className="text-sm font-medium">
        {done ? "✅ Correct!" : picked !== null ? "Not quite. Try another answer." : ""}
      </p>
    </div>
  );
}
