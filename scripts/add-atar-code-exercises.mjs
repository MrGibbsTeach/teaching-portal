// Adds graded HTML/CSS exercises to the Y11 ATAR web-authoring lesson, right after the
// two static "Try it" previews. Idempotent (skips exercises whose title already exists).
import { readFileSync, writeFileSync } from "node:fs";

const file = "lib/content/data/year-11-applied-it-atar.json";
const LESSON = "application-skills-5-web-authoring-online-collaboration";

const EXERCISES = [
  {
    type: "codeExercise",
    skillId: "application-skills-9",
    title: "Practice: build and style a page",
    brief:
      "Add a second paragraph, make the heading pink (#be185d), and add an unordered list with three dot points. Press “Check my work” to see if you have it.",
    starterHtml: `<!DOCTYPE html>
<html>
<head>
  <title>My First Webpage</title>
</head>
<body>
  <h1>My First Webpage</h1>
  <p>HTML defines the <strong>structure</strong>.</p>
</body>
</html>`,
    starterCss: `body {
  font-family: sans-serif;
  padding: 20px;
}
h1 {
  color: #3730a3;
}`,
    tests: [
      { type: "count", selector: "p", min: 2, description: "The page has at least two paragraphs (<p>)" },
      { type: "style", selector: "h1", property: "color", value: "#be185d", description: "The heading (h1) colour is #be185d" },
      { type: "exists", selector: "ul", description: "The page has an unordered list (<ul>)" },
      { type: "count", selector: "ul li", min: 3, description: "The list has three items (<li>)" },
    ],
  },
  {
    type: "codeExercise",
    skillId: "application-skills-9",
    title: "Practice: style the card",
    brief:
      "Change the card's border colour to #6366f1, make its corners rounder with a border-radius of 20px, and set the tag's background to #fef3c7 and its text colour to #92400e.",
    starterHtml: `<!DOCTYPE html>
<html>
<head>
  <title>Card</title>
</head>
<body>
  <div class="card">
    <span class="tag">Module 9</span>
    <h2>Application Skills</h2>
    <p>Edit the CSS to restyle this card.</p>
  </div>
</body>
</html>`,
    starterCss: `body { font-family: sans-serif; padding: 20px; background: #f9fafb; }
.card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  max-width: 320px;
}
.tag {
  display: inline-block;
  background: #ede9fe;
  color: #5b21b6;
  padding: 3px 10px;
  border-radius: 999px;
}`,
    tests: [
      { type: "style", selector: ".card", property: "border-top-color", value: "#6366f1", description: "The card border colour is #6366f1" },
      { type: "style", selector: ".card", property: "border-top-left-radius", value: "20px", description: "The card border-radius is 20px" },
      { type: "style", selector: ".tag", property: "background-color", value: "#fef3c7", description: "The tag background is #fef3c7" },
      { type: "style", selector: ".tag", property: "color", value: "#92400e", description: "The tag text colour is #92400e" },
    ],
  },
];

{
  const raw = readFileSync(file, "utf8");
  const indent = raw.startsWith('{\n "') ? 1 : 2;
  const data = JSON.parse(raw);
  let added = 0;
  for (const u of data.units) for (const t of u.topics) for (const l of t.lessons) {
    if (l.id !== LESSON) continue;
    const lastPreview = l.blocks.map((b) => b.type).lastIndexOf("codePreview");
    let at = lastPreview === -1 ? l.blocks.length : lastPreview + 1;
    for (const ex of EXERCISES) {
      if (l.blocks.some((b) => b.type === "codeExercise" && b.title === ex.title)) continue;
      l.blocks.splice(at++, 0, ex);
      added++;
    }
  }
  writeFileSync(file, JSON.stringify(data, null, indent));
  console.log(`Added ${added} exercise(s).`);
}
