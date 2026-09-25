import type { Topic } from "@/lib/content/types";

export type NodeState = "locked" | "available" | "in-progress" | "mastered";

export interface MasteryNode {
  skillId: string;
  topicId: string;
  state: NodeState;
  /** 0..1 fraction of the topic's lessons completed. */
  progress: number;
}

export function skillIdOf(topic: Topic): string {
  return topic.skillId ?? topic.id;
}

/**
 * Derive tree node states from lesson completion.
 * A node is mastered when every lesson is complete, and unlocked when every
 * prerequisite skill is mastered. Prerequisites naming unknown skills are ignored
 * so a typo can never permanently lock a topic.
 */
export function computeMastery(topics: Topic[], completed: ReadonlySet<string>): MasteryNode[] {
  const known = new Set(topics.map(skillIdOf));
  const progressBySkill = new Map<string, number>();
  for (const t of topics) {
    const total = t.lessons.length;
    const done = t.lessons.filter((l) => completed.has(l.id)).length;
    progressBySkill.set(skillIdOf(t), total === 0 ? 0 : done / total);
  }

  return topics.map((t) => {
    const skillId = skillIdOf(t);
    const progress = progressBySkill.get(skillId) ?? 0;
    const prereqsMet = (t.prerequisites ?? [])
      .filter((p) => known.has(p))
      .every((p) => (progressBySkill.get(p) ?? 0) >= 1);

    let state: NodeState;
    if (progress >= 1 && t.lessons.length > 0) state = "mastered";
    else if (!prereqsMet) state = "locked";
    else if (progress > 0) state = "in-progress";
    else state = "available";

    return { skillId, topicId: t.id, state, progress };
  });
}

/** First node the learner should do next, or undefined when everything is mastered. */
export function nextUp(nodes: MasteryNode[]): MasteryNode | undefined {
  return (
    nodes.find((n) => n.state === "in-progress") ?? nodes.find((n) => n.state === "available")
  );
}
