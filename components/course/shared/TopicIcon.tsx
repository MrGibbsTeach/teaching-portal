import type { LucideIcon } from "lucide-react";

/**
 * Per-skin topic icon (redesign-plan.md §2.2 / "skins to courses"): Arcade
 * (Foundations) renders a domed button cap in a recessed socket; Portfolio
 * (General) and Study (ATAR) render the same icon flat on a square tile. The
 * markup always includes the arcade cap wrapper — the `.theme-foundations`
 * selector in globals.css is what makes it visible; other tiers just show the
 * flat `.skin-topic-icon` square underneath it via CSS, no JS branching needed.
 */
export function TopicIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="skin-topic-icon shrink-0" aria-hidden>
      <span className="skin-topic-icon-cap flex h-full w-full items-center justify-center">
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </span>
    </span>
  );
}
