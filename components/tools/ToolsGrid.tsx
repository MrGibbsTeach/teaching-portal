import Link from "next/link";
import { Boxes, Cpu, Network, Table2, PenTool, Binary, type LucideIcon } from "lucide-react";
import type { InteractiveTool } from "@/lib/interactives";
import { TopicIcon } from "@/components/course/shared/TopicIcon";

const ICONS: Record<string, LucideIcon> = {
  "spec-the-computer": Cpu,
  "inside-the-computer": Boxes,
  "packet-journey": Network,
  "binary-lights": Binary,
  "spreadsheet-sandbox": Table2,
  "design-annotation": PenTool,
};

/** The list of interactive tools, grouped by topic. `hrefFor` decides where each card goes. */
export function ToolsGrid({ tools, hrefFor }: { tools: InteractiveTool[]; hrefFor: (t: InteractiveTool) => string }) {
  const topics = Array.from(new Set(tools.map((t) => t.topic)));
  if (tools.length === 0) {
    return <p className="mt-8 text-muted-foreground">No interactive tools are available for this course yet.</p>;
  }
  return (
    <div className="mt-8 space-y-10">
      {topics.map((topic) => (
        <section key={topic}>
          <h2 className="font-heading text-xl font-bold tracking-tight">{topic}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {tools
              .filter((t) => t.topic === topic)
              .map((t) => {
                const Icon = ICONS[t.id] ?? Boxes;
                return (
                  <Link
                    key={t.id}
                    href={hrefFor(t)}
                    className="flex gap-4 rounded-2xl border border-border p-5 transition-colors hover:bg-accent"
                  >
                    <TopicIcon icon={Icon} />
                    <span>
                      <span className="flex items-center gap-2">
                        <span className="font-semibold">{t.title}</span>
                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{t.kind}</span>
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{t.blurb}</span>
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
