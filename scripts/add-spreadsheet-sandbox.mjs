// Places the Spreadsheet Sandbox (public/interactives/spreadsheet-sandbox.html) in the spreadsheet lessons.
// Run: node scripts/add-spreadsheet-sandbox.mjs   Safe to re-run: it replaces its own blocks.
// Y12 ATAR has no spreadsheet lesson in its course data, so it is not placed there.
import fs from "node:fs";

const SRC = "/interactives/spreadsheet-sandbox.html";
const PLACEMENTS = [
  {
    file: "year-11-applied-it-general",
    lesson: "spreadsheet-features",
    before: { type: "heading", text: "Assessment practice" },
    tier: "general",
    instruction:
      "A working sheet for a Bunbury cafe. Build formulas, use SUM, AVERAGE and IF, then sort and filter. Each step checks your work.",
  },
  {
    file: "year-12-applied-it-general",
    lesson: "application-skills-u3-7-sort-filters",
    before: { type: "heading", text: "Assessment practice" },
    tier: "general",
    instruction:
      "A working sheet for a Bunbury cafe. Build the formulas, then sort it and filter it, and see what each one does to the rows and the totals.",
  },
  {
    file: "year-11-applied-it-atar",
    lesson: "application-skills-2-spreadsheets",
    index: 8,
    tier: "atar",
    instruction:
      "A working sheet for a Bunbury cafe. Build formulas with SUM, AVERAGE, IF and COUNTIF, sort and filter, then answer exam-style questions and mark yourself.",
  },
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
      at = l.blocks.findIndex((b) => b.type === p.before.type && b.text === p.before.text);
      if (at < 0) throw new Error(`${p.lesson}: anchor not found`);
    }
    l.blocks.splice(at, 0, { type: "htmlInteractive", title: "Spreadsheet sandbox: formulas, sort and filter", src: SRC, tier: p.tier, instruction: p.instruction, minHeight: 760 });
    placed = true;
  }
  if (!placed) throw new Error(`${p.lesson}: lesson not found`);
  fs.writeFileSync(path, JSON.stringify(course, null, 2) + trailing);
  console.log(`Placed in ${p.file}/${p.lesson}`);
}
