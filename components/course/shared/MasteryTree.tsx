import Link from "next/link";
import type { Lesson, Topic } from "@/lib/content/types";
import { computeMastery, nextUp, skillIdOf, type NodeState } from "@/lib/logic/mastery";

const STYLE: Record<NodeState, string> = {
  locked: "border-dashed border-border bg-muted/40 text-muted-foreground",
  available: "border-primary/50 bg-card",
  "in-progress": "border-primary bg-primary/10",
  mastered: "border-primary bg-primary text-primary-foreground",
};
const LABEL: Record<NodeState, string> = { locked: "Locked", available: "", "in-progress": "In progress", mastered: "Mastered" };

/** Depth of each skill = longest prerequisite chain to it (cycle-safe). */
function depths(topics: Topic[]): Map<string, number> {
  const byId = new Map(topics.map((t) => [skillIdOf(t), t]));
  const memo = new Map<string, number>();
  const visit = (id: string, seen: Set<string>): number => {
    if (memo.has(id)) return memo.get(id)!;
    if (seen.has(id)) return 0;
    const t = byId.get(id);
    const parents = (t?.prerequisites ?? []).filter((p) => byId.has(p));
    const d = parents.length === 0 ? 0 : 1 + Math.max(...parents.map((p) => visit(p, new Set(seen).add(id))));
    memo.set(id, d);
    return d;
  };
  for (const t of topics) visit(skillIdOf(t), new Set());
  return memo;
}

/**
 * Khan-style mastery map. Topics sit in tiers by prerequisite depth. Each node shows
 * locked / available / in-progress / mastered, continues at the first unfinished lesson,
 * and lists all its lessons. Set `unlockAll` for teachers/previews so nothing is locked.
 */
export function MasteryTree({
  topics,
  completed,
  lessonHref,
  unlockAll = false,
  showProgress = true,
}: {
  topics: Topic[];
  completed: ReadonlySet<string>;
  lessonHref: (lesson: Lesson) => string;
  unlockAll?: boolean;
  /** False when there is no student progress to show (teacher preview). */
  showProgress?: boolean;
}) {
  const nodes = computeMastery(topics, completed);
  const next = showProgress ? nextUp(nodes) : undefined;
  const depth = depths(topics);
  const titleOf = new Map(topics.map((t) => [skillIdOf(t), t.title]));
  const maxDepth = Math.max(0, ...depth.values());
  const tiers = Array.from({ length: maxDepth + 1 }, (_, d) =>
    topics.filter((t) => (depth.get(skillIdOf(t)) ?? 0) === d),
  );

  return (
    <ol className="space-y-8">
      {tiers.map((tier, d) => (
        <li key={d}>
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <span aria-hidden className="h-px w-5 bg-primary/60" />
            {d === 0 ? "Start here" : `Then · level ${d + 1}`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tier.map((t) => {
              const node = nodes.find((n) => skillIdOf(t) === n.skillId)!;
              const open = unlockAll || node.state !== "locked";
              const isNext = next?.skillId === node.skillId;
              const prereqNames = (t.prerequisites ?? []).map((p) => titleOf.get(p)).filter(Boolean);
              const cont = t.lessons.find((l) => !completed.has(l.id)) ?? t.lessons[0];
              const doneCount = t.lessons.filter((lesson) => completed.has(lesson.id)).length;
              const state: NodeState = showProgress ? node.state : "available";
              return (
                <div
                  key={skillIdOf(t)}
                  className={`group relative overflow-hidden rounded-xl border ${STYLE[open ? state : "locked"]} ${isNext ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                >
                  {showProgress && (
                    <div className="h-1.5 bg-muted/80" role="img" aria-label={`${doneCount} of ${t.lessons.length} lessons complete`}>
                      <div className="h-full bg-primary transition-[width]" style={{ width: `${Math.round(node.progress * 100)}%` }} />
                    </div>
                  )}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {showProgress ? `${doneCount} of ${t.lessons.length} lessons` : `${t.lessons.length} lessons`}
                        </p>
                        {open && cont ? (
                          <Link href={lessonHref(cont)} className="mt-1 block font-heading text-lg font-semibold leading-snug tracking-tight hover:text-primary">
                            {t.title}
                          </Link>
                        ) : (
                          <span className="mt-1 block font-heading text-lg font-semibold leading-snug tracking-tight">{t.title}</span>
                        )}
                      </div>
                      {showProgress && LABEL[open ? state : "locked"] && (
                        <span className="shrink-0 rounded-full border border-current/20 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide">
                          {LABEL[open ? state : "locked"]}
                        </span>
                      )}
                    </div>
                    {t.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.description}</p>}
                    {!open && prereqNames.length > 0 && (
                      <p className="mt-3 border-t border-current/10 pt-3 text-xs leading-relaxed text-muted-foreground">
                        Unlock by finishing: {prereqNames.join(", ")}
                      </p>
                    )}
                    {isNext && open && cont && (
                      <Link href={lessonHref(cont)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                        Continue with {cont.title} <span aria-hidden>→</span>
                      </Link>
                    )}
                    {open && (
                      <details className="mt-4 border-t border-current/10 pt-3 text-sm">
                        <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">View lessons</summary>
                        <ul className="mt-2 space-y-1">
                          {t.lessons.map((l) => (
                            <li key={l.id}>
                              <Link href={lessonHref(l)} className="flex items-center gap-2 rounded px-1 py-1 hover:bg-accent">
                                {showProgress && (
                                  <span
                                    aria-hidden
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[0.6rem] font-bold ${completed.has(l.id) ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}
                                  >
                                    {completed.has(l.id) ? "✓" : ""}
                                  </span>
                                )}
                                <span className={completed.has(l.id) ? "text-muted-foreground" : ""}>{l.title}</span>
                                {completed.has(l.id) && <span className="sr-only">(completed)</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </li>
      ))}
    </ol>
  );
}
