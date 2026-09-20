import type { CourseContent } from "./types";
import generalData from "./data/year-11-applied-it-general.json";
import general12Data from "./data/year-12-applied-it-general.json";
import atarData from "./data/year-11-applied-it-atar.json";
import foundationsData from "./data/ait-foundations.json";
import {
  FOUNDATIONS_Y11_SLUG,
  FOUNDATIONS_Y12_SLUG,
  FOUNDATIONS_Y12_UNIT_IDS,
} from "@/lib/logic/foundations-migration";

// `ait-foundations.json` stays the single authoring source (the enhance/merge scripts
// write to it); it is split into the Year 11 and Year 12 courses here.
const foundationsAll = foundationsData as CourseContent;
const foundationsY11: CourseContent = {
  ...foundationsAll,
  slug: FOUNDATIONS_Y11_SLUG,
  units: foundationsAll.units.filter((u) => !FOUNDATIONS_Y12_UNIT_IDS.includes(u.id)),
};
const foundationsY12: CourseContent = {
  ...foundationsAll,
  slug: FOUNDATIONS_Y12_SLUG,
  units: foundationsAll.units.filter((u) => FOUNDATIONS_Y12_UNIT_IDS.includes(u.id)),
};

/** Bare topic ids of the Year 12 units (to recognise legacy access keys). */
export const foundationsY12BareTopicIds: ReadonlySet<string> = new Set(
  foundationsY12.units.flatMap((u) => u.topics.map((t) => t.id)),
);

const registry: Record<string, CourseContent> = {
  "year-11-applied-it-general": generalData as CourseContent,
  "year-12-applied-it-general": general12Data as CourseContent,
  "year-11-applied-it-atar": atarData as CourseContent,
  [FOUNDATIONS_Y11_SLUG]: foundationsY11,
  [FOUNDATIONS_Y12_SLUG]: foundationsY12,
};

export function getCourseContent(slug: string): CourseContent | undefined {
  return registry[slug];
}

export function findLesson(course: CourseContent, lessonId: string) {
  for (const unit of course.units) {
    for (const topic of unit.topics) {
      const lesson = topic.lessons.find((l) => l.id === lessonId);
      if (lesson) return { unit, topic, lesson };
    }
  }
  return undefined;
}

export function findNextLesson(
  course: CourseContent,
  lessonId: string
): { lessonId: string; lessonTitle: string } | null {
  // Flatten all lessons across units and topics (skip coming-soon units)
  const allLessons: Array<{ lessonId: string; lessonTitle: string }> = [];
  for (const unit of course.units) {
    if (unit.status === "coming_soon") continue;
    for (const topic of unit.topics) {
      for (const lesson of topic.lessons) {
        allLessons.push({ lessonId: lesson.id, lessonTitle: lesson.title });
      }
    }
  }
  const idx = allLessons.findIndex((l) => l.lessonId === lessonId);
  if (idx === -1 || idx === allLessons.length - 1) return null;
  return allLessons[idx + 1];
}
