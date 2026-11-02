// Places the Design Annotation interactive (public/interactives/design-annotation.html) in four lessons.
// Run: node scripts/add-design-annotation.mjs   Safe to re-run: it replaces its own blocks.
import fs from "node:fs";

const SRC = "/interactives/design-annotation.html";
const PLACEMENTS = [
  {
    file: "year-12-applied-it-general",
    lesson: "design-concepts-6-analysing-existing-products",
    before: { type: "heading", text: "Assessment practice" },
    tier: "general",
    title: "Annotate a design: see it, build it, do it",
    instruction:
      "Work through the four tabs. See a finished annotation, read a typical question, build your own one part at a time, then annotate a new design. Elements and principles are answered together.",
  },
  {
    file: "year-11-applied-it-general",
    lesson: "analysing-and-applying-design",
    before: { type: "heading", text: "Test-ready recap" },
    tier: "general",
    title: "Annotate a design: see it, build it, do it",
    instruction:
      "Work through the four tabs. See a finished annotation, read a typical question, build your own one part at a time, then annotate a new design.",
  },
  {
    file: "year-12-applied-it-atar",
    lesson: "design-concepts-1-5-sample-exam-style-questions",
    before: { type: "heading", text: "Scenario Question" },
    tier: "atar",
    title: "Annotate a design: see it, build it, do it",
    instruction:
      "Work through the four tabs. The question tab shows ATAR wording and marks. Elements and principles are answered together, with a critical analysis of the relationship.",
  },
  {
    file: "year-11-applied-it-atar",
    lesson: "design-concepts-practice",
    index: 0,
    tier: "atar",
    title: "Annotate a design: see it, build it, do it",
    instruction:
      "Work through the four tabs. The question tab shows ATAR wording and marks. Elements and principles are answered together.",
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
    l.blocks.splice(at, 0, { type: "htmlInteractive", title: p.title, src: SRC, tier: p.tier, instruction: p.instruction, minHeight: 760 });
    placed = true;
  }
  if (!placed) throw new Error(`${p.lesson}: lesson not found`);
  fs.writeFileSync(path, JSON.stringify(course, null, 2) + trailing);
  console.log(`Placed in ${p.file}/${p.lesson}`);
}
