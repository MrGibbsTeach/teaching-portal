// Rewrites the auto-generated Year 11 "Explain X in your own words / Apply Y to a practical situation" goals
// into goals built from each lesson's own key terms. Idempotent: only touches goal lists in the old pattern.
import fs from "node:fs";
const FILE = "lib/content/data/year-11-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const short = (t) => t.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
let n = 0;
for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) {
  const li = l.blocks.findIndex((b, i) => i < 6 && b.type === "list" && b.items.some((x) => /in your own words/.test(x)));
  if (li < 0) continue;
  const kt = l.blocks.find((b) => b.type === "keyTerms");
  let names = kt && kt.items.length >= 2 ? kt.items.slice(0, 3).map((x) => short(x.term)) : [];
  if (names.length < 2) {
    // Fall back to the terms named in the old goals ("Explain X ...", "Apply Y ...").
    names = l.blocks[li].items.map((x) => (x.match(/^(?:Explain|Apply|Identify|Describe)\s+(.+?)(?:\s+in your own words|\s+to a practical situation)\.?$/) ?? [])[1]).filter(Boolean).map(short);
  }
  if (names.length === 0) continue;
  const list = names.length === 1 ? names[0] : names.length === 2 ? `${names[0]} and ${names[1]}` : `${names[0]}, ${names[1]} and ${names[2]}`;
  l.blocks[li].items = [
    `Explain ${list} in your own words.`,
    "Use these ideas to solve the problem in the ticket at the top of this lesson.",
    "Check your understanding with the quick questions and the assessment practice.",
  ];
  n++;
}
fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log("goal lists rewritten:", n);
