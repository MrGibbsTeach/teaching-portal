"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/content/types";
import { useQuizLogger } from "@/components/course/shared/LessonShell";

export function GeneralQuizBlock({ question }: { question: QuizQuestion }) {
  const [selected, setSelected] = useState<number | string | boolean | null>(null);
  const [revealed, setRevealed] = useState(false);
  const logAnswer = useQuizLogger();

  if (question.questionType === "mcq" && question.options) {
    return (
      <div className="mt-4 border-y border-border py-4">
        <p className="font-medium">{question.text}</p>
        {question.marks && (
          <p className="mt-0.5 text-xs text-muted-foreground">{question.marks} marks</p>
        )}
        <div className="mt-3 space-y-1.5">
          {question.options.map((opt, i) => {
            const isSelected = selected === i;
            const showResult = selected !== null;
            const isCorrect = i === question.correctIndex;
            return (
              <button
                key={i}
                onClick={() => {
                  if (selected === null) {
                    setSelected(i);
                    logAnswer(question, i, i === question.correctIndex);
                  }
                }}
                disabled={selected !== null}
                className={`flex w-full items-center justify-between border px-4 py-2.5 text-left text-sm transition-colors ${
                  showResult && isCorrect
                    ? "border-primary font-medium text-primary"
                    : showResult && isSelected
                      ? "border-destructive text-destructive"
                      : "border-border hover:bg-accent/40"
                }`}
              >
                <span>{opt}</span>
                {showResult && isCorrect && <Check className="h-4 w-4 shrink-0" />}
                {showResult && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
        {selected !== null && question.explanation && (
          <p className="mt-3 text-sm text-muted-foreground">{question.explanation}</p>
        )}
      </div>
    );
  }

  if (question.questionType === "true_false") {
    const showResult = selected !== null;
    return (
      <div className="mt-4 border-y border-border py-4">
        <p className="font-medium">{question.text}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[true, false].map((val) => {
            const label = val ? "True" : "False";
            const isSelected = selected === val;
            const isCorrect = val === question.correctAnswer;
            return (
              <button
                key={label}
                onClick={() => {
                  if (selected === null) {
                    setSelected(val);
                    logAnswer(question, val ? 0 : 1, val === question.correctAnswer);
                  }
                }}
                disabled={showResult}
                className={`border py-3 font-medium transition-colors ${
                  showResult && isCorrect
                    ? "border-primary text-primary"
                    : showResult && isSelected
                      ? "border-destructive text-destructive"
                      : "border-border hover:bg-accent/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {showResult && question.explanation && (
          <p className="mt-3 text-sm text-muted-foreground">{question.explanation}</p>
        )}
      </div>
    );
  }

  if (question.questionType === "matching" && question.pairs) {
    return (
      <div className="mt-4 border-y border-border py-4">
        <p className="font-medium">{question.text}</p>
        {question.marks && (
          <p className="mt-0.5 text-xs text-muted-foreground">{question.marks} marks</p>
        )}
        <dl className="mt-3 divide-y divide-border">
          {question.pairs.map((p, i) => (
            <div key={i} className="flex gap-2 py-2 text-sm">
              <dt className="font-medium">{p.term}</dt>
              <dd className="text-muted-foreground">→ {p.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  // short_answer / extended — reveal on demand
  return (
    <div className="mt-4 border-y border-border py-4">
      <p className="font-medium">{question.text}</p>
      {question.marks && (
        <p className="mt-0.5 text-xs text-muted-foreground">{question.marks} marks</p>
      )}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-3 border border-border px-4 py-2 text-sm font-medium hover:bg-accent/40"
        >
          Show model answer
        </button>
      ) : (
        <div className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
          {question.explanation}
        </div>
      )}
    </div>
  );
}
