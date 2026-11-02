export interface SessionPayload {
  role: "teacher" | "student";
  classId?: string;
  username?: string;
  displayName?: string;
  courseSlug?: string;
  expiresAt: string;
}

export interface Student {
  username: string;
  displayName: string;
  passcode: string;
}

/** How students reach a class. "account" = existing username/passcode login (ATAR only,
 *  so live sessions and server-side progress keep working). "code" = no login: a class
 *  link or code, student identity never reaches the server (redesign-plan.md, 28 Oct 2026). */
export type ClassAuthMode = "account" | "code";

export type LessonReleaseStatus = "not_released" | "released" | "today" | "revision";

export interface LessonRelease {
  status: LessonReleaseStatus;
  /** When this status was last set; drives the Term/Week label on Previous lessons. */
  releasedAt: string;
}

/** Teacher's setting for one assessment task: whether students see it, and the proposed due date. */
export interface AssessmentSetting {
  visible: boolean;
  /** Proposed due date, YYYY-MM-DD. Always subject to change. */
  dueDate?: string;
}

/** A read-only, expiring page for a relief teacher (redesign-plan.md, relief lessons). No student data. */
export interface ReliefLink {
  /** Unguessable token used in /relief/<token>. */
  token: string;
  /** Lessons covered, in teaching order. */
  lessonIds: string[];
  /** The day the relief teacher takes the class, as YYYY-MM-DD (Perth). */
  date: string;
  /** Optional teacher-written summary shown at the top of the page. */
  summary?: string;
  createdAt: string;
  /** The link stops working after this time. */
  expiresAt: string;
}

export interface ClassConfig {
  id: string;
  name: string;
  courseSlug: string;
  /** Legacy/ATAR topic-unlock model: whole topics checked on/off. */
  topicIds: string[];
  students: Student[];
  createdAt: string;
  /** Defaults to "account" when absent, so existing classes keep working unchanged. */
  authMode?: ClassAuthMode;
  /** Set only for authMode "code" classes. Permanent for the life of the class. */
  classCode?: string;
  /** Per-lesson release state for the Today's-lesson model. Keyed by lesson id. */
  releases?: Record<string, LessonRelease>;
  /** The lesson currently shown as "Today's lesson", if any. */
  todayLessonId?: string;
  /** Assessment calendar settings, keyed by assessment task id (see lib/plans/assessments.ts). */
  assessments?: Record<string, AssessmentSetting>;
  /** Relief-teacher links created for this class. Expired ones are pruned on save. */
  reliefLinks?: ReliefLink[];
}
