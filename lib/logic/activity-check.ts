/** Placement of each item into a bucket label, e.g. { "Mouse": "Input" }. */
export type BucketPlacement = Record<string, string>;

export function checkBuckets(
  categories: { label: string; items: string[] }[],
  placement: BucketPlacement,
): { correct: boolean; wrong: string[] } {
  const expected: BucketPlacement = {};
  for (const c of categories) for (const item of c.items) expected[item] = c.label;
  const wrong = Object.keys(expected).filter((item) => placement[item] !== expected[item]);
  return { correct: wrong.length === 0, wrong };
}

/** Order check: `attempt` is the learner's ordering of the original items. */
export function checkOrder(
  orderedItems: readonly string[],
  attempt: readonly string[],
): { correct: boolean; misplaced: number[] } {
  const misplaced: number[] = [];
  orderedItems.forEach((item, i) => {
    if (attempt[i] !== item) misplaced.push(i);
  });
  if (attempt.length !== orderedItems.length) {
    for (let i = orderedItems.length; i < attempt.length; i++) misplaced.push(i);
  }
  return { correct: misplaced.length === 0, misplaced };
}

/** Deterministic shuffle that never returns the solved order (for length > 1). */
export function shuffleUnsolved<T>(items: readonly T[], seed = 1): T[] {
  if (items.length < 2) return [...items];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const out = [...items];
  for (let attempt = 0; attempt < 10; attempt++) {
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.some((v, i) => v !== items[i])) return out;
  }
  return [...items.slice(1), items[0]];
}
