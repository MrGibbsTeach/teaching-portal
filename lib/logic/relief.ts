import { randomBytes } from "node:crypto";
import type { ReliefLink } from "@/lib/auth-types";
import type { Block, Lesson } from "@/lib/content/types";

/**
 * Relief-teacher pages (redesign-plan.md). Everything here is pure so it can be tested without
 * Redis: making a link, expiry, and turning a lesson into a one-minute "at a glance" summary.
 * Nothing about students is read or stored.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export function newReliefToken(): string {
  return randomBytes(16).toString("base64url");
}

/** Links stop working one full day after the chosen date ends (Perth, UTC+8). */
export function reliefExpiry(date: string): string {
  const endOfDay = new Date(`${date}T23:59:59+08:00`).getTime();
  return new Date(endOfDay + DAY_MS).toISOString();
}

export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(`${date}T00:00:00+08:00`).getTime());
}

export function makeReliefLink(
  lessonIds: string[],
  date: string,
  summary: string | undefined,
  now: Date = new Date(),
  token: string = newReliefToken(),
): ReliefLink {
  const trimmed = summary?.trim();
  return {
    token,
    lessonIds,
    date,
    ...(trimmed ? { summary: trimmed.slice(0, 1200) } : {}),
    createdAt: now.toISOString(),
    expiresAt: reliefExpiry(date),
  };
}

export function isReliefExpired(link: ReliefLink, now: Date = new Date()): boolean {
  return new Date(link.expiresAt).getTime() <= now.getTime();
}

export function liveReliefLinks(links: ReliefLink[] | undefined, now: Date = new Date()): ReliefLink[] {
  return (links ?? []).filter((l) => !isReliefExpired(l, now));
}

/** `count` consecutive lessons from `startId` in course order (clamped to what exists). */
export function consecutiveLessonIds(orderedIds: string[], startId: string, count: number): string[] {
  const i = orderedIds.indexOf(startId);
  if (i < 0) return [];
  return orderedIds.slice(i, i + Math.max(1, Math.min(count, 6)));
}

// ── Lesson at a glance ───────────────────────────────────────────────────────

export type GlanceKind = "Read" | "Watch" | "Try it" | "Check" | "Write it";

export interface GlanceStep {
  kind: GlanceKind;
  label: string;
  minutes: number;
  /** For Watch steps: the YouTube video, so a relief teacher can play it on the main screen. */
  youtubeId?: string;
}

export interface GlanceAnswer {
  question: string;
  answer: string;
  marks?: number;
}

export interface LessonGlance {
  title: string;
  opening?: string;
  keyTerms: { term: string; definition: string }[];
  steps: GlanceStep[];
  totalMinutes: number;
  answers: GlanceAnswer[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function words(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function excerpt(text: string, max = 320): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

const TRY_TYPES = new Set<Block["type"]>([
  "activity", "interactiveDiagram", "codeExercise", "scenarioChallenge", "spotTheThreat", "formulaBuilder",
  "flipCards", "sorter", "sequence", "branchingScenario", "placer", "fileSizeLab", "animation3d", "codePreview",
]);

function quizAnswer(q: Extract<Block, { type: "quizQuestion" }>["question"]): string | undefined {
  if (q.modelAnswer) return q.modelAnswer;
  if (q.questionType === "mcq" && q.options && q.correctIndex !== undefined) return q.options[q.correctIndex];
  if (q.questionType === "true_false" && q.correctAnswer !== undefined) return q.correctAnswer ? "True" : "False";
  if (q.questionType === "matching" && q.pairs) return q.pairs.map((p) => `${p.term}: ${p.definition}`).join("; ");
  return q.explanation;
}

/**
 * Boils a lesson down to what a relief teacher needs: how it opens, the key terms, the steps in order
 * with rough timings, and the answers. Minutes are estimates from word counts and step types, not
 * authored times, so the page says "about".
 */
export function lessonGlance(lesson: Lesson): LessonGlance {
  const steps: GlanceStep[] = [];
  const keyTerms: LessonGlance["keyTerms"] = [];
  const answers: GlanceAnswer[] = [];
  let opening: string | undefined;
  let heading: string | undefined;
  let readWords = 0;
  let readLabel: string | undefined;

  const flushRead = () => {
    if (readWords > 0) {
      steps.push({ kind: "Read", label: readLabel ?? "Notes", minutes: Math.max(1, Math.round(readWords / 150)) });
    }
    readWords = 0;
    readLabel = undefined;
  };

  for (const b of lesson.blocks) {
    switch (b.type) {
      case "heading":
        flushRead();
        heading = b.text;
        break;
      case "paragraph":
      case "richText":
      case "callout": {
        const text = b.type === "richText" ? stripHtml(b.html) : b.text;
        if (!opening && text.length > 40) opening = excerpt(text);
        readWords += words(text);
        readLabel ??= heading;
        break;
      }
      case "keyTerm":
        keyTerms.push({ term: b.term, definition: b.definition });
        break;
      case "keyTerms":
        keyTerms.push(...b.items);
        break;
      case "video":
      case "checkpointVideo":
        flushRead();
        steps.push({ kind: "Watch", label: b.title ?? "Video", minutes: 4, youtubeId: b.youtubeId });
        break;
      case "videoSlot":
        // Empty slots are hidden from students, so they are not a step.
        if (b.youtubeId) {
          flushRead();
          steps.push({ kind: "Watch", label: b.videoTitle ?? b.title, minutes: b.minutes ?? 4, youtubeId: b.youtubeId });
        }
        break;
      case "task":
        flushRead();
        steps.push({ kind: "Try it", label: b.title, minutes: 10 });
        break;
      case "quizQuestion": {
        flushRead();
        const q = b.question;
        const written = q.questionType === "short_answer" || q.questionType === "extended";
        steps.push({
          kind: written ? "Write it" : "Check",
          label: excerpt(q.text, 70),
          minutes: q.questionType === "extended" ? 6 : written ? 3 : 1,
        });
        const a = quizAnswer(q);
        if (a) answers.push({ question: q.text, answer: a, ...(q.marks ? { marks: q.marks } : {}) });
        break;
      }
      default:
        if (TRY_TYPES.has(b.type)) {
          flushRead();
          const label = "title" in b && typeof b.title === "string" && b.title ? b.title : "Activity";
          steps.push({ kind: "Try it", label, minutes: 3 });
          if (b.type === "animation3d" && b.pauseQuestions) {
            for (const p of b.pauseQuestions) answers.push({ question: `${p.stage}: ${p.question}`, answer: p.answer });
          }
        } else if (b.type === "infoCards" && !opening && b.intro) {
          opening = excerpt(b.intro);
        }
    }
  }
  flushRead();

  return {
    title: lesson.title,
    opening,
    keyTerms: keyTerms.slice(0, 10),
    steps,
    totalMinutes: steps.reduce((n, s) => n + s.minutes, 0),
    answers,
  };
}
