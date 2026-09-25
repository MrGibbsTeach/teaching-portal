import type { Block, CourseContent } from "@/lib/content/types";

/**
 * Stable id for a quiz question: a hash of its text. Keyed by text rather than position, so
 * reordering or inserting blocks in a lesson never mixes up the recorded results.
 */
export function questionKey(lessonId: string, text: string): string {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${lessonId}~${(h >>> 0).toString(36)}`;
}

/** Hash fields written per answer: `<key>:r` / `<key>:w` (right/wrong) and `<key>:o<i>` (option picked). */
export const statFields = (key: string, chosen: number, correct: boolean) => [
  `${key}:${correct ? "r" : "w"}`,
  `${key}:o${chosen}`,
];

export interface QuestionStat {
  key: string;
  attempts: number;
  right: number;
  wrong: number;
  /** picks per option index */
  picks: Record<number, number>;
}

/** Fold one or more raw stat hashes (one per class) into per-question stats. */
export function mergeStats(hashes: readonly Record<string, unknown>[]): Map<string, QuestionStat> {
  const out = new Map<string, QuestionStat>();
  for (const hash of hashes) {
    for (const [field, value] of Object.entries(hash)) {
      const n = Number(value);
      const at = field.lastIndexOf(":");
      if (at < 0 || !Number.isFinite(n)) continue;
      const key = field.slice(0, at);
      const kind = field.slice(at + 1);
      const stat = out.get(key) ?? { key, attempts: 0, right: 0, wrong: 0, picks: {} };
      if (kind === "r") stat.right += n;
      else if (kind === "w") stat.wrong += n;
      else if (/^o\d+$/.test(kind)) {
        const i = Number(kind.slice(1));
        stat.picks[i] = (stat.picks[i] ?? 0) + n;
      } else continue;
      stat.attempts = stat.right + stat.wrong;
      out.set(key, stat);
    }
  }
  return out;
}

export interface QuestionInsight {
  key: string;
  courseSlug: string;
  lessonId: string;
  lessonTitle: string;
  text: string;
  attempts: number;
  right: number;
  /** 0..1 */
  correctRate: number;
  /** The most-picked wrong option's label, if any. */
  commonWrongAnswer?: string;
  commonWrongCount?: number;
}

type QuizBlock = Extract<Block, { type: "quizQuestion" }>;

/** Options that a question offers, as the student sees them. */
function optionLabels(block: QuizBlock): string[] {
  const q = block.question;
  if (q.questionType === "true_false") return ["True", "False"];
  return q.options ?? [];
}

function correctIndexOf(block: QuizBlock): number | undefined {
  const q = block.question;
  if (q.questionType === "true_false") return q.correctAnswer === undefined ? undefined : q.correctAnswer ? 0 : 1;
  return q.correctIndex;
}

/**
 * Join recorded stats back onto the questions in the content, hardest first.
 * Questions with fewer than `minAttempts` answers are left out (too little data to mean anything).
 */
export function hardestQuestions(
  courses: readonly CourseContent[],
  stats: Map<string, QuestionStat>,
  minAttempts = 3,
): QuestionInsight[] {
  const rows: QuestionInsight[] = [];
  for (const course of courses) {
    for (const unit of course.units) {
      for (const topic of unit.topics) {
        for (const lesson of topic.lessons) {
          for (const block of lesson.blocks) {
            if (block.type !== "quizQuestion") continue;
            const key = questionKey(lesson.id, block.question.text);
            const s = stats.get(key);
            if (!s || s.attempts < minAttempts) continue;
            const labels = optionLabels(block);
            const right = correctIndexOf(block);
            const wrongPicks = Object.entries(s.picks)
              .map(([i, n]) => [Number(i), n] as const)
              .filter(([i]) => i !== right)
              .sort((a, b) => b[1] - a[1]);
            const top = wrongPicks[0];
            rows.push({
              key,
              courseSlug: course.slug,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              text: block.question.text,
              attempts: s.attempts,
              right: s.right,
              correctRate: s.right / s.attempts,
              commonWrongAnswer: top ? labels[top[0]] : undefined,
              commonWrongCount: top?.[1],
            });
          }
        }
      }
    }
  }
  // The same key can appear twice only if a lesson is shared between courses; keep the first.
  const seen = new Set<string>();
  return rows
    .filter((r) => (seen.has(r.key) ? false : (seen.add(r.key), true)))
    .sort((a, b) => a.correctRate - b.correctRate || b.attempts - a.attempts);
}

export const FEEDBACK_CATEGORIES = ["confusing", "mistake", "broken", "too-hard", "other"] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface FeedbackItem {
  id: string;
  ts: string;
  role: "student" | "teacher";
  classId?: string;
  username?: string;
  displayName?: string;
  courseSlug: string;
  lessonId: string;
  category: FeedbackCategory;
  note: string;
}

const MAX_NOTE = 1000;

/** Validate and normalise untrusted feedback input. Returns null if unusable. */
export function parseFeedback(input: {
  category: unknown;
  note: unknown;
}): { category: FeedbackCategory; note: string } | null {
  const category = FEEDBACK_CATEGORIES.find((c) => c === input.category);
  if (!category) return null;
  const note = typeof input.note === "string" ? input.note.trim().slice(0, MAX_NOTE) : "";
  return { category, note };
}
