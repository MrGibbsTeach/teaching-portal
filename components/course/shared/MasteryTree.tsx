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
    <ol className="space-y-6">
      {tiers.map((tier, d) => (
        <li key={d}>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {d === 0 ? "Start here" : `Then · level ${d + 1}`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {tier.map((t) => {
              const node = nodes.find((n) => skillIdOf(t) === n.skillId)!;
              const open = unlockAll || node.state !== "locked";
              const isNext = next?.skillId === node.skillId;
              const prereqNames = (t.prerequisites ?? []).map((p) => titleOf.get(p)).filter(Boolean);
              const cont = t.lessons.find((l) => !completed.has(l.id)) ?? t.lessons[0];
              const state: NodeState = showProgress ? node.state : "available";
              return (
                <div
                  key={skillIdOf(t)}
                  className={`border-2 p-4 ${STYLE[open ? state : "locked"]} ${isNext ? "outline outline-2 outline-offset-2 outline-primary" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {open && cont ? (
                      <Link href={lessonHref(cont)} className="font-semibold hover:underline">
                        {t.title}
                      </Link>
                    ) : (
                      <span className="font-semibold">{t.title}</span>
                    )}
                    {showProgress && LABEL[open ? state : "locked"] && (
                      <span className="shrink-0 text-xs font-medium uppercase tracking-wide">
                        {LABEL[open ? state : "locked"]}
                      </span>
                    )}
                  </div>
                  {showProgress && (
                    <div className="mt-2 h-1.5 overflow-hidden bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${Math.round(node.progress * 100)}%` }} />
                    </div>
                  )}
                  <p className="mt-1 text-xs">
                    {!open && prereqNames.length > 0
                      ? `Unlock by finishing: ${prereqNames.join(", ")}`
                      : `${t.lessons.length} lessons`}
                    {isNext && <strong className="ml-2 text-primary">Next up</strong>}
                  </p>
                  {open && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Lessons</summary>
                      <ul className="mt-1 space-y-0.5">
                        {t.lessons.map((l) => (
                          <li key={l.id}>
                            <Link href={lessonHref(l)} className="flex items-center gap-2 rounded px-1 py-1 hover:bg-accent">
                              {showProgress && (
                                <span
                                  aria-hidden
                                  className={`h-3 w-3 shrink-0 rounded-full border ${completed.has(l.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}
                                />
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
              );
            })}
          </div>
        </li>
      ))}
    </ol>
  );
}
