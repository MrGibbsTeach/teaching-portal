// Merges all .content-drafts/y12gen/*.json topic files into year-12-applied-it-general.json.
// Run with: node scripts/merge-general-y12.mjs
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const draftDir = join(root, ".content-drafts/y12gen");
const dataFile = join(root, "lib/content/data/year-12-applied-it-general.json");

const VALID_BLOCK_TYPES = new Set([
  "heading","paragraph","richText","list","table","keyTerm","keyTerms",
  "callout","divider","video","grid","comparison","softwareExamples",
  "formulaBreakdown","formulaBuilder","scenarioChallenge","spotTheThreat",
  "codePreview","task","quizQuestion","activity",
]);

function validateTopic(topic) {
  let blockCount = 0;
  for (const lesson of topic.lessons) {
    for (const b of lesson.blocks) {
      blockCount++;
      if (!VALID_BLOCK_TYPES.has(b.type)) {
        throw new Error(`${lesson.id}: unknown block type "${b.type}"`);
      }
      if (b.type === "quizQuestion") {
        if (!b.question?.questionType) throw new Error(`${lesson.id}: quizQuestion missing questionType`);
      }
    }
  }
  console.log(`  ✓ ${topic.id} (${topic.lessons.length} lessons, ${blockCount} blocks)`);
  return blockCount;
}

function loadTopic(filename) {
  return JSON.parse(readFileSync(join(draftDir, filename), "utf8"));
}

const unit3Topics = [
  loadTopic("design-concepts.json"),
  loadTopic("hardware.json"),
  loadTopic("impacts-of-technology-u3.json"),
  loadTopic("application-skills-u3.json"),
  loadTopic("project-management-u3.json"),
];

const unit4Topics = [
  loadTopic("managing-data.json"),
  loadTopic("networks.json"),
  loadTopic("impacts-of-technology-u4.json"),
  loadTopic("application-skills-u4.json"),
  loadTopic("project-management-u4.json"),
];

console.log("Validating Unit 3 topics...");
let total = 0;
for (const t of unit3Topics) total += validateTopic(t);

console.log("\nValidating Unit 4 topics...");
for (const t of unit4Topics) total += validateTopic(t);

const assembled = {
  slug: "year-12-applied-it-general",
  title: "Applied IT — General",
  units: [
    {
      id: "unit3",
      title: "Media Information and Communication Technologies",
      subtitle: "Year 12 · Unit 3",
      status: "available",
      topics: unit3Topics,
    },
    {
      id: "unit4",
      title: "Digital Technologies in Business",
      subtitle: "Year 12 · Unit 4",
      status: "available",
      topics: unit4Topics,
    },
  ],
};

writeFileSync(dataFile, JSON.stringify(assembled, null, 1), "utf8");
const totalLessons = [...unit3Topics, ...unit4Topics].reduce((a, t) => a + t.lessons.length, 0);
console.log(`\nDone. 10 topics, ${totalLessons} lessons, ${total} blocks.`);
