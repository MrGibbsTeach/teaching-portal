// Reworks Y12 AIT General Unit 3 "Project Management Considerations" as a hands-on planning session
// built around one client brief (South West Digital Wellbeing Alliance, a 60-second awareness video).
// Students pick an angle, sort the four considerations, read a Gantt chart, then build their own
// considerations table, Gantt chart and client brief, show the teacher and upload to Teams.
// No assessment task names, numbers or dates live in the lesson (they change every year; see the term planner).
// Safe to re-run: it replaces its own blocks by title and leaves the rest of the lesson alone.
import fs from "node:fs";
import { h, mcq, sorter, fig, reducedMotion } from "./lib/lesson-kit.mjs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const unit = course.units.find((u) => u.id === "unit3");
const lesson = unit.topics.find((t) => t.id === "project-management-u3").lessons[0];
if (lesson.id !== "project-management-u3-1-project-management-considerations") throw new Error("wrong lesson");

const ID = lesson.id;
const ticket = {
  type: "callout", variant: "ticket", heading: "Ticket from the South West Digital Wellbeing Alliance",
  text: "We want a 60-second video that helps teenagers in the South West build healthy and safe technology habits. It will go on our website, YouTube and social media. You have four weeks to plan it. Start by working out how scope, time, resources and our brief will shape your plan.",
};
const goals = {
  type: "infoCards", title: "By the end of this lesson you can", columns: 1,
  cards: [
    "Define each of the four project management considerations using syllabus wording.",
    "Outline how each consideration applies to your own video.",
    "Read a Gantt chart and spot what a plan is missing.",
    "Build a Gantt chart and write a client brief with all five parts.",
  ].map((t, i) => ({ icon: ["🎯", "🧭", "🔍", "🛠️"][i], heading: t, text: "", tone: "blue" })),
};
const sort4 = sorter("Which consideration is it?", "Each item belongs to one consideration. Tap the right one.",
  ["Scope", "Time", "Resources", "Client brief"], [
    { text: "The video will use filmed scenes and a voiceover, with no presenter on screen.", category: 0, why: "Scope is what the project will and will not produce." },
    { text: "You decide to make one 60-second video, not a second vertical version as well.", category: 0, why: "Leaving something out is a scope decision." },
    { text: "Filming cannot start until the plan is checked, and editing must finish before the deadline.", category: 1, why: "Time covers the schedule and the deadlines." },
    { text: "Rain cancels the planned filming day, so you have one day less.", category: 1, why: "Less time available is a time change." },
    { text: "You have one phone, no tripod and a borrowed microphone.", category: 2, why: "Resources are the people, equipment and software you can use." },
    { text: "The Alliance wants its logo on the end card and a call to action to its website.", category: 3, why: "The client brief is what the client asked for." },
  ]);

const ganttSvg = `<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif"><style>.g-t{font-size:12.5px;font-weight:700;fill:#0f172a}.g-h{font-size:11px;fill:#475569;text-anchor:middle}.g-c{fill:#f1f5f9}.g-1{fill:#0f766e}.g-2{fill:#4f46e5}.g-3{fill:#b45309}${reducedMotion}</style>
<text x="10" y="22" class="g-t">Task</text>
${[1, 2, 3, 4, 5, 6, 7, 8].map((w, i) => `<text x="${200 + i * 58 + 29}" y="22" class="g-h">Week ${w}</text>`).join("")}
${[["Pre-production", 1, 4, "g-1"], ["Filming", 5, 5, "g-2"], ["Editing", 6, 8, "g-3"]].map(([n, a, b, c], r) => {
  const y = 40 + r * 40;
  return `<text x="10" y="${y + 19}" class="g-t">${n}</text>${[1, 2, 3, 4, 5, 6, 7, 8].map((w) => `<rect x="${200 + (w - 1) * 58 + 2}" y="${y}" width="54" height="28" rx="5" class="${w >= a && w <= b ? c : "g-c"}"/>`).join("")}`;
}).join("")}
<text x="10" y="170" class="g-t">Review</text><text x="204" y="170" class="g-h" style="text-anchor:start">(nothing here)</text></svg>`;

const ganttFig = fig("A student's Gantt chart for a 60-second video", "A Gantt chart over eight weeks with pre-production in weeks 1 to 4, filming in week 5 and editing in weeks 6 to 8. The review row is empty.", ganttSvg, "Every phase is a row, every task has a start and an end. One required phase is missing.");

const gantt = mcq(`${ID}-gantt`, "Look at the student's Gantt chart. What is missing?", ["A review phase", "A budget", "A title card"], 0,
  "A Gantt chart for a video covers all four phases: pre-production, production, post-production and review. This one stops after editing, so there is no time to check the finished video against the brief.");
