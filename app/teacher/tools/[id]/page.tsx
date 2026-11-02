import Link from "next/link";
import { notFound } from "next/navigation";
import { getTool } from "@/lib/interactives";
import { HtmlInteractive } from "@/components/course/shared/HtmlInteractive";

export default async function TeacherToolPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tier?: string }>;
}) {
  const { id } = await params;
  const { tier: t } = await searchParams;
  const tool = getTool(id);
  if (!tool) notFound();
  const tier = t === "atar" ? "atar" : "general";
  const link = (v: string, label: string) => (
    <Link
      href={`/teacher/tools/${id}?tier=${v}`}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tier === v ? "bg-primary text-primary-foreground" : "border hover:bg-accent"}`}
    >
      {label}
    </Link>
  );
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/teacher/tools" className="text-sm text-muted-foreground hover:underline">
        ← Interactive tools
      </Link>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show as:</span>
        {link("general", "General")}
        {link("atar", "ATAR")}
      </div>
      <HtmlInteractive key={tier} title={tool.title} src={tool.src} tier={tier} instruction={tool.blurb} minHeight={tool.minHeight} />
    </div>
  );
}
