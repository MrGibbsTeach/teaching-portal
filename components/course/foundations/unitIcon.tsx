import {
  Sheet,
  Users,
  Newspaper,
  Camera,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const KEYWORD_ICONS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["spreadsheet"], icon: Sheet },
  { keywords: ["social", "collaboration"], icon: Users },
  { keywords: ["desktop publishing", "publishing"], icon: Newspaper },
  { keywords: ["photography", "photo"], icon: Camera },
];

export function unitIcon(title: string): LucideIcon {
  const lower = title.toLowerCase();
  for (const entry of KEYWORD_ICONS) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.icon;
  }
  return BookOpen;
}
