// Merges all .content-drafts/*.json topic files into ait-foundations.json.
// Run with: node scripts/merge-foundations-content.mjs
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const draftDir = join(root, ".content-drafts");
const dataFile = join(root, "lib/content/data/ait-foundations.json");

function loadTopic(id) {
  const raw = readFileSync(join(draftDir, `${id}.json`), "utf8");
  return JSON.parse(raw);
}

// Validate each block against schema — catch common agent mistakes
const VALID_BLOCK_TYPES = new Set([
  "heading","paragraph","richText","list","table","keyTerm","keyTerms",
  "callout","divider","video","grid","comparison","softwareExamples",
  "formulaBreakdown","formulaBuilder","scenarioChallenge","spotTheThreat",
  "codePreview","task","quizQuestion","activity",
]);

function validateBlocks(blocks, lessonId) {
  for (const b of blocks) {
    if (!VALID_BLOCK_TYPES.has(b.type)) {
      throw new Error(`${lessonId}: unknown block type "${b.type}"`);
    }
    if (b.type === "quizQuestion") {
      const q = b.question;
      if (!q || !q.questionType) throw new Error(`${lessonId}: quizQuestion missing questionType`);
      if (q.questionType === "mcq" && (!q.options || q.correctIndex == null)) {
        throw new Error(`${lessonId}: mcq missing options or correctIndex`);
      }
    }
    if (b.type === "activity") {
      const has = (k) => b[k] !== undefined;
      const valid = has("pairs") || has("orderedItems") || has("answer") || has("categories") || has("instruction");
      if (!valid) throw new Error(`${lessonId}: activity block has no recognised interactive field`);
    }
    if (b.type === "richText" && b.html === undefined) {
      throw new Error(`${lessonId}: richText block missing html`);
    }
  }
}

function validateTopic(topic) {
  for (const lesson of topic.lessons) {
    validateBlocks(lesson.blocks, lesson.id);
  }
  console.log(`  ✓ ${topic.id} (${topic.lessons.length} lessons, ${topic.lessons.reduce((a,l)=>a+l.blocks.length,0)} blocks)`);
}

const current = JSON.parse(readFileSync(dataFile, "utf8"));

const units = [
  {
    id: "unit1",
    title: "Computer Foundations",
    subtitle: "Year 11 · Units 1",
    status: "available",
    topicIds: ["c11_1","c11_2","c11_3","c11_4","c11_5"],
  },
  {
    ...current.units.find(u => u.id === "unit2"),
    // keep unit2 exactly as-is (already has real content)
  },
  {
    id: "unit3",
    title: "Applied Digital Skills",
    subtitle: "Year 12 · Unit 3",
    status: "available",
    topicIds: ["c12_1","c12_2","c12_3","c12_4","e12_4"],
  },
  {
    id: "unit4",
    title: "Online Ethics & Multimedia",
    subtitle: "Year 12 · Unit 4",
    status: "available",
    topicIds: ["c12_5","c12_6","e12_1","e12_2"],
  },
];

console.log("Validating drafts…");
const loadedTopics = {};
for (const unit of units) {
  if (!unit.topicIds) continue;
  for (const id of unit.topicIds) {
    const topic = loadTopic(id);
    validateTopic(topic);
    loadedTopics[id] = topic;
  }
}

console.log("\nAssembling ait-foundations.json…");
const assembled = {
  slug: current.slug,
  title: current.title,
  units: units.map(unit => {
    if (!unit.topicIds) {
      // unit2 kept as-is with existing topics array
      return unit;
    }
    return {
      id: unit.id,
      title: unit.title,
      ...(unit.subtitle ? { subtitle: unit.subtitle } : {}),
      status: unit.status,
      topics: unit.topicIds.map(id => loadedTopics[id]),
    };
  }),
};

writeFileSync(dataFile, JSON.stringify(assembled, null, 1), "utf8");
const totalLessons = assembled.units.flatMap(u=>u.topics).reduce((a,t)=>a+t.lessons.length,0);
const totalBlocks = assembled.units.flatMap(u=>u.topics).flatMap(t=>t.lessons).reduce((a,l)=>a+l.blocks.length,0);
console.log(`\nDone. ${assembled.units.length} units, ${assembled.units.flatMap(u=>u.topics).length} topics, ${totalLessons} lessons, ${totalBlocks} blocks.`);
