export const LEGACY_FOUNDATIONS_SLUG = "ait-foundations";
export const FOUNDATIONS_Y11_SLUG = "year-11-ait-foundations";
export const FOUNDATIONS_Y12_SLUG = "year-12-ait-foundations";
export const FOUNDATIONS_SLUGS: readonly string[] = [FOUNDATIONS_Y11_SLUG, FOUNDATIONS_Y12_SLUG];

/** Units of the combined legacy course that belong to Year 12. */
export const FOUNDATIONS_Y12_UNIT_IDS: readonly string[] = ["unit3", "unit4"];

export function isFoundationsSlug(slug: string): boolean {
  return slug === LEGACY_FOUNDATIONS_SLUG || FOUNDATIONS_SLUGS.includes(slug);
}

/**
 * Which new course a legacy `ait-foundations` class belongs to.
 * Access keys are compound `unitId:topicId` (or legacy bare topic ids).
 * A class goes to Year 12 only if every unlocked topic is a Year 12 one;
 * mixed or empty classes stay in Year 11 (the first half of the course).
 * `y12BareTopicIds` lets legacy bare ids be recognised.
 */
export function legacyFoundationsTarget(
  topicIds: readonly string[],
  y12BareTopicIds: ReadonlySet<string>,
): string {
  if (topicIds.length === 0) return FOUNDATIONS_Y11_SLUG;
  const isY12 = (key: string) => {
    const [unit, topic] = key.includes(":") ? key.split(":") : [undefined, key];
    return unit ? FOUNDATIONS_Y12_UNIT_IDS.includes(unit) : y12BareTopicIds.has(topic);
  };
  return topicIds.every(isY12) ? FOUNDATIONS_Y12_SLUG : FOUNDATIONS_Y11_SLUG;
}
