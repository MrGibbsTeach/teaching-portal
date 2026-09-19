import Link from "next/link";
import type { Topic } from "@/lib/content/types";
import { computeMastery, nextUp, skillIdOf, type NodeState } from "@/lib/logic/mastery";

const STYLE: Record<NodeState, string> = {
  locked: "border-dashed bg-muted/40 text-muted-foreground",
  available: "border-primary/50 bg-card",
  "in-progress": "border-primary bg-primary/10",
  mastered: "border-emerald-500 bg-emerald-50 text-emerald-950",
};
const ICON: Record<NodeState, string> = { locked: "🔒", available: "○", "in-progress": "◐", mastered: "✅" };

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
 * Khan-style mastery map. Topics sit in tiers by prerequisite depth; each node
 * shows locked / available / in-progress / mastered and links to its first lesson.
 * `hrefFor` returns null for topics the learner cannot open (e.g. class access lock).
 */
export function MasteryTree({
  topics,
  completed,
  hrefFor,
}: {
  topics: Topic[];
  completed: ReadonlySet<string>;
  hrefFor: (topic: Topic) => string | null;
}) {
  const nodes = computeMastery(topics, completed);
  const next = nextUp(nodes);
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
            {d === 0 ? "Start here" : `Level ${d + 1}`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tier.map((t) => {
              const node = nodes.find((n) => n.topicId === t.id && n.skillId === skillIdOf(t))!;
              const href = node.state === "locked" ? null : hrefFor(t);
              const isNext = next?.skillId === node.skillId;
              const prereqNames = (t.prerequisites ?? []).map((p) => titleOf.get(p)).filter(Boolean);
              const body = (
                <>
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{t.title}</span>
                    <span aria-hidden>{ICON[node.state]}</span>
                  </span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full bg-emerald-500" style={{ width: `${Math.round(node.progress * 100)}%` }} />
                  </span>
                  <span className="mt-1 block text-xs">
                    {node.state === "locked" && prereqNames.length > 0
                      ? `Unlock by finishing: ${prereqNames.join(", ")}`
                      : `${t.lessons.length} lessons`}
                    {isNext && <strong className="ml-2 text-primary">Next up</strong>}
                  </span>
                </>
              );
              const cls = `block rounded-xl border-2 p-4 ${STYLE[node.state]} ${isNext ? "ring-2 ring-primary ring-offset-2" : ""}`;
              return href ? (
                <Link key={t.id} href={href} className={`${cls} transition-shadow hover:shadow-md`}>
                  {body}
                </Link>
              ) : (
                <div key={t.id} className={cls} aria-disabled="true">
                  {body}
                </div>
              );
            })}
          </div>
        </li>
      ))}
    </ol>
  );
}
