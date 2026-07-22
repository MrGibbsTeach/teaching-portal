"use server";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { getClasses } from "@/lib/db";

export async function teacherLogin(formData: FormData) {
  const password = formData.get("password") as string;
  const expected = process.env.TEACHER_PASSWORD;

  if (!expected || password.trim() !== expected.trim()) {
    redirect("/login/teacher?error=1");
  }

  await createSession({ role: "teacher" });
  redirect("/teacher");
}

export async function studentLogin(formData: FormData) {
  const classId = formData.get("classId") as string;
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const passcode = (formData.get("passcode") as string)?.trim();

  const classes = await getClasses();
  const cls = classes.find((c) => c.id === classId);
  if (!cls) redirect("/login/student?error=class");

  const student = cls!.students.find(
    (s) => s.username.toLowerCase() === username && s.passcode === passcode
  );
  if (!student) redirect(`/login/student?classId=${classId}&error=creds`);

  await createSession({
    role: "student",
    classId: cls!.id,
    username: student!.username,
    displayName: student!.displayName,
    courseSlug: cls!.courseSlug,
  });
  redirect("/courses/" + cls!.courseSlug);
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
