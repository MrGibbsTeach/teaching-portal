import { describe, expect, it } from "vitest";
import type { Topic } from "@/lib/content/types";
import { computeMastery, nextUp } from "./mastery";
import { blockingCheckpoint, maxSeekTime } from "./checkpoints";
import { checkBuckets, checkOrder, shuffleUnsolved } from "./activity-check";

const topic = (id: string, lessonIds: string[], prerequisites?: string[]): Topic => ({
  id,
  title: id,
  prerequisites,
  lessons: lessonIds.map((l) => ({ id: l, title: l, blocks: [] })),
});

describe("computeMastery", () => {
  const topics = [topic("a", ["a1", "a2"]), topic("b", ["b1"], ["a"]), topic("c", ["c1"], ["nope"])];

  it("locks topics until prerequisites are mastered", () => {
    const nodes = computeMastery(topics, new Set(["a1"]));
    expect(nodes.map((n) => n.state)).toEqual(["in-progress", "locked", "available"]);
  });

  it("unlocks and masters as lessons complete", () => {
    const nodes = computeMastery(topics, new Set(["a1", "a2", "b1"]));
    expect(nodes.map((n) => n.state)).toEqual(["mastered", "mastered", "available"]);
  });

  it("ignores prerequisites that name unknown skills", () => {
    expect(computeMastery(topics, new Set())[2].state).toBe("available");
  });

  it("does not treat an empty topic as mastered", () => {
    expect(computeMastery([topic("e", [])], new Set())[0].state).toBe("available");
  });

  it("nextUp prefers in-progress over available", () => {
    const nodes = computeMastery(topics, new Set(["a1"]));
    expect(nextUp(nodes)?.topicId).toBe("a");
    expect(nextUp(computeMastery([topic("z", ["z1"])], new Set(["z1"])))).toBeUndefined();
  });
});

describe("checkpoints", () => {
  const cps = [{ atSeconds: 10 }, { atSeconds: 30 }];

  it("blocks at the earliest unanswered reached checkpoint", () => {
    expect(blockingCheckpoint(cps, new Set(), 5)).toBe(-1);
    expect(blockingCheckpoint(cps, new Set(), 12)).toBe(0);
    expect(blockingCheckpoint(cps, new Set([0]), 35)).toBe(1);
    expect(blockingCheckpoint(cps, new Set([0, 1]), 99)).toBe(-1);
  });

  it("limits seeking to the next unanswered checkpoint", () => {
    expect(maxSeekTime(cps, new Set())).toBe(10);
    expect(maxSeekTime(cps, new Set([0]))).toBe(30);
    expect(maxSeekTime(cps, new Set([0, 1]))).toBe(Infinity);
  });
});

describe("activity checks", () => {
  const cats = [
    { label: "Input", items: ["Mouse", "Keyboard"] },
    { label: "Output", items: ["Monitor"] },
  ];

  it("reports wrongly placed bucket items", () => {
    const ok = checkBuckets(cats, { Mouse: "Input", Keyboard: "Input", Monitor: "Output" });
    expect(ok.correct).toBe(true);
    const bad = checkBuckets(cats, { Mouse: "Output", Keyboard: "Input" });
    expect(bad).toEqual({ correct: false, wrong: ["Mouse", "Monitor"] });
  });

  it("reports misplaced order positions", () => {
    expect(checkOrder(["a", "b", "c"], ["a", "b", "c"]).correct).toBe(true);
    expect(checkOrder(["a", "b", "c"], ["b", "a", "c"]).misplaced).toEqual([0, 1]);
  });

  it("never returns the solved order from shuffleUnsolved", () => {
    const items = ["a", "b", "c", "d"];
    for (let seed = 1; seed < 50; seed++) {
      expect(shuffleUnsolved(items, seed)).not.toEqual(items);
    }
    expect(shuffleUnsolved(["x"])).toEqual(["x"]);
  });
});
