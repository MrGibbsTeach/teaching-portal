// Places the Gantt Planner (public/interactives/gantt-planner.html) in the time management and planning tool lessons.
// Run: node scripts/add-gantt-planner.mjs   Safe to re-run: it replaces its own blocks.
// Foundations is not placed: the tool assumes students can read a brief and link tasks.
import fs from "node:fs";

const SRC = "/interactives/gantt-planner.html";
const TITLE = "Gantt Planner: build a timeline from a client brief";
const GENERAL_NOTE =
  "Read the client brief, add tasks, set how long each takes and what it waits for, then clear every clash. Finish by explaining your choices and testing what happens if a task runs late.";
const ATAR_NOTE =
  "Build a schedule from the client brief. Sequence dependent tasks, resolve resource and availability conflicts, identify the critical path and float, then justify your contingency and a trade-off.";
const PLACEMENTS = [
  { file: "year-11-applied-it-general", lesson: "time-management-skills", before: "Assessment practice", tier: "general", instruction: GENERAL_NOTE },
  { file: "year-12-applied-it-general", lesson: "project-management-u4-2-time-management-strategies", before: "Assessment practice", tier: "general", instruction: GENERAL_NOTE },
  { file: "year-12-applied-it-general", lesson: "project-management-u3-1-project-management-considerations", before: "Assessment practice", tier: "general", instruction: GENERAL_NOTE },
  { file: "year-11-applied-it-atar", lesson: "project-management-2-planning-tools", index: 7, tier: "atar", instruction: ATAR_NOTE },
  { file: "year-12-applied-it-atar", lesson: "project-management-5-2-project-planning-tools", index: 7, tier: "atar", instruction: ATAR_NOTE },
];

for (const p of PLACEMENTS) {
  const path = `lib/content/data/${p.file}.json`;
  const raw = fs.readFileSync(path, "utf8");
  const trailing = raw.endsWith("\n") ? "\n" : "";
  const course = JSON.parse(raw);
  let placed = false;
  for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) {
    if (l.id !== p.lesson) continue;
    l.blocks = l.blocks.filter((b) => !(b.type === "htmlInteractive" && b.src === SRC));
    let at = p.index;
    if (at === undefined) {
      at = l.blocks.findIndex((b) => b.type === "heading" && b.text === p.before);
      if (at < 0) at = l.blocks.length;
    }
    l.blocks.splice(at, 0, { type: "htmlInteractive", title: TITLE, src: SRC, tier: p.tier, instruction: p.instruction, minHeight: 900 });
    placed = true;
  }
  if (!placed) throw new Error(`${p.lesson}: lesson not found`);
  fs.writeFileSync(path, JSON.stringify(course, null, 2) + trailing);
  console.log(`Placed in ${p.file}/${p.lesson}`);
}
