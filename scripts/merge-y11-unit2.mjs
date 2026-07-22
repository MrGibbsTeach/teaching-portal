// Patches the three Unit 2 topics in Year 11 General that were not overhauled
// by the original Apprenticeship Framework merge (which only patched the first match per ID).
// Run with: node scripts/merge-y11-unit2.mjs

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const draftDir = join(root, ".content-drafts");

const VALID_BLOCK_TYPES = new Set([
  "heading","paragraph","richText","list","table","keyTerm","keyTerms",
  "callout","divider","video","grid","comparison","softwareExamples",
  "formulaBreakdown","formulaBuilder","scenarioChallenge","spotTheThreat",
  "codePreview","task","quizQuestion","activity",
]);

function loadLessons(filename) {
  const path = join(draftDir, filename);
  if (!existsSync(path)) { console.log(`  ⏭  Skipping ${filename} — not found`); return null; }
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const lessons = Array.isArray(raw) ? raw : (raw.lessons ?? []);
  let blocks = 0;
  for (const l of lessons) {
    for (const b of l.blocks) {
      if (!VALID_BLOCK_TYPES.has(b.type)) throw new Error(`${filename}/${l.id}: invalid block type "${b.type}"`);
      blocks++;
    }
  }
  console.log(`  ✓ ${filename} — ${lessons.length} lessons, ${blocks} blocks`);
  return lessons;
}

const y11 = JSON.parse(readFileSync(join(root, "lib/content/data/year-11-applied-it-general.json"), "utf8"));
const unit2 = y11.units[1]; // "Working with Others"

if (!unit2) throw new Error("Unit 2 not found — check JSON structure");
console.log(`\nPatching Unit 2: ${unit2.title}`);

let changes = 0;

for (const [topicId, filename] of [
  ["impacts-of-technology", "elara-impacts-y11-u2.json"],
  ["application-skills",   "rory-appskills-y11-u2.json"],
  ["project-management",   "rory-pm-y11-u2.json"],
]) {
  const lessons = loadLessons(filename);
  if (!lessons) continue;
  const topic = unit2.topics.find(t => t.id === topicId);
  if (!topic) { console.warn(`  ⚠ topic "${topicId}" not found in Unit 2`); continue; }
  topic.lessons = lessons;
  changes++;
  console.log(`  → Patched Unit 2 / ${topicId}`);
}

if (changes > 0) {
  writeFileSync(
    join(root, "lib/content/data/year-11-applied-it-general.json"),
    JSON.stringify(y11, null, 1),
    "utf8"
  );
  const totalBlocks = y11.units.flatMap(u => u.topics).flatMap(t => t.lessons).reduce((a, l) => a + l.blocks.length, 0);
  const totalLessons = y11.units.flatMap(u => u.topics).flatMap(t => t.lessons).length;
  console.log(`\nDone: ${changes} Unit 2 topics patched — ${totalLessons} lessons, ${totalBlocks} blocks total.`);
} else {
  console.log("No changes made.");
}
