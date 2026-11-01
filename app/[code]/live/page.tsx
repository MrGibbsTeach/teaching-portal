import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { LiveStudent } from "@/components/live/LiveStudent";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";

export const dynamic = "force-dynamic";

export default async function ClassCodeLive({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();

  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();
  const course = getCourseBySlug(cls.courseSlug);

  return (
    <CourseTierTheme tier={course?.tier ?? "general"}>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href={`/${normalized}`} className="text-sm text-muted-foreground hover:text-primary">
          ← {cls.name}
        </Link>
        <h1 className="mt-3 mb-6 font-heading text-2xl font-semibold tracking-tight">Live session</h1>
        <LiveStudent courseHref={`/${normalized}`} code={normalized} />
      </div>
    </CourseTierTheme>
  );
}
