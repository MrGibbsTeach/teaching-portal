import {
  BarChart3,
  Code2,
  Globe2,
  LayoutGrid,
  Lock,
  Network,
  Palette,
  PenTool,
  Rows3,
  Shield,
  Sparkles,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

/**
 * Best-effort topic -> icon mapping by keyword, for the Arcade/Portfolio/Study
 * topic icon (redesign-plan.md). There's no per-topic icon field in the
 * content model, so this reads the topic's own title rather than inventing a
 * new content field for a cosmetic. Falls back to a generic book icon.
 */
const KEYWORD_ICONS: [RegExp, LucideIcon][] = [
  [/project|management|plan|gantt|schedule/i, BarChart3],
  [/design|concept|ui|ux|layout|visual/i, Palette],
  [/impact|society|ethic|global|environment/i, Globe2],
  [/security|threat|phishing|privacy|safety/i, Shield],
  [/network|internet|protocol|packet/i, Network],
  [/code|program|script|algorithm|develop/i, Code2],
  [/data|database|table|spreadsheet/i, Rows3],
  [/draw|sketch|wireframe|prototype/i, PenTool],
  [/password|login|auth|access/i, Lock],
  [/grid|dashboard|interface/i, LayoutGrid],
  [/creative|innovat|idea/i, Sparkles],
];

export function iconForTopic(title: string): LucideIcon {
  for (const [pattern, icon] of KEYWORD_ICONS) {
    if (pattern.test(title)) return icon;
  }
  return BookOpen;
}
