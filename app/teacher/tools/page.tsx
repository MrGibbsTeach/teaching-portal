import { INTERACTIVE_TOOLS } from "@/lib/interactives";
import { ToolsGrid } from "@/components/tools/ToolsGrid";

export default function TeacherToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Interactive tools</h1>
      <p className="mt-2 text-muted-foreground">
        Every interactive in one place, to try before class or to put on the board. Students see the same list from their class page.
      </p>
      <ToolsGrid tools={INTERACTIVE_TOOLS} hrefFor={(t) => `/teacher/tools/${t.id}`} />
    </div>
  );
}
