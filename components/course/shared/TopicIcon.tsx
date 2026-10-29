import type { LucideIcon } from "lucide-react";

/**
 * Per-skin topic icon (redesign-plan.md §2.2 / "skins to courses"): Arcade
 * (Foundations) renders a domed button cap in a recessed socket; Portfolio
 * (General) and Study (ATAR) render the same icon flat on a square tile. The
 * markup always includes the arcade cap wrapper — the `.theme-foundations`
 * selector in globals.css is what makes it visible; other tiers just show the
 * flat `.skin-topic-icon` square underneath it via CSS, no JS branching needed.
 */
export function TopicIcon({ icon: Icon, size = "default" }: { icon: LucideIcon; size?: "default" | "lg" }) {
  return (
    <span className={`skin-topic-icon shrink-0 ${size === "lg" ? "skin-topic-icon-lg" : ""}`} aria-hidden>
      <span className="skin-topic-icon-cap flex h-full w-full items-center justify-center">
        <Icon className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} strokeWidth={2.25} />
      </span>
    </span>
  );
}
