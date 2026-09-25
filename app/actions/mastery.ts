"use server";
import { getSession } from "@/lib/session";
import { recordSkillScore } from "@/lib/db";

/**
 * Credits a skill score (0..1) to the signed-in student. Teachers previewing an
 * exercise are ignored rather than redirected, so practice blocks work for them too.
 */
export async function recordExerciseScore(skillId: string, score: number): Promise<void> {
  const session = await getSession();
  if (session?.role !== "student" || !session.classId || !session.username) return;
  if (!skillId || !Number.isFinite(score)) return;
  await recordSkillScore(session.classId, session.username, skillId, score);
}
