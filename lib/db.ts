import "server-only";
import type { ClassConfig } from "./auth-types";

const KV_KEY = "mg_classes";
const _mem: ClassConfig[] = [];

function getRedis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  // Lazy import so local dev without KV vars doesn't crash at module load time
  const { Redis } = require("@upstash/redis");
  return new Redis({ url, token }) as import("@upstash/redis").Redis;
}

export async function getClasses(): Promise<ClassConfig[]> {
  const redis = getRedis();
  if (!redis) return [..._mem];
  try {
    return (await redis.get<ClassConfig[]>(KV_KEY)) ?? [];
  } catch {
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
