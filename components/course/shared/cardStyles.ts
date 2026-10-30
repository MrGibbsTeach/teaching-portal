import type { CardTone } from "@/lib/content/types";

/** Tone → classes. Light backgrounds, readable contrast; dark-mode safe. */
export const TONE: Record<CardTone, { box: string; chip: string; dot: string }> = {
  green: { box: "border-emerald-300/70 bg-emerald-50 dark:bg-emerald-950/30", chip: "bg-emerald-600 text-white", dot: "bg-emerald-500" },
  red: { box: "border-rose-300/70 bg-rose-50 dark:bg-rose-950/30", chip: "bg-rose-600 text-white", dot: "bg-rose-500" },
  blue: { box: "border-sky-300/70 bg-sky-50 dark:bg-sky-950/30", chip: "bg-sky-600 text-white", dot: "bg-sky-500" },
  amber: { box: "border-amber-300/70 bg-amber-50 dark:bg-amber-950/30", chip: "bg-amber-500 text-white", dot: "bg-amber-500" },
  purple: { box: "border-violet-300/70 bg-violet-50 dark:bg-violet-950/30", chip: "bg-violet-600 text-white", dot: "bg-violet-500" },
  slate: { box: "border-slate-300/70 bg-slate-50 dark:bg-slate-900/40", chip: "bg-slate-600 text-white", dot: "bg-slate-500" },
};
