"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { markLessonComplete, markLessonIncomplete } from "@/lib/db";

async function requireStudent() {
  const session = await getSession();
  if (session?.role !== "student" || !session.classId || !session.username) {
    redirect("/login/student");
  }
  return { classId: session.classId, username: session.username };
}

export async function toggleLessonComplete(
  lessonId: string,
  courseSlug: string,
  completed: boolean
): Promise<void> {
  const { classId, username } = await requireStudent();
  if (completed) {
    await markLessonIncomplete(classId, username, lessonId);
  } else {
    await markLessonComplete(classId, username, lessonId);
  }
  revalidatePath(`/courses/${courseSlug}/lesson/${lessonId}`);
  revalidatePath(`/courses/${courseSlug}`);
}
