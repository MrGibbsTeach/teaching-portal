"use client";

import { useMemo, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import type { Block, QuizQuestion } from "@/lib/content/types";

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ConfirmGate({ onVerified }: { onVerified: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <button
      onClick={() => {
        setConfirmed(true);
        onVerified();
      }}
      disabled={confirmed}
      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-6 py-4 text-xl font-bold ${
        confirmed
          ? "border-primary bg-primary text-primary-foreground"
          : "hover:bg-accent"
      }`}
    >
      {confirmed && <Check className="h-6 w-6" />}
      {confirmed ? "Got it" : "I understand 👍"}
    </button>
  );
}

function TrueFalseCheck({
  question,
  onVerified,
}: {
  question: QuizQuestion;
  onVerified: () => void;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);

  function pick(val: boolean) {
    if (selected !== null) return;
    setSelected(val);
    onVerified();
  }

  const isCorrect = (val: boolean) => val === question.correctAnswer;
  const showState = selected !== null;

  return (
    <div>
      <p className="text-2xl font-bold tracking-tight">{question.text}</p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[true, false].map((val) => {
          const label = val ? "True ✅" : "False ❌";
          const picked = selected === val;
          const correct = isCorrect(val);
          return (
            <button
              key={String(val)}
              onClick={() => pick(val)}
              disabled={showState}
              className={`flex items-center justify-center rounded-3xl border-2 py-6 text-2xl font-bold ${
                showState && correct
                  ? "border-primary bg-primary text-primary-foreground"
                  : showState && picked && !correct
                    ? "border-destructive bg-destructive/10"
                    : "hover:bg-accent"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {showState && question.explanation && (
        <p className="mt-4 rounded-2xl bg-muted p-4 text-base">{question.explanation}</p>
      )}
    </div>
  );
}

function McqCheck({
  question,
  onVerified,
}: {
  question: QuizQuestion;
  onVerified: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      <p className="text-2xl font-bold tracking-tight">{question.text}</p>
      <div className="mt-4 space-y-3">
        {question.options?.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = i === selected;
          const showState = selected !== null;
          return (
            <button
              key={i}
              onClick={() => {
                if (selected === null) {
                  setSelected(i);
                  onVerified();
                }
              }}
              disabled={selected !== null}
              className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left text-lg font-semibold ${
                showState && isCorrect
                  ? "border-primary bg-primary/10"
                  : showState && isSelected
                    ? "border-destructive bg-destructive/10"
                    : ""
              }`}
            >
              {opt}
              {showState && isCorrect && <Check className="h-6 w-6 shrink-0 text-primary" />}
              {showState && isSelected && !isCorrect && (
                <X className="h-6 w-6 shrink-0 text-destructive" />
              )}
            </button>
          );
        })}
      </div>
      {selected !== null && question.explanation && (
        <p className="mt-4 rounded-2xl bg-muted p-4 text-base">{question.explanation}</p>
      )}
    </div>
  );
}

function MatchingCheck({
  pairs,
  onVerified,
}: {
  pairs: { term: string; definition: string }[];
  onVerified: () => void;
}) {
  const definitions = useMemo(() => shuffled(pairs.map((p) => p.definition)), [pairs]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [wrongDef, setWrongDef] = useState<string | null>(null);

  function pickTerm(term: string) {
    if (matched.has(term)) return;
    setSelectedTerm(term);
    setWrongDef(null);
  }

  function pickDefinition(def: string) {
    if (!selectedTerm) return;
    const pair = pairs.find((p) => p.term === selectedTerm);
    if (pair && pair.definition === def) {
      const next = new Set(matched);
      next.add(selectedTerm);
      setMatched(next);
      setSelectedTerm(null);
      setWrongDef(null);
      if (next.size === pairs.length) onVerified();
    } else {
      setWrongDef(def);
      setTimeout(() => setWrongDef(null), 600);
    }
  }

  return (
    <div>
      <p className="text-lg font-semibold text-muted-foreground">
        Tap a word, then tap its match.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          {pairs.map((p) => (
            <button
              key={p.term}
              onClick={() => pickTerm(p.term)}
              disabled={matched.has(p.term)}
              className={`w-full rounded-2xl border-2 p-3 text-left font-semibold ${
                matched.has(p.term)
                  ? "border-primary bg-primary/10 opacity-60"
                  : selectedTerm === p.term
                    ? "border-primary"
                    : "hover:bg-accent"
              }`}
            >
              {p.term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {definitions.map((def) => {
            const isMatchedDef = pairs.some(
              (p) => p.definition === def && matched.has(p.term)
            );
            return (
              <button
                key={def}
                onClick={() => pickDefinition(def)}
                disabled={isMatchedDef}
                className={`w-full rounded-2xl border-2 p-3 text-left ${
                  isMatchedDef
                    ? "border-primary bg-primary/10 opacity-60"
                    : wrongDef === def
                      ? "border-destructive bg-destructive/10"
                      : "hover:bg-accent"
                }`}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SequenceCheck({
  title,
  items,
  onVerified,
}: {
  title?: string;
  items: string[];
  onVerified: () => void;
}) {
  const pool = useMemo(() => shuffled(items), [items]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);

  function reset() {
    setChosen([]);
    setWrong(false);
  }

  function pick(item: string) {
    const next = [...chosen, item];
    setChosen(next);
    if (next.length === items.length) {
      if (next.every((it, i) => it === items[i])) {
        onVerified();
      } else {
        setWrong(true);
      }
    }
  }

  return (
    <div>
      {title && <p className="text-xl font-bold tracking-tight">{title}</p>}
      <div className="mt-4 min-h-[3.5rem] space-y-2 rounded-2xl border-2 border-dashed p-3">
        {chosen.length === 0 && (
          <p className="text-base text-muted-foreground">Tap the steps in order below.</p>
        )}
        {chosen.map((it, i) => (
          <div key={i} className="rounded-xl bg-primary/10 p-2 font-semibold">
            {i + 1}. {it}
          </div>
        ))}
      </div>
      {wrong ? (
        <button
          onClick={reset}
          className="mt-4 flex items-center gap-2 rounded-2xl border-2 border-destructive px-4 py-3 font-bold text-destructive"
        >
          <RotateCcw className="h-5 w-5" />
          Not quite — try again
        </button>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {pool
            .filter((it) => !chosen.includes(it))
            .map((it) => (
              <button
                key={it}
                onClick={() => pick(it)}
                className="rounded-2xl border-2 px-4 py-3 font-semibold hover:bg-accent"
              >
                {it}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function generateChoices(answer: string): string[] | null {
  const range = answer.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
  if (range) {
    const [, col1, row1, col2, row2] = range;
    const r1 = parseInt(row1, 10);
    const r2 = parseInt(row2, 10);
    const distractors = new Set(
      [
        `${col1}${r1}:${col2}${Math.max(r1, r2 - 1)}`,
        `${col1}${r1 + 1}:${col2}${r2}`,
        `${col1}${r1}:${col2}${r2 + 1}`,
      ].filter((v) => v !== answer)
    );
    if (distractors.size >= 2) return shuffled([answer, ...[...distractors].slice(0, 2)]);
  }

  const cell = answer.match(/^([A-Z]+)(\d+)$/);
  if (cell) {
    const [, col, row] = cell;
    const r = parseInt(row, 10);
    const altCol = col === "A" ? "B" : String.fromCharCode(col.charCodeAt(0) - 1);
    return shuffled([answer, `${altCol}${r}`, `${col}${r + 1}`]);
  }

  return null;
}

function FillBlankChoiceCheck({
  title,
  answer,
  choices,
  explanation,
  onVerified,
}: {
  title: string;
  answer: string;
  choices: string[];
  explanation?: string;
  onVerified: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <p className="text-xl font-bold tracking-tight">{title}</p>
      <div className="mt-4 space-y-3">
        {choices.map((choice) => {
          const isCorrect = choice === answer;
          const isSelected = choice === selected;
          const showState = selected !== null;
          return (
            <button
              key={choice}
              onClick={() => {
                if (selected === null) {
                  setSelected(choice);
                  onVerified();
                }
              }}
              disabled={selected !== null}
              className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left font-mono text-lg font-semibold ${
                showState && isCorrect
                  ? "border-primary bg-primary/10"
                  : showState && isSelected
                    ? "border-destructive bg-destructive/10"
                    : ""
              }`}
            >
              {choice}
              {showState && isCorrect && <Check className="h-6 w-6 shrink-0 text-primary" />}
              {showState && isSelected && !isCorrect && (
                <X className="h-6 w-6 shrink-0 text-destructive" />
              )}
            </button>
          );
        })}
      </div>
      {selected !== null && explanation && (
        <p className="mt-4 rounded-2xl bg-muted p-4 text-base">{explanation}</p>
      )}
    </div>
  );
}

