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

export interface ClassConfig {
  id: string;
  name: string;
  courseSlug: string;
  topicIds: string[];
  students: Student[];
  createdAt: string;
}
