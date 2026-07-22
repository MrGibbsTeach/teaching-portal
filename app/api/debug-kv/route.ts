import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? null;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? null;

  const info: Record<string, unknown> = {
    hasUrl: !!url,
    hasToken: !!token,
    urlPrefix: url ? url.slice(0, 30) + "..." : null,
  };

  if (!url || !token) {
    return NextResponse.json({ ...info, error: "Missing KV env vars" });
  }

  // Test 1: Redis import
  let redis: unknown = null;
  try {
    const { Redis } = await import("@upstash/redis");
    redis = new Redis({ url, token });
    info.redisImport = "ok";
  } catch (e) {
    info.redisImport = "FAILED";
    info.redisImportError = String(e);
    return NextResponse.json(info);
  }

  // Test 2: SET
  try {
    await (redis as import("@upstash/redis").Redis).set("debug-test", "hello");
    info.set = "ok";
  } catch (e) {
    info.set = "FAILED";
    info.setError = String(e);
    return NextResponse.json(info);
  }

  // Test 3: GET
  try {
    const val = await (redis as import("@upstash/redis").Redis).get("debug-test");
    info.get = val;
  } catch (e) {
    info.get = "FAILED";
    info.getError = String(e);
  }

  // Test 4: get mg_classes
  try {
    const classes = await (redis as import("@upstash/redis").Redis).get("mg_classes");
    info.mgClasses = classes === null ? "null (empty)" : `found (${JSON.stringify(classes).slice(0, 100)})`;
  } catch (e) {
    info.mgClasses = "FAILED: " + String(e);
  }

  return NextResponse.json(info);
}
