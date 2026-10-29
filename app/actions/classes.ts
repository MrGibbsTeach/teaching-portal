"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { getClass, getClasses, saveClass, deleteClass } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { generateClassCode, isReservedCode } from "@/lib/logic/class-code";
import {
  release as releaseLessonFn,
  makeToday as makeTodayFn,
  pullBack as pullBackFn,
  openForRevision as openForRevisionFn,
  closeRevision as closeRevisionFn,
  syncTodayLessonId,
} from "@/lib/logic/release";
import type { ClassAuthMode, ClassConfig } from "@/lib/auth-types";

async function requireTeacher() {
  const session = await getSession();
  if (session?.role !== "teacher") redirect("/login/teacher");
}

/** Generates a class code that collides with neither a reserved route nor an existing class. */
async function generateUniqueClassCode(): Promise<string> {
  const existing = new Set(
    (await getClasses()).map((c) => c.classCode).filter(Boolean) as string[]
  );
  let code = generateClassCode();
  while (isReservedCode(code) || existing.has(code)) {
    code = generateClassCode();
  }
  return code;
}

export async function createClass(formData: FormData) {
  await requireTeacher();
  const name = (formData.get("name") as string).trim();
  const courseSlug = formData.get("courseSlug") as string;
  if (!name || !courseSlug) redirect("/teacher/classes/new?error=1");

  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  // ATAR keeps the existing username/passcode login (live sessions need a name
  // anyway). Every other tier is no-login: a class code/link, no student
  // identity reaches the server (redesign-plan.md, 28 Oct 2026).
  const tier = getCourseBySlug(courseSlug)?.tier;
  const authMode: ClassAuthMode = tier === "atar" ? "account" : "code";

  const cls: ClassConfig = {
    id,
    name,
    courseSlug,
    topicIds: [],
    students: [],
    createdAt: new Date().toISOString(),
    authMode,
    ...(authMode === "code" ? { classCode: await generateUniqueClassCode() } : {}),
  };
  await saveClass(cls);
  redirect("/teacher/classes/" + id);
}

/** Backfills a class code for a class created before authMode existed. */
export async function ensureClassCode(classId: string) {
  await requireTeacher();
  const cls = await getClass(classId);
  if (!cls || cls.classCode) return;
  cls.authMode = "code";
  cls.classCode = await generateUniqueClassCode();
  await saveClass(cls);
  revalidatePath("/teacher/classes/" + classId);
}

async function applyRelease(
  classId: string,
  lessonId: string,
  transform: (releases: Record<string, import("@/lib/auth-types").LessonRelease>, lessonId: string) => Record<string, import("@/lib/auth-types").LessonRelease>
) {
  await requireTeacher();
  const cls = await getClass(classId);
  if (!cls) return;
  const next = transform(cls.releases ?? {}, lessonId);
  await saveClass(syncTodayLessonId(cls, next));
  revalidatePath("/teacher/classes/" + classId);
}

export async function releaseLesson(classId: string, lessonId: string) {
  await applyRelease(classId, lessonId, releaseLessonFn);
}

export async function makeTodayLesson(classId: string, lessonId: string) {
  await applyRelease(classId, lessonId, makeTodayFn);
}

export async function pullBackLesson(classId: string, lessonId: string) {
  await applyRelease(classId, lessonId, pullBackFn);
}

export async function openRevisionLesson(classId: string, lessonId: string) {
  await applyRelease(classId, lessonId, openForRevisionFn);
}

export async function closeRevisionLesson(classId: string, lessonId: string) {
  await applyRelease(classId, lessonId, closeRevisionFn);
}

export async function updateAccess(classId: string, formData: FormData) {
  await requireTeacher();
  const cls = await getClass(classId);
  if (!cls) return;
  cls.topicIds = formData.getAll("topicId") as string[];
  await saveClass(cls);
  revalidatePath("/teacher/classes/" + classId);
}

export async function addStudent(classId: string, formData: FormData) {
  await requireTeacher();
  const cls = await getClass(classId);
  if (!cls) return;

  const displayName = (formData.get("displayName") as string).trim();
  const passcode = (formData.get("passcode") as string).trim();
  if (!displayName || !passcode) return;

  const username = displayName
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");

  if (cls.students.find((s) => s.username === username)) {
    revalidatePath("/teacher/classes/" + classId);
    return;
  }

  cls.students.push({ username, displayName, passcode });
  await saveClass(cls);
  revalidatePath("/teacher/classes/" + classId);
}

export async function removeStudent(classId: string, username: string) {
  await requireTeacher();
  const cls = await getClass(classId);
  if (!cls) return;
  cls.students = cls.students.filter((s) => s.username !== username);
  await saveClass(cls);
  revalidatePath("/teacher/classes/" + classId);
}

export async function removeClass(classId: string) {
  await requireTeacher();
  await deleteClass(classId);
  redirect("/teacher");
}