const timeMark = mcq(`${ID}-time`, "Which answer earns the mark for Time on a 60-second video project?",
  ["Time is how long a project takes.", "Planning ends in four weeks, filming takes one day and editing finishes before the deadline.", "Time is important."], 1,
  "It links time to this video with real details. A definition on its own does not say anything about the project, so it earns no mark.");
const briefMark = mcq(`${ID}-brief`, "A student's client brief states the purpose, the topic angle, the target audience and the requirements. Which part is missing?",
  ["The key message", "The budget", "The film title"], 0,
  "A full client brief has five parts: purpose, topic angle, target audience, key message and requirements given (length, platforms, branding).");

const tApply = {
  type: "task", title: "Apply the four considerations to your video", software: "Any word processor",
  intro: "Choose your topic angle, then show how scope, time, resources and the client brief shape your plan.",
  steps: [
    "Choose one angle: managing screen time and work-life balance, dealing with cyberbullying, responsible use of social networking, protecting your personal information, or positive use of social media for community building.",
    "Make a table with four rows: Scope, Time, Resources and Client brief.",
    "In each row, write a detail from your own video, such as 60 seconds, your planning deadline, the phone you will film on, or the Alliance's logo and website.",
    "A definition on its own earns no mark. Check each row: could someone tell it is about your video and not any video?",
  ],
};
const tGantt = {
  type: "task", title: "Build your Gantt chart", software: "Excel, Word or by hand",
  intro: "Plan the whole project so someone else could follow it.",
  steps: [
    "Show all four phases: pre-production, production, post-production and review.",
    "Give every task a name, a duration, and a start and end date.",
    "Make the dates realistic for your deadline and for the length of the video.",
    "Save or photograph the chart so you can attach it to your plan.",
  ],
};
const tBrief = {
  type: "task", title: "Write the client brief", software: "Any word processor",
  intro: "Put the Alliance's request into your own words. All five parts are needed.",
  steps: [
    "Purpose: why does the Alliance want this video?",
    "Your topic angle, taken from the list in the first task.",
    "Target audience: who will watch it, and on what?",
    "Key message: the one idea viewers should remember.",
    "Requirements given: 60 seconds, YouTube and social media, and the Alliance's branding.",
  ],
};
const tHandIn = {
  type: "task", title: "Show your teacher, then upload", software: "Microsoft Teams",
  intro: "Your teacher checks your work in class before it goes in.",
  steps: [
    "Open your considerations table, Gantt chart and client brief on your laptop. Put your hand up when all three are ready.",
    "Your teacher looks at them with you. Work that has not been shown may not earn marks.",
    "Save the Gantt chart as a PDF or photo, and the other two as one document named with the lesson and your name.",
    "Upload both to the assignment in Microsoft Teams that your teacher gives you.",
  ],
};

// 1. Drop any earlier version of these blocks (re-run safe), then rebuild around the stable ones.
const titles = new Set([sort4.title, ganttFig.title, tApply.title, tGantt.title, tBrief.title, tHandIn.title, "Reading a Gantt chart"]);
const qids = new Set([gantt.question.id, timeMark.question.id, briefMark.question.id]);
let blocks = lesson.blocks.filter((b) => {
  if (b.type === "quizQuestion" && qids.has(b.question.id)) return false;
  if (b.title && titles.has(b.title)) return false;
  if (b.type === "heading" && titles.has(b.text)) return false;
  return true;
});
const find = (pred) => blocks.findIndex(pred);

// hook and goals
const hookAt = find((b) => b.type === "callout" && b.variant === "ticket");
blocks[hookAt] = ticket;
const goalsAt = find((b) => b.type === "infoCards" && b.title === "By the end of this lesson you can");
blocks[goalsAt] = goals;
// the old reel sorter and the old reel task are replaced
blocks = blocks.filter((b) => !(b.type === "sorter" && b.title === "Which consideration changes?"));
blocks = blocks.filter((b) => !(b.type === "task" && /Nippers Reel/.test(b.title)));

// sorter, Gantt reading and checks after the "Four considerations" figure
const figAt = find((b) => b.type === "svgFigure" && b.title === "Four considerations");
blocks.splice(figAt + 1, 0, sort4, h("Reading a Gantt chart"), ganttFig, gantt);
// branching case stays; then the checks and the build tasks go in front of the mentor tip
const tipAt = find((b) => b.type === "callout" && b.variant === "senior-wisdom");
blocks.splice(tipAt, 0, timeMark, briefMark, tApply, tGantt, tBrief, tHandIn);

lesson.blocks = blocks;
lesson.estimatedMinutes = 50;
fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log(`rebuilt ${ID}: ${blocks.length} blocks`);
