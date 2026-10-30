"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { Block } from "@/lib/content/types";
import { blockPart } from "@/lib/content/parts";
import {
  activitiesScore,
  hasPassed,
  recordQuizAttempt,
  quizStepResolved,
  type QuizOutcome,
} from "@/lib/logic/step-player";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { markLessonComplete } from "@/lib/local-progress";

type Tab = "content" | "activities";

/** Arcade-only celebration on a passed lesson (redesign-plan.md §2.2: "stars or
 *  score per activity, confetti... nothing that carries across lessons"). Pure
 *  CSS, gated by the `.theme-foundations` ancestor class so it's a no-op (and
 *  not even rendered visibly) on Portfolio/Study, which explicitly rule out
 *  game language. */
function ArcadeBurst() {
  const pieces = Array.from({ length: 10 });
  return (
    <div className="skin-arcade-burst pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((_, i) => (
        <span key={i} className="skin-arcade-burst-piece" style={{ "--i": i } as CSSProperties} />
      ))}
    </div>
  );
}

function isGradableQuiz(block: Block): block is Block & { type: "quizQuestion" } {
  return (
    block.type === "quizQuestion" &&
    (block.question.questionType === "mcq" || block.question.questionType === "true_false")
  );
}

/** A divider is a pure visual rule, not a thing to step through on its own. */
function isStep(block: Block): boolean {
  return block.type !== "divider";
}

/**
 * Fold a lone heading into the step for whatever comes after it, instead of
 * giving it a screen of its own with nothing on it (reported 29 Oct 2026: a
 * "Test-ready recap" heading rendered as its own empty step, with the recap
 * list on the next one). A heading now reads as a section title sitting
 * above its content, in the same step — matching how every reference site
 * treats a heading. A trailing heading with nothing after it (rare) still
 * gets its own step rather than vanishing.
 */
function groupSteps(blocks: Block[]): Block[][] {
  const steps: Block[][] = [];
  let pendingHeadings: Block[] = [];
  for (const block of blocks) {
    if (block.type === "heading") {
      pendingHeadings.push(block);
      continue;
    }
    steps.push([...pendingHeadings, block]);
    pendingHeadings = [];
  }
  if (pendingHeadings.length > 0) steps.push(pendingHeadings);
  return steps;
}

/**
 * Group into steps on the lesson's original block order first, THEN split
 * into Content/Activities tabs by each step's own content. Grouping after
 * the Content/Activities split (the obvious order) breaks when a heading is
 * written to introduce an Activities block (e.g. "Assessment practice"
 * right before a quiz): with Activities blocks already filtered out, that
 * heading has nothing of its own next to it in the Content stream and gets
 * wrongly merged into the next, unrelated Content heading instead. Grouping
 * first keeps every heading paired with whatever it was actually written
 * to introduce, wherever that block ends up.
 */
function groupAndSplit(blocks: Block[]): { content: Block[][]; activities: Block[][] } {
  const groups = groupSteps(blocks.filter(isStep));
  const content: Block[][] = [];
  const activities: Block[][] = [];
  for (const group of groups) {
    const mainType = group[group.length - 1].type;
    (blockPart(mainType) === "activities" ? activities : content).push(group);
  }
  return { content, activities };
}

/** Label for a grouped step: prefer its heading's own text (an action-named
 *  title, per S4) over the generic label of whatever block it introduces. */
function groupLabel(group: Block[]): string {
  // Last heading (closest to the content it introduces), not the first — a
  // group can carry more than one heading in a row.
  const headings = group.filter((b): b is Block & { type: "heading" } => b.type === "heading");
  const heading = headings[headings.length - 1];
  return heading ? heading.text : stepLabel(group[group.length - 1]);
}

/** Short, human label for a step's dropdown/progress entry (redesign-plan.md
 *  §4 S4: "Steps named as actions"). Falls back to a generic, type-based name
 *  when the block carries no title of its own. */
function stepLabel(block: Block): string {
  switch (block.type) {
    case "heading":
      return block.text;
    case "richText":
      return block.heading ?? "Notes";
    case "paragraph":
      return "Notes";
    case "callout":
      return block.heading ?? "Note";
    case "keyTerm":
      return `Key term: ${block.term}`;
    case "keyTerms":
      return "Key terms";
    case "video":
      return block.title ?? "Watch";
    case "checkpointVideo":
      return block.title ?? "Watch";
    case "animation3d":
      return block.title ?? "3D animation";
    case "table":
      return "Reference table";
    case "list":
      return "Notes";
    case "grid":
      return block.title ?? "Overview";
    case "comparison":
      return block.title ?? "Compare";
    case "softwareExamples":
      return block.title ?? "Software examples";
    case "formulaBreakdown":
      return block.title ?? "Formula";
    case "formulaBuilder":
      return block.title ?? "Build it";
    case "task":
      return block.title;
    case "codePreview":
      return block.title ?? "Code";
    case "interactiveDiagram":
      return block.title ?? "Try it";
    case "codeExercise":
      return block.title;
    case "scenarioChallenge":
      return block.title ?? "Scenario";
    case "spotTheThreat":
      return block.title ?? "Spot the threat";
    case "activity":
      return block.title ?? "Activity";
    case "infoCards":
      return block.title ?? "Key ideas";
    case "flipCards":
      return block.title ?? "Flip the cards";
    case "sorter":
      return block.title ?? "Sort it";
    case "sequence":
      return block.title ?? "Put it in order";
    case "branchingScenario":
      return block.title ?? "What would you do?";
    case "fileSizeLab":
      return block.title ?? "File size lab";
    case "placer":
      return block.title ?? "Place the devices";
    case "videoSlot":
      return block.title;
    case "svgFigure":
      return block.title ?? "Diagram";
    case "quizQuestion": {
      const qt = block.question.questionType;
      if (qt === "short_answer") return "Short answer";
      if (qt === "extended") return "Extended answer";
      if (qt === "matching") return "Match it";
      return "Check";
    }
    default:
      return "Step";
  }
}

