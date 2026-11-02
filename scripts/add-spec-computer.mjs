// Places Spec the Computer (public/interactives/spec-computer.html) in the hardware lessons.
// Run: node scripts/add-spec-computer.mjs   Safe to re-run: it replaces its own blocks.
// Foundations is not placed: the tool assumes students can read a specification.
import fs from "node:fs";

const SRC = "/interactives/spec-computer.html";
const GENERAL_NOTE =
  "Choose real parts for a client within a budget. Red checks mean parts that do not work together. Then explain each choice and review your build against the brief.";
const ATAR_NOTE =
  "Select hardware for a client brief within a budget. Derive the specification yourself, resolve compatibility faults, then justify each choice with specification figures, a rejected alternative and a trade-off.";
const PLACEMENTS = [
  { file: "year-11-applied-it-general", lesson: "cpu-and-memory", before: { type: "heading", text: "Assessment practice" }, tier: "general", instruction: GENERAL_NOTE },
  { file: "year-12-applied-it-general", lesson: "hardware-4-software-compatibility-and-hardware-purchase", before: { type: "heading", text: "Assessment practice" }, tier: "general", instruction: GENERAL_NOTE },
  { file: "year-11-applied-it-atar", lesson: "hardware-5-compatibility-troubleshooting", index: 6, tier: "atar", instruction: ATAR_NOTE },
  { file: "year-12-applied-it-atar", lesson: "hardware-2-1-components-of-a-computer", index: 10, tier: "atar", instruction: ATAR_NOTE },
  { file: "year-12-applied-it-atar", lesson: "hardware-2-3-device-considerations-for-specific-users", index: 7, tier: "atar", instruction: ATAR_NOTE },
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
    l.blocks.splice(at, 0, { type: "htmlInteractive", title: "Spec the Computer: choose parts for a client", src: SRC, tier: p.tier, instruction: p.instruction, minHeight: 900 });
    placed = true;
  }
  if (!placed) throw new Error(`${p.lesson}: lesson not found`);
  fs.writeFileSync(path, JSON.stringify(course, null, 2) + trailing);
  console.log(`Placed in ${p.file}/${p.lesson}`);
}
