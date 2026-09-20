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

import { checkDiagram } from "./diagram-check";

describe("checkDiagram", () => {
  it("toggle-state flags toggles in the wrong position", () => {
    const r = checkDiagram("toggle-state", {}, { wifi: true, vpn: false }, { wifi: true, vpn: true });
    expect(r).toEqual({ solved: false, wrong: ["vpn"] });
  });

  it("slider honours tolerance", () => {
    expect(checkDiagram("slider", { tolerance: 2 }, { a: 10 }, { a: 12 }).solved).toBe(true);
    expect(checkDiagram("slider", { tolerance: 2 }, { a: 10 }, { a: 13 }).solved).toBe(false);
    expect(checkDiagram("slider", {}, { a: 10 }, {}).solved).toBe(false);
  });

  it("drag-arrange compares order positions", () => {
    const goal = { order: ["a", "b", "c"] };
    expect(checkDiagram("drag-arrange", {}, goal, { order: ["a", "b", "c"] }).solved).toBe(true);
    expect(checkDiagram("drag-arrange", {}, goal, { order: ["a", "c", "b"] }).wrong).toEqual(["1", "2"]);
  });

  it("connect reports missing and extra links", () => {
    const goal = { links: [["pc", "router"]] };
    const r = checkDiagram("connect", {}, goal, { links: [["pc", "printer"]] });
    expect(r.solved).toBe(false);
    expect(r.wrong.sort()).toEqual(["pc→printer", "pc→router"]);
  });
});

import { legacyFoundationsTarget, isFoundationsSlug } from "./foundations-migration";

describe("legacyFoundationsTarget", () => {
  const y12Bare = new Set(["c12_1", "e12_4"]);
  it("sends all-Y12 classes to Year 12", () => {
    expect(legacyFoundationsTarget(["unit3:c12_1", "unit4:e12_1"], y12Bare)).toBe("year-12-ait-foundations");
    expect(legacyFoundationsTarget(["c12_1", "e12_4"], y12Bare)).toBe("year-12-ait-foundations");
  });
  it("keeps mixed, Y11 and empty classes in Year 11", () => {
    expect(legacyFoundationsTarget(["unit1:c11_1", "unit3:c12_1"], y12Bare)).toBe("year-11-ait-foundations");
    expect(legacyFoundationsTarget(["unit2:c11_6"], y12Bare)).toBe("year-11-ait-foundations");
    expect(legacyFoundationsTarget([], y12Bare)).toBe("year-11-ait-foundations");
  });
  it("recognises all foundations slugs", () => {
    expect(isFoundationsSlug("ait-foundations")).toBe(true);
    expect(isFoundationsSlug("year-12-ait-foundations")).toBe(true);
    expect(isFoundationsSlug("year-11-applied-it-general")).toBe(false);
  });
});

import { withGeneralPrerequisites } from "./general-tree";

describe("withGeneralPrerequisites", () => {
  const unit = ["design-concepts", "hardware", "impacts-of-technology-u3", "application-skills-u3", "project-management-u3"].map((id) =>
    topic(id, [id + "1"]),
  );

  it("chains application-skills after the foundations and project-management after that", () => {
    const t = withGeneralPrerequisites(unit);
    expect(t[0].prerequisites).toBeUndefined();
    expect(t[2].prerequisites).toBeUndefined();
    expect(t[3].prerequisites).toEqual(["design-concepts", "hardware"]);
    expect(t[4].prerequisites).toEqual(["application-skills-u3"]);
  });

  it("does not block dependants when a prerequisite topic is hidden from the student", () => {
    const visible = withGeneralPrerequisites(unit).filter((t) => t.id !== "hardware");
    const nodes = computeMastery(visible, new Set(["design-concepts1"]));
    expect(nodes.find((n) => n.topicId === "application-skills-u3")?.state).toBe("available");
  });
});
