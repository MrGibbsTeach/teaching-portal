// Second batch of interactiveDiagram blocks for Year 11 General — the topics the
// audit still flags as having none after add-general-diagrams.mjs's first pass
// (design-concepts, managing-data, and three of the five working-with-others topics;
// networks already got one in the first batch). Idempotent: skips lessons that
// already have an interactiveDiagram. Every pair here is drawn directly from a table
// already in that lesson, not invented.
import { readFileSync, writeFileSync } from "node:fs";

const matcher = (title, instruction, pairs, explanation) => ({
  type: "interactiveDiagram",
  title,
  instruction,
  kind: "connect",
  config: { left: pairs.map((p) => p[0]), right: [...new Set(pairs.map((p) => p[1]))] },
  goalState: { links: pairs },
  explanation,
});

const ADD = {
  "year-11-applied-it-general": {
    "elements-of-design": matcher(
      "Match the element to its tool",
      "Tap an element of design on the left, then tap the designer's tool that uses it.",
      [
        ["Line", "Borders, dividers, arrows, underlines"],
        ["Shape", "Cards, buttons, icons, illustrations"],
        ["Space", "Padding, margins, negative space"],
        ["Colour", "Palettes, gradients, accessibility"],
        ["Tone", "Light/dark modes, greyscale test"],
      ],
      "Each element of design has its own job — and its own toolkit a designer reaches for.",
    ),
    "common-file-formats": matcher(
      "Match the format to its extension",
      "Tap a file format on the left, then tap its file extension.",
      [
        ["CSV (Comma-Separated Values)", ".csv"],
        ["JSON (JavaScript Object Notation)", ".json"],
        ["PDF (Portable Document Format)", ".pdf"],
        ["DOCX (Word Document)", ".docx"],
        ["TXT (Plain Text)", ".txt"],
      ],
      "Recognising the extension tells you what the file is for before you even open it.",
    ),
    "types-of-computer-crime": matcher(
      "Match the crime to how it works",
      "Tap a type of computer crime on the left, then tap how it actually works.",
      [
        ["Hacking / Unauthorised Access", "Exploiting software flaws or stolen passwords to enter systems without permission"],
        ["Phishing", "Fake emails or websites that mimic banks, myGov, or ATO to steal credentials"],
        ["Ransomware", "Malware encrypts all files; attacker demands crypto payment for the key"],
        ["Identity Theft", "Using stolen personal data to open accounts, obtain loans, or file false tax returns"],
      ],
      "Different cybercrimes exploit different weaknesses — technical flaws, human trust, or stolen data.",
    ),
    "software-troubleshooting": matcher(
      "Match the problem to the first fix",
      "Tap a problem on the left, then tap the first thing you should try.",
      [
        ["Application crashes on open", "Open a different file; run as administrator; check for pending updates"],
        ["Computer running very slowly", "Task Manager → sort by CPU/RAM → close non-essential processes; check storage"],
        ["Browser not loading websites", "Clear browser cache; try incognito mode; disable extensions; try a different browser"],
        ["File will not open / shows wrong icon", "Check the file extension; try opening with a different application; verify the file is not corrupt"],
      ],
      "The first fix to try depends on the symptom — that's why IDENTIFY comes before you touch anything.",
    ),
    "the-design-process": matcher(
      "Match the phase to what happens",
      "Tap a phase of the design process on the left, then tap what happens during it.",
      [
        ["Discover", "Research the problem — interview users, review existing solutions, identify pain points"],
        ["Define", "Agree on exactly what you are solving and for whom. Write the project brief."],
        ["Design", "Wireframe screens, choose tools, agree on visual direction"],
        ["Develop", "Build the product — code, configure, populate with content"],
        ["Deliver", "Test with real users, fix bugs, hand over to client"],
        ["Evaluate", "Review: did it meet the brief? What would you do differently?"],
      ],
      "Every professional team runs some version of this six-phase cycle, whatever they call it.",
    ),
  },
};

const TOPIC_OF_LESSON = {
  "elements-of-design": "design-concepts",
  "common-file-formats": "managing-data",
  "types-of-computer-crime": "impacts-of-technology",
  "software-troubleshooting": "application-skills",
  "the-design-process": "project-management",
};

let added = 0;
for (const [slug, byLesson] of Object.entries(ADD)) {
  const file = `lib/content/data/${slug}.json`;
  const raw = readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  const indent = raw.startsWith('{\n "') ? 1 : 2;
  for (const u of data.units) {
    for (const t of u.topics) {
      for (const l of t.lessons) {
        const diagram = byLesson[l.id];
        if (!diagram) continue;
        if (TOPIC_OF_LESSON[l.id] && TOPIC_OF_LESSON[l.id] !== t.id) continue; // disambiguate shared lesson ids across topics
        if (l.blocks.some((b) => b.type === "interactiveDiagram")) continue;
        const at = l.blocks.findIndex((b) => b.type === "quizQuestion");
        l.blocks.splice(at === -1 ? l.blocks.length : at, 0, diagram);
        added++;
      }
    }
  }
  writeFileSync(file, JSON.stringify(data, null, indent));
}
console.log(`Added ${added} diagram(s).`);
