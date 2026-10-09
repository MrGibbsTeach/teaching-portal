import type { ClassConfig } from "../auth-types";
import type { CourseContent } from "../content/types";

/** One row of the teacher export: a single student in a single class. */
export interface ExportRow {
  className: string;
  courseSlug: string;
  classId: string;
  username: string;
  displayName: string;
  passcode: string;
  unlockedTopics: number;
  lessonsUnlocked: number;
  lessonsComplete: number;
  percentComplete: number;
  completedLessonIds: string[];
  classCreatedAt: string;
}

export const EXPORT_HEADERS = [
  "Class",
  "Course",
  "Class ID",
  "Username",
  "Student name",
  "Passcode",
  "Unlocked topics",
  "Lessons unlocked",
  "Lessons complete",
  "% complete",
  "Completed lesson IDs",
  "Class created",
] as const;

/**
 * Whether a class has unlocked a topic. Accepts the compound `unitId:topicId`
 * key used since the topic-access fix, and the bare topic id that older class
 * records still hold — the same rule the teacher and course pages apply.
 */
export function topicUnlocked(cls: ClassConfig, unitId: string, topicId: string): boolean {
  return cls.topicIds.includes(`${unitId}:${topicId}`) || cls.topicIds.includes(topicId);
}

/** Counts topics and lessons a class can actually reach. */
export function unlockedCounts(
  cls: ClassConfig,
  content: CourseContent | undefined
): { topics: number; lessons: number } {
  if (!content) return { topics: 0, lessons: 0 };
  let topics = 0;
  let lessons = 0;
  for (const unit of content.units) {
    for (const topic of unit.topics) {
      if (!topicUnlocked(cls, unit.id, topic.id)) continue;
      topics += 1;
      lessons += topic.lessons.length;
    }
  }
  return { topics, lessons };
}

export function buildExportRows(
  classes: ClassConfig[],
  contentFor: (slug: string) => CourseContent | undefined,
  progressFor: (classId: string, username: string) => string[]
): ExportRow[] {
  const rows: ExportRow[] = [];
  for (const cls of classes) {
    const { topics, lessons } = unlockedCounts(cls, contentFor(cls.courseSlug));
    for (const student of cls.students) {
      const completed = progressFor(cls.id, student.username);
      rows.push({
        className: cls.name,
        courseSlug: cls.courseSlug,
        classId: cls.id,
        username: student.username,
        displayName: student.displayName,
        passcode: student.passcode,
        unlockedTopics: topics,
        lessonsUnlocked: lessons,
        lessonsComplete: completed.length,
        percentComplete: lessons > 0 ? Math.round((completed.length / lessons) * 100) : 0,
        completedLessonIds: completed,
        classCreatedAt: cls.createdAt,
      });
    }
  }
  return rows;
}

/**
 * Quotes one CSV field. Excel reads a leading `=`, `+`, `-` or `@` as a formula,
 * so those are prefixed with a single quote — student names and class names are
 * free text, and a backup should not execute anything when it is opened.
 */
export function csvField(value: string | number): string {
  const s = String(value ?? "");
  const guarded = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export function toCsv(rows: ExportRow[]): string {
  const lines = [EXPORT_HEADERS.map(csvField).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.className,
        r.courseSlug,
        r.classId,
        r.username,
        r.displayName,
        r.passcode,
        r.unlockedTopics,
        r.lessonsUnlocked,
        r.lessonsComplete,
        r.percentComplete,
        r.completedLessonIds.join(" "),
        r.classCreatedAt,
      ]
        .map(csvField)
        .join(",")
    );
  }
  // CRLF and a trailing newline: what Excel expects from a .csv.
  return lines.join("\r\n") + "\r\n";
}

/** `mrgibbs-progress-2026-10-10.csv`, or `…-year-11-applied-it-general-…` for one class. */
export function exportFilename(date: Date, classSlug?: string): string {
  const stamp = date.toISOString().slice(0, 10);
  return classSlug
    ? `mrgibbs-progress-${classSlug}-${stamp}.csv`
    : `mrgibbs-progress-${stamp}.csv`;
}
