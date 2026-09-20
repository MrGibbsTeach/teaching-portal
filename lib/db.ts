import "server-only";
import { Redis } from "@upstash/redis";
import type { ClassConfig } from "./auth-types";
import { foundationsY12BareTopicIds } from "./content";
import { LEGACY_FOUNDATIONS_SLUG, legacyFoundationsTarget } from "./logic/foundations-migration";

const KV_KEY = "mg_classes";
const _mem: ClassConfig[] = [];

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!_redis) _redis = new Redis({ url, token });
  return _redis;
}

export async function getClasses(): Promise<ClassConfig[]> {
  const redis = getRedis();
  if (!redis) return [..._mem];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (await redis.get<any[]>(KV_KEY)) ?? [];
    // Migrate records that were saved with the old `unitIds` field name
    return raw.map((c) => {
      const topicIds: string[] = c.topicIds ?? c.unitIds ?? [];
      // Foundations was split into Year 11 / Year 12 courses; re-point old classes.
      const courseSlug =
        c.courseSlug === LEGACY_FOUNDATIONS_SLUG
          ? legacyFoundationsTarget(topicIds, foundationsY12BareTopicIds)
          : c.courseSlug;
      return { ...c, courseSlug, topicIds };
    }) as ClassConfig[];
  } catch (e) {
    console.error("KV read failed:", e);
    return [];
  }
}

export async function getClass(id: string): Promise<ClassConfig | null> {
  const all = await getClasses();
  return all.find((c) => c.id === id) ?? null;
}

export async function saveClass(cls: ClassConfig): Promise<void> {
  const all = await getClasses();
  const idx = all.findIndex((c) => c.id === cls.id);
  if (idx >= 0) all[idx] = cls;
  else all.push(cls);

  const redis = getRedis();
  if (!redis) {
    _mem.splice(0, _mem.length, ...all);
    return;
  }
  try {
    await redis.set(KV_KEY, all);
  } catch (e) {
    console.error("KV write failed:", e);
  }
}

export async function deleteClass(id: string): Promise<void> {
  const all = (await getClasses()).filter((c) => c.id !== id);
  const redis = getRedis();
  if (!redis) {
    _mem.splice(0, _mem.length, ...all);
    return;
  }
  try {
    await redis.set(KV_KEY, all);
  } catch (e) {
    console.error("KV write failed:", e);
  }
}

// ── Progress tracking ─────────────────────────────────────────────────────────

function progressKey(classId: string, username: string) {
  return `mg_progress:${classId}:${username}`;
}

export async function getStudentProgress(
  classId: string,
  username: string
): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    return (await redis.get<string[]>(progressKey(classId, username))) ?? [];
  } catch (e) {
    console.error("KV progress read failed:", e);
    return [];
  }
}

export async function markLessonComplete(
  classId: string,
  username: string,
  lessonId: string
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const key = progressKey(classId, username);
    const current = (await redis.get<string[]>(key)) ?? [];
    if (!current.includes(lessonId)) {
      await redis.set(key, [...current, lessonId]);
    }
  } catch (e) {
    console.error("KV progress write failed:", e);
  }
}

export async function markLessonIncomplete(
  classId: string,
  username: string,
  lessonId: string
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const key = progressKey(classId, username);
    const current = (await redis.get<string[]>(key)) ?? [];
    await redis.set(key, current.filter((id) => id !== lessonId));
  } catch (e) {
    console.error("KV progress write failed:", e);
  }
}

// ── Skill mastery (0..1 per skill; used by the mastery tree and practice results) ──

function masteryKey(classId: string, username: string) {
  return `mg_mastery:${classId}:${username}`;
}

export async function getStudentMastery(
  classId: string,
  username: string
): Promise<Record<string, number>> {
  const redis = getRedis();
  if (!redis) return {};
  try {
    return (await redis.hgetall<Record<string, number>>(masteryKey(classId, username))) ?? {};
  } catch (e) {
    console.error("KV mastery read failed:", e);
    return {};
  }
}

/** Records a score for a skill. Keeps the best score so a bad retry never lowers mastery. */
export async function recordSkillScore(
  classId: string,
  username: string,
  skillId: string,
  score: number
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const clamped = Math.min(1, Math.max(0, score));
    const key = masteryKey(classId, username);
    const current = Number((await redis.hget<number>(key, skillId)) ?? 0);
    if (clamped > current) await redis.hset(key, { [skillId]: clamped });
  } catch (e) {
    console.error("KV mastery write failed:", e);
  }
}
