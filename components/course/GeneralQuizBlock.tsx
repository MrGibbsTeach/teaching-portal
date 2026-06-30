"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/content/types";

export function GeneralQuizBlock({ question }: { question: QuizQuestion }) {
  const [selected, setSelected] = useState<number | string | boolean | null>(null);
  const [revealed, setRevealed] = useState(false);

  if (question.questionType === "mcq" && question.options) {
    return (
      <div className="mt-4 rounded-xl border-2 bg-card p-5">
        <p className="font-semibold">{question.text}</p>
        {question.marks && (
          <p className="mt-0.5 text-xs text-muted-foreground">{question.marks} marks</p>
        )}
        <div className="mt-3 space-y-2">
          {question.options.map((opt, i) => {
            const isSelected = selected === i;
            const showResult = selected !== null;
            const isCorrect = i === question.correctIndex;
            return (
              <button
                key={i}
                onClick={() => { if (selected === null) setSelected(i); }}
                disabled={selected !== null}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  showResult && isCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : showResult && isSelected
                      ? "border-red-400 bg-red-50 text-red-800"
                      : "hover:bg-accent"
                }`}
              >
                <span>{opt}</span>
                {showResult && isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                {showResult && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0 text-red-500" />}
              </button>
            );
          })}
        </div>
        {selected !== null && question.explanation && (
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {question.explanation}
          </p>
        )}
      </div>
    );
  }

  if (question.questionType === "true_false") {
    const showResult = selected !== null;
    return (
      <div className="mt-4 rounded-xl border-2 bg-card p-5">
        <p className="font-semibold">{question.text}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[true, false].map((val) => {
            const label = val ? "True" : "False";
            const isSelected = selected === val;
            const isCorrect = val === question.correctAnswer;
            return (
              <button
                key={label}
                onClick={() => { if (selected === null) setSelected(val); }}
                disabled={showResult}
                className={`rounded-lg border-2 py-3 font-semibold transition-colors ${
                  showResult && isCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : showResult && isSelected
                      ? "border-red-400 bg-red-50 text-red-800"
                      : "hover:bg-accent"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {showResult && question.explanation && (
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            {question.explanation}
          </p>
        )}
      </div>
    );
  }

  if (question.questionType === "matching" && question.pairs) {
    return (
      <div className="mt-4 rounded-xl border bg-card p-5">
        <p className="font-semibold">{question.text}</p>
        {question.marks && (
          <p className="mt-0.5 text-xs text-muted-foreground">{question.marks} marks</p>
        )}
        <dl className="mt-3 space-y-2 text-sm">
          {question.pairs.map((p, i) => (
            <div key={i} className="flex gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <dt className="font-semibold">{p.term}</dt>
              <dd className="text-muted-foreground">→ {p.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  // short_answer / extended — reveal on demand
  return (
    <div className="mt-4 rounded-xl border bg-card p-5">
      <p className="font-semibold">{question.text}</p>
      {question.marks && (
        <p className="mt-0.5 text-xs text-muted-foreground">{question.marks} marks</p>
      )}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-3 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Show model answer
        </button>
      ) : (
        <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground whitespace-pre-line">
          {question.explanation}
        </div>
      )}
    </div>
  );
}
