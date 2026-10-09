import { getSession } from "@/lib/session";
import { getClass, getClasses, getStudentProgress } from "@/lib/db";
import { getCourseContent } from "@/lib/content";
import { buildExportRows, exportFilename, toCsv } from "@/lib/logic/export";
import type { ClassConfig } from "@/lib/auth-types";

export const dynamic = "force-dynamic";

/**
 * Teacher-only CSV backup of class rosters and lesson progress.
 *
 * `?classId=` exports one class; with no parameter it exports every class. The
 * point is that progress lives only in Redis — if that database is archived,
 * wiped or lost, this file is the only way back.
 *
 * The proxy does not guard /api, so the session is checked here (the same
 * reason /api/live checks its own).
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    return new Response("Unauthorised", { status: 401 });
  }

  const classId = new URL(request.url).searchParams.get("classId");

  let classes: ClassConfig[];
  if (classId) {
    const one = await getClass(classId);
    if (!one) return new Response("No such class", { status: 404 });
    classes = [one];
  } else {
    classes = await getClasses();
  }

  // Read every student's progress up front; buildExportRows stays pure.
  const progress = new Map<string, string[]>();
  await Promise.all(
    classes.flatMap((cls) =>
      cls.students.map(async (student) => {
        progress.set(
          `${cls.id}:${student.username}`,
          await getStudentProgress(cls.id, student.username)
        );
      })
    )
  );

  const rows = buildExportRows(
    classes,
    getCourseContent,
    (cid, username) => progress.get(`${cid}:${username}`) ?? []
  );

  const filename = exportFilename(new Date(), classId ? classes[0].courseSlug : undefined);

  // A BOM so Excel on Windows reads the UTF-8 names correctly.
  return new Response("\uFEFF" + toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
