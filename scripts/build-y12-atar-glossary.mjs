#!/usr/bin/env node
/**
 * Builds the Year 12 Applied IT ATAR glossary from the course's own key terms,
 * the same way Year 11 ATAR has one (see lib/content/data/year-11-applied-it-atar.json,
 * unit "glossary"). Y12 had neither a glossary nor a practice exam — see
 * STATUS.md, "No practice exam or glossary yet for Y12".
 *
 * Collects every keyTerm/keyTerms block already in the Y12 ATAR content (so
 * every definition is one already taught, not invented for this file), groups
 * by the topic category it came from (Design Concepts, Hardware, ... — Unit 3
 * and Unit 4 share five category names, merged into one group each, same as
 * Y11), sorts alphabetically within each group, and appends a trailing
 * "Glossary" unit, mirroring Y11's structure exactly.
 *
 * Idempotent: removes any unit with id "glossary" before rebuilding, so
 * re-running after a content update regenerates it rather than duplicating it.
 *
 * Usage: node scripts/build-y12-atar-glossary.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "lib", "content", "data", "year-12-applied-it-atar.json");

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

/** topic.title -> Map<term, definition> (a Map preserves first-seen definition unless a longer one is found). */
const groups = new Map();

for (const unit of data.units) {
  if (unit.id === "glossary") continue; // in case this is re-run after it already exists
  for (const topic of unit.topics) {
    if (!groups.has(topic.title)) groups.set(topic.title, new Map());
    const terms = groups.get(topic.title);
    for (const lesson of topic.lessons) {
      for (const block of lesson.blocks) {
        const items =
          block.type === "keyTerm"
            ? [{ term: block.term, definition: block.definition }]
            : block.type === "keyTerms"
              ? block.items
              : [];
        for (const { term, definition } of items) {
          if (!term || !definition) continue;
          const existing = terms.get(term);
          // Prefer the longer definition when the same term recurs (e.g. "Firewall"
          // gets a one-line mention in the LAN-design lesson and a full definition
          // in the network-security lesson — keep the full one).
          if (!existing || definition.length > existing.length) {
            terms.set(term, definition);
          }
        }
      }
    }
  }
}

const groupOrder = [...groups.keys()].sort((a, b) => a.localeCompare(b));

const blocks = [];
let totalTerms = 0;
for (const groupTitle of groupOrder) {
  const terms = groups.get(groupTitle);
  const sortedTerms = [...terms.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { sensitivity: "base" })
  );
  totalTerms += sortedTerms.length;
  blocks.push({ type: "heading", text: groupTitle, level: 3 });
  blocks.push({
    type: "keyTerms",
    items: sortedTerms.map(([term, definition]) => ({ term, definition })),
  });
}

data.units = data.units.filter((u) => u.id !== "glossary");
data.units.push({
  id: "glossary",
  title: "Glossary",
  status: "available",
  topics: [
    {
      id: "glossary",
      title: "Glossary",
      description: `${totalTerms} key terms`,
      lessons: [
        {
          id: "glossary-a-z",
          title: "Glossary (A–Z by topic)",
          blocks,
        },
      ],
    },
  ],
});

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`Done. ${totalTerms} terms across ${groupOrder.length} topic groups: ${groupOrder.join(", ")}.`);
