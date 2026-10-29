import type { CourseTier } from "@/lib/courses";
import { TierTheme } from "@/components/course/shared/TierTheme";
import { FoundationsThemeRoot } from "@/components/course/foundations/FoundationsThemeRoot";
import { atkinson } from "@/components/course/foundations/font";

/**
 * Picks the right theme wrapper for a tier. TierTheme deliberately skips
 * "foundations" (it manages its own class + dyslexia-friendly font via
 * FoundationsThemeRoot) - every page outside the old session-based Foundations
 * views needs to make that choice itself, so it lives here once rather than
 * being re-decided at each new call site (the no-login code-track pages, for
 * one, render every tier through the same page and were missing this).
 */
export function CourseTierTheme({ tier, children }: { tier: CourseTier; children: React.ReactNode }) {
  if (tier === "foundations") {
    return <FoundationsThemeRoot fontVariable={atkinson.variable}>{children}</FoundationsThemeRoot>;
  }
  return <TierTheme tier={tier}>{children}</TierTheme>;
}