/** Dropdown jump + progress strip, shared by the Content and Activities
 *  tracks (redesign-plan.md §4 S4: "step dropdown with progress strip"). The
 *  dropdown always allows free review of any step; only the Next button below
 *  it enforces earned progression on a quiz step. */
function StepNav({
  labels,
  index,
  onJump,
}: {
  labels: string[];
  index: number;
  onJump: (i: number) => void;
}) {
  const progress = labels.length > 1 ? index / (labels.length - 1) : 1;
  return (
    <div className="mt-3">
      <select
        value={index}
        onChange={(e) => onJump(Number(e.target.value))}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
      >
        {labels.map((label, i) => (
          <option key={i} value={i}>
            {`Step ${i + 1} of ${labels.length}: ${label}`}
          </option>
        ))}
      </select>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}

function QuizStep({
  block,
  outcome,
  onAttempt,
}: {
  block: Block & { type: "quizQuestion" };
  outcome: QuizOutcome | undefined;
  onAttempt: (correct: boolean) => void;
}) {
  const q = block.question;
  const resolved = quizStepResolved(outcome);
  const [picked, setPicked] = useState<number | boolean | null>(null);

  function pick(value: number | boolean, isCorrect: boolean) {
    if (resolved) return;
    setPicked(value);
    onAttempt(isCorrect);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-lg">{q.text}</p>
        {/* Study-only marks chip (redesign-plan.md §2.2); hidden by CSS on every other skin. */}
        {q.marks !== undefined && (
          <span className="skin-marks-chip shrink-0">
            {q.marks} mark{q.marks === 1 ? "" : "s"}
          </span>
        )}
      </div>
      {q.questionType === "mcq" && q.options && (
        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isPicked = picked === i;
            const show = resolved || isPicked;
            return (
              <button
                key={i}
                type="button"
                disabled={resolved}
                onClick={() => pick(i, isCorrect)}
                className={`skin-btn-primary flex w-full items-center justify-between border px-4 py-2.5 text-left text-sm transition-colors ${
                  show && isCorrect
                    ? "border-primary bg-primary/5 font-medium text-primary"
                    : show && isPicked
                      ? "border-destructive text-destructive"
                      : "border-border hover:bg-accent/40"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
      {q.questionType === "true_false" && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[true, false].map((val) => {
            const isCorrect = val === q.correctAnswer;
            const isPicked = picked === val;
            const show = resolved || isPicked;
            return (
              <button
                key={String(val)}
                type="button"
                disabled={resolved}
                onClick={() => pick(val, isCorrect)}
                className={`skin-btn-primary border py-3 font-medium transition-colors ${
                  show && isCorrect
                    ? "border-primary bg-primary/5 text-primary"
                    : show && isPicked
                      ? "border-destructive text-destructive"
                      : "border-border hover:bg-accent/40"
                }`}
              >
                {val ? "True" : "False"}
              </button>
            );
          })}
        </div>
      )}

      {!resolved && outcome && outcome.attempts > 0 && (
        <p className="mt-3 text-sm text-destructive">
          Not quite — try again ({outcome.attempts}/3).
        </p>
      )}
      {resolved && outcome?.revealed && (
        <div className="skin-card mt-3 bg-amber-500/10 p-3 text-sm">
          <p className="font-medium">Worked answer</p>
          <p className="mt-1 text-muted-foreground">{q.explanation ?? "See the correct option above."}</p>
        </div>
      )}
      {resolved && outcome?.correct && q.explanation && (
        <>
          {/* Study gets the exam-tip card treatment; every other skin keeps the plain line. */}
          <p className="skin-exam-tip-off mt-3 text-sm text-muted-foreground">{q.explanation}</p>
          <div className="skin-exam-tip mt-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Exam tip</p>
            <p className="mt-1 text-muted-foreground">{q.explanation}</p>
          </div>
        </>
      )}
    </div>
  );
}

export function StepPlayer({
  blocks,
  classCode,
  lessonId,
  onFinish,
}: {
  blocks: Block[];
  classCode: string;
  lessonId: string;
  /** Called once when the lesson is marked complete. Defaults to localStorage
   *  (no-login code track); ATAR passes a Redis-backed callback instead. */
  onFinish?: () => void;
}) {
  const { content, activities } = useMemo(() => groupAndSplit(blocks), [blocks]);
  const contentLabels = useMemo(() => content.map(groupLabel), [content]);
  const activityLabels = useMemo(() => activities.map(groupLabel), [activities]);

  const [tab, setTab] = useState<Tab>("content");
  const [contentStepIndex, setContentStepIndex] = useState(0);
  const [activityStepIndex, setActivityStepIndex] = useState(0);
  const [quizOutcomes, setQuizOutcomes] = useState<Record<number, QuizOutcome>>({});
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  const stepIndex = tab === "content" ? contentStepIndex : activityStepIndex;
  const step = (tab === "content" ? content : activities)[stepIndex];
  const mainBlock = step?.[step.length - 1];

  const gradableSteps = activities.filter((g) => isGradableQuiz(g[g.length - 1]));
  const gradableIndexes = activities
    .map((g, i) => (isGradableQuiz(g[g.length - 1]) ? i : -1))
    .filter((i) => i >= 0);
  const outcomesInOrder = gradableIndexes.map((i) => quizOutcomes[i]);

  const stepResolved =
    tab === "activities" && mainBlock
      ? isGradableQuiz(mainBlock)
        ? quizStepResolved(quizOutcomes[activityStepIndex])
        : !!done[activityStepIndex]
      : true;

  function finish() {
    if (onFinish) onFinish();
    else markLessonComplete(classCode, lessonId);
    setFinished(true);
  }

  function nextContent() {
    if (contentStepIndex >= content.length - 1) {
      if (activities.length > 0) {
        setTab("activities");
      } else {
        finish();
      }
    } else {
      setContentStepIndex((i) => i + 1);
    }
  }

  function nextActivity() {
    if (activityStepIndex >= activities.length - 1) {
      finish();
    } else {
      setActivityStepIndex((i) => i + 1);
    }
  }

  if (finished) {
    const score = activitiesScore(outcomesInOrder);
    const passed = hasPassed(outcomesInOrder);
    return (
      <div className="relative mx-auto max-w-2xl px-6 py-16 text-center">
        {passed && <ArcadeBurst />}
        <div
          className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${
            passed ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Lesson complete</h2>
        {gradableSteps.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {passed
              ? `Nice work — ${Math.round(score * 100)}% on the activities.`
              : `${Math.round(score * 100)}% on the activities — worth a quick review before next lesson.`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("content")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "content" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setTab("activities")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "activities" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Activities{activities.length > 0 ? ` (${activities.length})` : ""}
        </button>
      </div>

      {tab === "content" && content.length > 0 && (
        <div className="py-8">
          <StepNav labels={contentLabels} index={contentStepIndex} onJump={setContentStepIndex} />
          <div className="mt-6 space-y-6">
            {content[contentStepIndex].map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              disabled={contentStepIndex === 0}
              onClick={() => setContentStepIndex((i) => Math.max(0, i - 1))}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={nextContent}
              className="skin-btn-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {contentStepIndex >= content.length - 1
                ? activities.length > 0
                  ? "Go to activities →"
                  : "Mark lesson complete"
                : "Next →"}
            </button>
          </div>
        </div>
      )}

      {tab === "activities" && step && mainBlock && (
        <div className="py-8">
          <StepNav labels={activityLabels} index={activityStepIndex} onJump={setActivityStepIndex} />
          <div className="mt-6 space-y-6">
            {step.slice(0, -1).map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
            {isGradableQuiz(mainBlock) ? (
              <QuizStep
                block={mainBlock}
                outcome={quizOutcomes[activityStepIndex]}
                onAttempt={(correct) =>
                  setQuizOutcomes((prev) => ({
                    ...prev,
                    [activityStepIndex]: recordQuizAttempt(prev[activityStepIndex], correct),
                  }))
                }
              />
            ) : (
              <div>
                <BlockRenderer block={mainBlock} />
                {!done[activityStepIndex] && (
                  <button
                    type="button"
                    onClick={() => setDone((prev) => ({ ...prev, [activityStepIndex]: true }))}
                    className="skin-btn-primary mt-4 border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Done, continue
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              disabled={activityStepIndex === 0}
              onClick={() => setActivityStepIndex((i) => Math.max(0, i - 1))}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!stepResolved}
              onClick={nextActivity}
              className="skin-btn-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {activityStepIndex >= activities.length - 1 ? "Finish lesson" : "Next →"}
            </button>
          </div>
        </div>
      )}

      {tab === "activities" && activities.length === 0 && (
        <div className="py-8">
          <p className="text-sm text-muted-foreground italic">No activities in this lesson.</p>
          <button
            type="button"
            onClick={finish}
            className="skin-btn-primary mt-4 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Mark lesson complete
          </button>
        </div>
      )}
    </div>
  );
}
