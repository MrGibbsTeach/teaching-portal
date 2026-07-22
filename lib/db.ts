import "server-only";
import type { ClassConfig } from "./auth-types";

const KV_KEY = "mg_classes";
const _mem: ClassConfig[] = [];

function kvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function kvGet<T>(key: string): Promise<T | null> {
  const kv = kvConfig();
  if (!kv) {
    return key === KV_KEY ? (_mem as unknown as T) : null;
  }
  try {
    const res = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
      cache: "no-store",
    });
    const json = (await res.json()) as { result: string | null };
    if (json.result == null) return null;
    return JSON.parse(json.result) as T;
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const kv = kvConfig();
  if (!kv) {
    if (key === KV_KEY) _mem.splice(0, _mem.length, ...(value as ClassConfig[]));
    return;
  }
  try {
    await fetch(`${kv.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kv.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["SET", key, JSON.stringify(value)]]),
      cache: "no-store",
    });
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
