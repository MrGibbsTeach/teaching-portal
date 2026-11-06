import type { Badge } from "@/lib/logic/rewards";
import { cn } from "@/lib/utils";

/**
 * One row of milestone badges. Presentation only: it is handed what was earned
 * and what it took, and renders exactly that. No motion, no sound, no popup.
 * Used on the student class home (device-local, never shown to teachers).
 */
export function BadgeRow({
  badges,
  className,
}: {
  badges: readonly Badge[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Milestones">
      {badges.map((badge) => (
        <li key={badge.id}>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
              badge.earned
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-dashed border-border text-muted-foreground",
            )}
          >
            <span aria-hidden="true" className="text-[0.7rem] leading-none">
              {badge.earned ? "✓" : "○"}
            </span>
            {badge.name}
            <span className="sr-only">
              {badge.earned ? "earned" : `not yet, ${badge.hint}`}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
