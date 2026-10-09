import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Daily keep-alive, called by the Vercel cron in `vercel.json`.
 *
 * Upstash archives a free database after a long enough quiet spell, and the
 * site is quiet for the whole of every school holiday. Without this, the first
 * student login of a new term fails.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` when that env var is set.
 * The check is enforced whenever the secret exists, so setting it closes the
 * route to everyone else; without it the route still works (it leaks nothing
 * beyond whether the database is reachable), so the cron is useful before the
 * secret is configured.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const result = await pingDatabase();

  if (!result.configured) {
    return NextResponse.json(
      { ok: false, error: "no database configured in this environment" },
      { status: 503 }
    );
  }
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
}
