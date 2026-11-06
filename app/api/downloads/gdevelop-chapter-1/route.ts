import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Login-gated download of the GDevelop Essentials chapter 1 project, so
 * students can open it in the desktop app without a GDevelop account.
 * The file lives in /private (not /public) so it is never served openly.
 * The proxy does not guard /api, so the session is checked here.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Unauthorised", { status: 401 });

  const file = path.join(process.cwd(), "private", "gdevelop", "gdevelop-chapter-1.zip");
  const data = await readFile(file);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="gdevelop-chapter-1.zip"',
      "Cache-Control": "private, no-store",
    },
  });
}
