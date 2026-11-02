// Places Troubleshooter (public/interactives/troubleshooter.html) in the troubleshooting lessons.
// Run: node scripts/add-troubleshooter.mjs   Safe to re-run: it replaces its own blocks.
// Foundations is not placed: the tool assumes students can read command output and technical wording.
import fs from "node:fs";

const SRC = "/interactives/troubleshooter.html";
const GENERAL_NOTE =
  "You are the technician. Pick a problem, then test one thing at a time to find the hidden fault. Start with the cheapest and quickest checks. You are marked on whether your order of steps is logical, not just on whether you fixed it.";
const ATAR_NOTE =
  "Diagnose a hidden fault systematically. Isolate the problem, test one variable at a time, and avoid replacing parts before cheaper checks are done. Your order of steps is assessed, then write up the cause and a prevention measure.";
const PLACEMENTS = [
  { file: "year-11-applied-it-general", lesson: "troubleshooting-hardware-and-software", before: { type: "heading", text: "Assessment practice" }, tier: "general", instruction: GENERAL_NOTE },
  { file: "year-11-applied-it-general", lesson: "software-troubleshooting", before: { type: "heading", text: "Assessment practice" }, tier: "general", instruction: GENERAL_NOTE },
  { file: "year-11-applied-it-general", lesson: "connecting-and-troubleshooting-networks", before: { type: "heading", text: "Assessment practice" }, tier: "general", instruction: GENERAL_NOTE },
  { file: "year-12-applied-it-general", lesson: "hardware-5-maintenance-and-troubleshooting", before: { type: "heading", text: "Assessment practice" }, tier: "general", instruction: GENERAL_NOTE },
  { file: "year-11-applied-it-atar", lesson: "hardware-5-compatibility-troubleshooting", index: 7, tier: "atar", instruction: ATAR_NOTE },
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
    l.blocks.splice(at, 0, { type: "htmlInteractive", title: "Troubleshooter: find the hidden fault", src: SRC, tier: p.tier, instruction: p.instruction, minHeight: 900 });
    placed = true;
  }
  if (!placed) throw new Error(`${p.lesson}: lesson not found`);
  fs.writeFileSync(path, JSON.stringify(course, null, 2) + trailing);
  console.log(`Placed in ${p.file}/${p.lesson}`);
}
