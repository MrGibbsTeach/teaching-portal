import "server-only";
import type { ClassConfig } from "./auth-types";

const KV_KEY = "mg_classes";

// In-memory fallback when KV not configured (local dev only — not shared between requests in prod)
const _mem: ClassConfig[] = [];

async function kvGet<T>(key: string): Promise<T | null> {
  if (!process.env.KV_REST_API_URL) {
    if (key === KV_KEY) return _mem as unknown as T;
    return null;
  }
  try {
    const { kv } = await import("@vercel/kv");
    return await kv.get<T>(key);
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (!process.env.KV_REST_API_URL) {
    if (key === KV_KEY) {
      _mem.splice(0, _mem.length, ...(value as ClassConfig[]));
    }
    return;
  }
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set(key, value);
  } catch (e) {
    console.error("KV write failed:", e);
  }
}

export async function getClasses(): Promise<ClassConfig[]> {
  return (await kvGet<ClassConfig[]>(KV_KEY)) ?? [];
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
  await kvSet(KV_KEY, all);
}

export async function deleteClass(id: string): Promise<void> {
  const all = await getClasses();
  await kvSet(KV_KEY, all.filter((c) => c.id !== id));
}
