import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { toolsForTier } from "@/lib/interactives";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { ToolsGrid } from "@/components/tools/ToolsGrid";

export const dynamic = "force-dynamic";

export default async function ClassToolsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();
  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();
  const course = getCourseBySlug(cls.courseSlug);
  const tier = course?.tier ?? "general";

  return (
    <CourseTierTheme tier={tier}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href={`/${normalized}`} className="text-sm text-muted-foreground hover:text-primary">
          ← {cls.name}
        </Link>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight">Interactive tools</h1>
        <p className="mt-2 text-muted-foreground">
          Practise any time, without finding the lesson first. Your work stays in this browser.
        </p>
        <ToolsGrid tools={toolsForTier(tier)} hrefFor={(t) => `/${normalized}/tools/${t.id}`} />
      </div>
    </CourseTierTheme>
  );
}
