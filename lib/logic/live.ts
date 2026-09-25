import type { Block, Lesson } from "@/lib/content/types";

/** State of a teacher-paced live session for one class. */
export interface LiveState {
  lessonId: string;
  slideIndex: number;
  /** When true, students see which answer was correct. */
  revealed: boolean;
  startedAt: string;
}

/** What a student submitted for a slide. */
export type LiveAnswer = { choice: number } | { score: number };

/** Slides are the lesson's blocks minus dividers; teacher and students derive them identically. */
export function liveSlides(lesson: Lesson): Block[] {
  return lesson.blocks.filter((b) => b.type !== "divider");
}

export function clampSlide(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(0, Math.trunc(index) || 0), count - 1);
}

/** The single correct option index for a question slide, or undefined if it has none. */
export function correctChoice(block: Block): number | undefined {
  if (block.type !== "quizQuestion") return undefined;
  const q = block.question;
  if (q.questionType === "true_false") return q.correctAnswer === undefined ? undefined : q.correctAnswer ? 0 : 1;
  if (q.questionType === "mcq") return q.correctIndex;
  return undefined;
}

/** Options shown for a question slide (true/false becomes True, False). */
export function choiceLabels(block: Block): string[] {
  if (block.type !== "quizQuestion") return [];
  const q = block.question;
  if (q.questionType === "true_false") return ["True", "False"];
  return q.options ?? [];
}

/**
 * Remove the answer from a slide before sending it to students, unless revealed.
 * (Diagram goal states are not redacted: diagram slides check on the client.)
 */
export function redactForStudent(block: Block, revealed: boolean): Block {
  if (revealed || block.type !== "quizQuestion") return block;
  const { correctIndex, correctAnswer, explanation, ...rest } = block.question;
  void correctIndex;
  void correctAnswer;
  void explanation;
  return { ...block, question: rest };
}

export type StudentStatus = "correct" | "wrong" | "answered" | "none";

export interface SlideSummary {
  /** Number of students who picked each option (question slides). */
  counts: number[];
  answered: number;
  correct: number;
  /** Status per student username, for the roster heatmap. */
  byStudent: Record<string, StudentStatus>;
}

export function summarizeSlide(
  block: Block,
  responses: Record<string, LiveAnswer | undefined>,
  usernames: readonly string[],
): SlideSummary {
  const labels = choiceLabels(block);
  const right = correctChoice(block);
  const counts = labels.map(() => 0);
  const byStudent: Record<string, StudentStatus> = {};
  let answered = 0;
  let correct = 0;

  for (const u of usernames) {
    const r = responses[u];
    if (!r) {
      byStudent[u] = "none";
      continue;
    }
    answered++;
    if ("choice" in r) {
      if (r.choice >= 0 && r.choice < counts.length) counts[r.choice]++;
      const ok = right !== undefined && r.choice === right;
      byStudent[u] = right === undefined ? "answered" : ok ? "correct" : "wrong";
      if (ok) correct++;
    } else {
      // Code exercises report a 0..1 score; only a full score counts as correct.
      const ok = r.score >= 1;
      byStudent[u] = ok ? "correct" : "wrong";
      if (ok) correct++;
    }
  }
  return { counts, answered, correct, byStudent };
}

/** Validates an untrusted answer from the client. */
export function parseAnswer(value: unknown): LiveAnswer | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.choice === "number" && Number.isInteger(v.choice) && v.choice >= 0 && v.choice < 50) {
    return { choice: v.choice };
  }
  if (typeof v.score === "number" && Number.isFinite(v.score)) {
    return { score: Math.min(1, Math.max(0, v.score)) };
  }
  return null;
}

const strip = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Short label for a slide, for the teacher's slide list. */
export function slideLabel(block: Block): string {
  const clip = (s: string) => (s.length > 60 ? s.slice(0, 57) + "…" : s);
  switch (block.type) {
    case "heading":
      return clip(block.text);
    case "paragraph":
      return clip(block.text);
    case "richText":
      return clip(strip(block.heading || block.html));
    case "quizQuestion":
      return clip("❓ " + block.question.text);
    case "codeExercise":
      return clip("💻 " + block.title);
    case "interactiveDiagram":
      return clip("🧩 " + (block.title ?? "Diagram"));
    case "callout":
      return clip(block.heading || block.text);
    default:
      return block.type;
  }
}
