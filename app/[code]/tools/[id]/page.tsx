import Link from "next/link";
import { notFound } from "next/navigation";
import { isReservedCode, normalizeClassCode } from "@/lib/logic/class-code";
import { getClassByCode } from "@/lib/db";
import { getCourseBySlug } from "@/lib/courses";
import { getTool, pageTier } from "@/lib/interactives";
import { CourseTierTheme } from "@/components/course/shared/CourseTierTheme";
import { HtmlInteractive } from "@/components/course/shared/HtmlInteractive";

export const dynamic = "force-dynamic";

export default async function ClassToolPage({ params }: { params: Promise<{ code: string; id: string }> }) {
  const { code, id } = await params;
  const normalized = normalizeClassCode(code);
  if (isReservedCode(normalized)) notFound();
  const cls = await getClassByCode(normalized);
  if (!cls || cls.authMode !== "code") notFound();
  const tool = getTool(id);
  const course = getCourseBySlug(cls.courseSlug);
  const tier = course?.tier ?? "general";
  if (!tool || !tool.tiers.includes(tier)) notFound();

  return (
    <CourseTierTheme tier={tier}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href={`/${normalized}/tools`} className="text-sm text-muted-foreground hover:text-primary">
          ← Interactive tools
        </Link>
        <HtmlInteractive title={tool.title} src={tool.src} tier={pageTier(tier)} instruction={tool.blurb} minHeight={tool.minHeight} />
      </div>
    </CourseTierTheme>
  );
}
