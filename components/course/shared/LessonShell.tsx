"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { QuizQuestion } from "@/lib/content/types";
import { recordQuizAnswer, submitFeedback } from "@/app/actions/insights";
import { FEEDBACK_CATEGORIES, type FeedbackCategory } from "@/lib/logic/insights";

interface LessonInfo {
  courseSlug: string;
  lessonId: string;
}
const LessonContext = createContext<LessonInfo | null>(null);

/**
 * Wraps a lesson so quiz components can report answers, and adds the "Something wrong?" button.
 * Used by every lesson layout (General, Foundations, ATAR).
 */
export function LessonShell({
  courseSlug,
  lessonId,
  children,
}: LessonInfo & { children: React.ReactNode }) {
  return (
    <LessonContext.Provider value={{ courseSlug, lessonId }}>
      {children}
      <FeedbackButton courseSlug={courseSlug} lessonId={lessonId} />
    </LessonContext.Provider>
  );
}

/** Reports a quiz answer for the current lesson. Does nothing outside a LessonShell. */
export function useQuizLogger() {
  const info = useContext(LessonContext);
  return useCallback(
    (question: QuizQuestion, chosen: number, correct: boolean) => {
      if (!info) return;
      // Fire and forget: logging must never get in the way of the student's answer.
      void recordQuizAnswer(info.courseSlug, info.lessonId, question.text, chosen, correct).catch(() => {});
    },
    [info],
  );
}

const LABELS: Record<FeedbackCategory, string> = {
  confusing: "😕 Confusing",
  mistake: "❌ A mistake",
  broken: "🛠️ Not working",
  "too-hard": "😓 Too hard",
  other: "💬 Something else",
};

function FeedbackButton({ courseSlug, lessonId }: LessonInfo) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function send() {
    if (!category) return;
    setState("sending");
    try {
      const r = await submitFeedback(courseSlug, lessonId, category, note);
      setState(r.ok ? "sent" : "failed");
      if (r.ok) {
        setTimeout(() => {
          setOpen(false);
          setCategory(null);
          setNote("");
          setState("idle");
        }, 1800);
      }
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          role="dialog"
          aria-label="Report a problem with this lesson"
          className="w-80 max-w-[calc(100vw-2rem)] space-y-3 rounded-2xl border-2 bg-background p-4 shadow-xl"
        >
          {state === "sent" ? (
            <p className="py-6 text-center text-lg font-semibold">Thanks! 🙌 Your teacher will see this.</p>
          ) : (
            <>
              <p className="font-semibold">What is wrong?</p>
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                    className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium ${
                      category === c ? "border-primary bg-primary/10" : "bg-card"
                    }`}
                  >
                    {LABELS[c]}
                  </button>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Tell us more (you can leave this empty)"
                aria-label="Tell us more"
                className="w-full resize-none rounded-lg border bg-background p-2 text-sm"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={!category || state === "sending"}
                  onClick={send}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                >
                  {state === "sending" ? "Sending…" : "Send"}
                </button>
                {state === "failed" && <span className="text-xs text-red-600">Did not send. Try again.</span>}
              </div>
            </>
          )}
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border-2 bg-background px-4 py-2 text-sm font-semibold shadow-lg hover:bg-accent"
      >
        {open ? "Close" : "Something wrong?"}
      </button>
    </div>
  );
}
