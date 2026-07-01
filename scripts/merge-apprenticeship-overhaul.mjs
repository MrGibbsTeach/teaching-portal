// Merges all Apprenticeship Framework agent drafts into the General course JSON files.
// Run with: node scripts/merge-apprenticeship-overhaul.mjs
// Safe to run incrementally — skips any topic if its draft file doesn't exist yet.
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
  if (!existsSync(path)) { console.log(`  ⏭  Skipping ${filename} — not yet written`); return null; }
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

function patchTopic(data, topicId, lessons) {
  if (!lessons) return false;
  for (const unit of data.units) {
    const topic = unit.topics.find(t => t.id === topicId);
    if (topic) { topic.lessons = lessons; return true; }
  }
  console.warn(`  ⚠ topic "${topicId}" not found in data`);
  return false;
}

// ── Y11 General ──────────────────────────────────────────────────────────────
console.log("\n=== Year 11 General ===");
const y11 = JSON.parse(readFileSync(join(root, "lib/content/data/year-11-applied-it-general.json"), "utf8"));
let y11Changes = 0;

// Note: design-concepts was already overwritten by deploy-leo-design-concepts.mjs — skip.
if (patchTopic(y11, "hardware",           loadLessons("sparky-hw-y11.json")))   y11Changes++;
if (patchTopic(y11, "networks",           loadLessons("sparky-net-y11.json")))  y11Changes++;
if (patchTopic(y11, "managing-data",      loadLessons("sloane-data-y11.json"))) y11Changes++;
if (patchTopic(y11, "impacts-of-technology", loadLessons("elara-impacts-y11.json"))) y11Changes++;
if (patchTopic(y11, "application-skills", loadLessons("rory-appskills-y11.json"))) y11Changes++;
if (patchTopic(y11, "project-management", loadLessons("rory-pm-y11.json")))     y11Changes++;

if (y11Changes > 0) {
  writeFileSync(join(root, "lib/content/data/year-11-applied-it-general.json"), JSON.stringify(y11, null, 1), "utf8");
  const totalBlocks = y11.units.flatMap(u=>u.topics).flatMap(t=>t.lessons).reduce((a,l)=>a+l.blocks.length,0);
  const totalLessons = y11.units.flatMap(u=>u.topics).flatMap(t=>t.lessons).length;
  console.log(`\nY11: ${y11Changes} topics updated — ${totalLessons} lessons, ${totalBlocks} blocks total.`);
} else { console.log("Y11: no changes."); }

// ── Y12 General ──────────────────────────────────────────────────────────────
console.log("\n=== Year 12 General ===");
const y12 = JSON.parse(readFileSync(join(root, "lib/content/data/year-12-applied-it-general.json"), "utf8"));
let y12Changes = 0;

if (patchTopic(y12, "design-concepts",          loadLessons("leo-design-y12.json")))         y12Changes++;
if (patchTopic(y12, "hardware",                  loadLessons("sparky-hw-y12.json")))          y12Changes++;
if (patchTopic(y12, "networks",                  loadLessons("sparky-net-y12.json")))         y12Changes++;
if (patchTopic(y12, "impacts-of-technology-u3",  loadLessons("elara-impacts-y12-u3.json")))  y12Changes++;
if (patchTopic(y12, "managing-data",             loadLessons("sloane-data-y12.json")))        y12Changes++;
if (patchTopic(y12, "impacts-of-technology-u4",  loadLessons("elara-impacts-y12-u4.json")))  y12Changes++;
if (patchTopic(y12, "application-skills-u3",     loadLessons("rory-appskills-y12-u3.json"))) y12Changes++;
if (patchTopic(y12, "project-management-u3",     loadLessons("rory-pm-y12-u3.json")))        y12Changes++;
if (patchTopic(y12, "application-skills-u4",     loadLessons("rory-appskills-y12-u4.json"))) y12Changes++;
if (patchTopic(y12, "project-management-u4",     loadLessons("rory-pm-y12-u4.json")))        y12Changes++;

if (y12Changes > 0) {
  writeFileSync(join(root, "lib/content/data/year-12-applied-it-general.json"), JSON.stringify(y12, null, 1), "utf8");
  const totalBlocks = y12.units.flatMap(u=>u.topics).flatMap(t=>t.lessons).reduce((a,l)=>a+l.blocks.length,0);
  const totalLessons = y12.units.flatMap(u=>u.topics).flatMap(t=>t.lessons).length;
  console.log(`\nY12: ${y12Changes} topics updated — ${totalLessons} lessons, ${totalBlocks} blocks total.`);
} else { console.log("Y12: no changes."); }
