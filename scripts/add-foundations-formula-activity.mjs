// AIT Foundations' "Typing Formulas" lesson (c11_6_l2) was the one lesson in the
// Spreadsheets topic with no hands-on `activity` block — its 4 sibling lessons each
// have one (match-pairs, fill-the-blank, SVG hotspot, order-the-steps). Adds a
// match-pairs activity for the 5 formula symbols this lesson already teaches (=, +,
// -, *, /), same tone and format as c11_6_l1's activity. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const file = "lib/content/data/ait-foundations.json";
const raw = readFileSync(file, "utf8");
const data = JSON.parse(raw);
const indent = raw.startsWith('{\n "') ? 1 : 2;

const activity = {
  type: "activity",
  title: "Match each symbol to what it does. 🧩",
  pairs: [
    { term: "=", definition: "Starts every formula 🏁" },
    { term: "+", definition: "Adds numbers together ➕" },
    { term: "-", definition: "Subtracts numbers ➖" },
    { term: "*", definition: "Multiplies numbers ✖️" },
    { term: "/", definition: "Divides numbers ➗" },
  ],
};

let added = 0;
for (const u of data.units) {
  for (const t of u.topics) {
    for (const l of t.lessons) {
      if (l.id !== "c11_6_l2") continue;
      if (l.blocks.some((b) => b.type === "activity")) continue;
      const at = l.blocks.findIndex((b) => b.type === "quizQuestion" && b.question.questionType === "mcq");
      l.blocks.splice(at === -1 ? l.blocks.length : at, 0, activity);
      added++;
    }
  }
}
writeFileSync(file, JSON.stringify(data, null, indent));
console.log(`Added ${added} activity block(s).`);
