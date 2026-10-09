"use client";

import { useEffect } from "react";
import type { CourseTier } from "@/lib/courses";

/**
 * Toggles a `theme-{tier}` class on <html> while mounted, tinting the accent
 * tokens defined in app/globals.css for that course tier. Unlike Foundations'
 * FoundationsThemeRoot, this never touches type or size — only colour, so it
 * reads as "one site, five tiers" rather than five different products.
 */
export function TierTheme({
  tier,
  children,
}: {
  tier: CourseTier;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (tier === "foundations") return; // Foundations manages its own theme class.
    const cls = `theme-${tier}`;
    document.documentElement.classList.add(cls);
    return () => {
      document.documentElement.classList.remove(cls);
    };
  }, [tier]);

  return <>{children}</>;
}