function FillBlankTextCheck({
  title,
  answer,
  explanation,
  onVerified,
}: {
  title: string;
  answer: string;
  explanation?: string;
  onVerified: () => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct =
    submitted && value.trim().toLowerCase() === answer.trim().toLowerCase();

  function submit() {
    if (!value.trim()) return;
    setSubmitted(true);
    if (value.trim().toLowerCase() === answer.trim().toLowerCase()) {
      onVerified();
    }
  }

  return (
    <div>
      <p className="text-xl font-bold tracking-tight">{title}</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={correct}
        className="mt-4 w-full rounded-2xl border-2 p-4 text-lg font-semibold"
        placeholder="Type your answer"
      />
      {!correct && (
        <button
          onClick={submit}
          className="mt-4 rounded-2xl bg-primary px-6 py-3 text-lg font-bold text-primary-foreground"
        >
          Check
        </button>
      )}
      {submitted && (
        <div className="mt-4 rounded-2xl bg-muted p-4">
          <p className={`font-bold ${correct ? "text-primary" : "text-destructive"}`}>
            {correct ? "Correct!" : `Not quite — the answer is: ${answer}`}
          </p>
          {explanation && <p className="mt-1 text-base">{explanation}</p>}
          {!correct && (
            <button
              onClick={onVerified}
              className="mt-3 rounded-2xl border-2 px-5 py-2.5 font-bold hover:bg-accent"
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FillBlankCheck({
  title,
  answer,
  explanation,
  onVerified,
}: {
  title: string;
  answer: string;
  explanation?: string;
  onVerified: () => void;
}) {
  const choices = useMemo(() => generateChoices(answer), [answer]);
  return choices ? (
    <FillBlankChoiceCheck
      title={title}
      answer={answer}
      choices={choices}
      explanation={explanation}
      onVerified={onVerified}
    />
  ) : (
    <FillBlankTextCheck
      title={title}
      answer={answer}
      explanation={explanation}
      onVerified={onVerified}
    />
  );
}

export function FoundationsCardCheck({
  block,
  onVerified,
}: {
  block: Block;
  onVerified: () => void;
}) {
  if (block.type === "quizQuestion" && block.question.questionType === "mcq") {
    return <McqCheck question={block.question} onVerified={onVerified} />;
  }

  if (block.type === "quizQuestion" && block.question.questionType === "true_false") {
    return <TrueFalseCheck question={block.question} onVerified={onVerified} />;
  }

  if (block.type === "activity" && block.pairs) {
    return <MatchingCheck pairs={block.pairs} onVerified={onVerified} />;
  }

  if (block.type === "activity" && block.orderedItems) {
    return (
      <SequenceCheck
        title={block.title}
        items={block.orderedItems}
        onVerified={onVerified}
      />
    );
  }

  if (block.type === "activity" && block.answer) {
    return (
      <FillBlankCheck
        title={block.title ?? ""}
        answer={block.answer}
        explanation={block.explanation}
        onVerified={onVerified}
      />
    );
  }

  return (
    <div>
      <BlockRenderer block={block} />
      <ConfirmGate onVerified={onVerified} />
    </div>
  );
}
