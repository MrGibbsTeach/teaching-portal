import type { Topic } from "@/lib/content/types";

/**
 * Prerequisite rules for the General mastery tree. Edit here to change the map.
 * Every General unit has the same shape: two foundation topics first, then
 * impacts-of-technology, application-skills and project-management.
 *
 *   foundations (first two topics) ─┬─▶ application-skills ─▶ project-management
 *   impacts-of-technology (open from the start)
 *
 * Topic ids get a suffix in Year 12 (e.g. `application-skills-u3`), so rules match by prefix.
 * Prerequisites naming a topic the student cannot see are ignored by `computeMastery`,
 * so a teacher who hasn't unlocked a topic never blocks its dependants.
 */
export function withGeneralPrerequisites(topics: Topic[]): Topic[] {
  const foundations = topics.slice(0, 2).map((t) => t.id);
  const byPrefix = (prefix: string) => topics.find((t) => t.id.startsWith(prefix))?.id;
  const application = byPrefix("application-skills");

  return topics.map((t) => {
    if (t.id.startsWith("application-skills")) return { ...t, prerequisites: foundations };
    if (t.id.startsWith("project-management") && application) {
      return { ...t, prerequisites: [application] };
    }
    return t;
  });
}
