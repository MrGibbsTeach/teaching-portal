"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { getClass, saveClass, deleteClass } from "@/lib/db";
import type { ClassConfig } from "@/lib/auth-types";

async function requireTeacher() {
  const session = await getSession();
  if (session?.role !== "teacher") redirect("/login/teacher");
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

  const cls: ClassConfig = {
    id,
    name,
    courseSlug,
    topicIds: [],
    students: [],
    createdAt: new Date().toISOString(),
  };
  await saveClass(cls);
  redirect("/teacher/classes/" + id);
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
