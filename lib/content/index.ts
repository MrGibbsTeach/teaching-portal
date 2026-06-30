import type { CourseContent } from "./types";
import generalData from "./data/year-11-applied-it-general.json";
import atarData from "./data/year-11-applied-it-atar.json";
import foundationsData from "./data/ait-foundations.json";

const registry: Record<string, CourseContent> = {
  "year-11-applied-it-general": generalData as CourseContent,
  "year-11-applied-it-atar": atarData as CourseContent,
  "ait-foundations": foundationsData as CourseContent,
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
  for (const unit of course.units) {
    for (const topic of unit.topics) {
      const idx = topic.lessons.findIndex((l) => l.id === lessonId);
      if (idx === -1) continue;
      const next = topic.lessons[idx + 1];
      return next ? { lessonId: next.id, lessonTitle: next.title } : null;
    }
  }
  return null;
}
