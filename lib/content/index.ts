import type { CourseContent } from "./types";
import generalData from "./data/year-11-applied-it-general.json";
import general12Data from "./data/year-12-applied-it-general.json";
import atarData from "./data/year-11-applied-it-atar.json";
import foundationsData from "./data/ait-foundations.json";

const registry: Record<string, CourseContent> = {
  "year-11-applied-it-general": generalData as CourseContent,
  "year-12-applied-it-general": general12Data as CourseContent,
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
