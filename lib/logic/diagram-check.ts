import type { DiagramKind } from "@/lib/content/types";

/**
 * Learner state per diagram kind:
 *  - toggle-state: { [toggleId]: boolean }
 *  - slider:       { [sliderId]: number }
 *  - drag-arrange: { order: string[] }
 *  - connect:      { links: [left, right][] }
 */
export type DiagramState = Record<string, unknown>;

export interface DiagramResult {
  solved: boolean;
  /** Ids (toggle/slider ids, order positions as strings, or "left→right" links) that are wrong. */
  wrong: string[];
}

export function checkDiagram(
  kind: DiagramKind,
  config: Record<string, unknown>,
  goal: DiagramState,
  state: DiagramState,
): DiagramResult {
  const wrong: string[] = [];

  if (kind === "toggle-state") {
    for (const [id, want] of Object.entries(goal)) {
      if (state[id] !== want) wrong.push(id);
    }
  } else if (kind === "slider") {
    const tolerance = typeof config.tolerance === "number" ? config.tolerance : 0;
    for (const [id, want] of Object.entries(goal)) {
      const got = state[id];
      if (typeof got !== "number" || typeof want !== "number" || Math.abs(got - want) > tolerance) {
        wrong.push(id);
      }
    }
  } else if (kind === "drag-arrange") {
    const want = (goal.order as string[] | undefined) ?? [];
    const got = (state.order as string[] | undefined) ?? [];
    want.forEach((item, i) => {
      if (got[i] !== item) wrong.push(String(i));
    });
  } else if (kind === "connect") {
    const key = (l: string, r: string) => `${l}→${r}`;
    const want = new Set(((goal.links as [string, string][] | undefined) ?? []).map(([l, r]) => key(l, r)));
    const got = new Set(((state.links as [string, string][] | undefined) ?? []).map(([l, r]) => key(l, r)));
    for (const k of got) if (!want.has(k)) wrong.push(k);
    for (const k of want) if (!got.has(k)) wrong.push(k);
  }

  return { solved: wrong.length === 0, wrong };
}
