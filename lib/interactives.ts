import type { CourseTier } from "@/lib/courses";

/**
 * Every interactive a student or teacher can open on its own, without finding the lesson it lives in.
 * Add a row here when a new interactive page or 3D animation goes into /public.
 * `tiers` lists the course tiers that should see it; `tierParam` is passed to the page so one file
 * can switch its wording for General and ATAR (standing rule 7 in claude/project-handover.md).
 */
export interface InteractiveTool {
  id: string;
  title: string;
  blurb: string;
  /** Grouping on the tools page, usually the course topic. */
  topic: string;
  /** What the student does with it. */
  kind: "Build and justify" | "Annotate" | "Practise" | "Explore in 3D";
  src: string;
  tiers: CourseTier[];
  minHeight: number;
}

export const INTERACTIVE_TOOLS: InteractiveTool[] = [
  {
    id: "spec-the-computer",
    title: "Spec the Computer",
    blurb: "Pick real parts for a client within a budget. Compatibility rules catch bad picks, then you justify each choice.",
    topic: "Hardware",
    kind: "Build and justify",
    src: "/interactives/spec-computer.html",
    tiers: ["general", "atar"],
    minHeight: 900,
  },
  {
    id: "troubleshooter",
    title: "Troubleshooter",
    blurb: "Fix a hidden fault: no power, no display, no network or no sound. Test one thing at a time. You are scored on whether your order of steps is logical.",
    topic: "Hardware",
    kind: "Practise",
    src: "/interactives/troubleshooter.html",
    tiers: ["general", "atar"],
    minHeight: 900,
  },
  {
    id: "inside-the-computer",
    title: "Inside the Computer",
    blurb: "Tap each part of a computer to see what it does, take it apart, and test yourself on the names.",
    topic: "Hardware",
    kind: "Explore in 3D",
    src: "/animations/inside-the-computer.html",
    tiers: ["foundations", "general", "atar"],
    minHeight: 640,
  },
  {
    id: "packet-journey",
    title: "Packet Journey",
    blurb: "Follow a message split into packets across a network and watch it reassemble at the other end.",
    topic: "Networks",
    kind: "Explore in 3D",
    src: "/animations/packet-journey.html",
    tiers: ["foundations", "general", "atar"],
    minHeight: 640,
  },
  {
    id: "binary-lights",
    title: "Binary Lights",
    blurb: "Flip eight switches to build binary numbers, letters and a pixel colour.",
    topic: "Managing data",
    kind: "Explore in 3D",
    src: "/animations/binary-lights.html",
    tiers: ["foundations", "general", "atar"],
    minHeight: 640,
  },
  {
    id: "spreadsheet-sandbox",
    title: "Spreadsheet sandbox",
    blurb: "A working cafe sheet. Build formulas with SUM, AVERAGE and IF, then sort and filter. Each step checks your work.",
    topic: "Application skills",
    kind: "Practise",
    src: "/interactives/spreadsheet-sandbox.html",
    tiers: ["general", "atar"],
    minHeight: 760,
  },
  {
    id: "design-annotation",
    title: "Design annotation",
    blurb: "Annotate a design the way the course and the test want: name the feature, say how it is used, say why.",
    topic: "Design concepts",
    kind: "Annotate",
    src: "/interactives/design-annotation.html",
    tiers: ["general", "atar"],
    minHeight: 760,
  },
];

export function getTool(id: string): InteractiveTool | undefined {
  return INTERACTIVE_TOOLS.find((t) => t.id === id);
}

export function toolsForTier(tier: CourseTier): InteractiveTool[] {
  return INTERACTIVE_TOOLS.filter((t) => t.tiers.includes(tier));
}

/** The tier value the interactive pages understand. Foundations and anything else use General wording. */
export function pageTier(tier: CourseTier): "general" | "atar" | "foundations" {
  return tier === "atar" ? "atar" : tier === "foundations" ? "foundations" : "general";
}
