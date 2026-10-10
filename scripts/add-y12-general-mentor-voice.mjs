#!/usr/bin/env node
/**
 * Restores an authentic mentor voice to Year 12 Applied IT General (Checkpoint 1
 * in CHECKPOINTS.md). The 2027 deck migration (scripts/transform-y12-general-2027.mjs)
 * carried over no mentor voice at all, while lib/agents.ts still maps every one of
 * these topics to a mentor — so the AgentCard was showing on every lesson with
 * nothing underneath it in that mentor's voice.
 *
 * Adds four new callout blocks per lesson — ticket, senior-wisdom, pr-review,
 * sandbox — at fixed points in the lesson's 9-slide structure. Nothing existing
 * is edited, reordered or removed: key terms, tables, worked examples, test
 * tips, marking keys, quiz questions and the final nav/task callout are
 * untouched, so WACE content fidelity is unaffected.
 *
 * Each mentor uses a label scheme suited to their own profession rather than one
 * dev skeleton over everyone (ticket/sandbox/pr-review language fits Rory and
 * Sloane, who already run sprints and data audits; Leo, Sparky and Elara get
 * their own — see y12-general-mentor-voice-data.mjs).
 *
 * Idempotent: re-running after this has already applied is a no-op (checks for
 * an existing ticket-labelled callout as the first block before inserting).
 *
 * Usage: node scripts/add-y12-general-mentor-voice.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LESSON_VOICE, MENTORS, TOPIC_MENTOR } from "./y12-general-mentor-voice-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "lib", "content", "data", "year-12-applied-it-general.json");

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

function calloutBlock(variant, heading, text) {
  return { type: "callout", variant, heading, text };
}

let touched = 0;
let skippedNoVoice = 0;
let skippedAlready = 0;

for (const unit of data.units) {
  for (const topic of unit.topics) {
    const mentorKey = TOPIC_MENTOR[topic.id];
    if (!mentorKey) {
      throw new Error(`No mentor mapped for topic "${topic.id}" — add it to TOPIC_MENTOR.`);
    }
    const mentor = MENTORS[mentorKey];

    for (const lesson of topic.lessons) {
      const voice = LESSON_VOICE[lesson.id];
      if (!voice) {
        skippedNoVoice++;
        console.warn(`No mentor-voice content for lesson "${lesson.id}" — left unchanged.`);
        continue;
      }

      const blocks = lesson.blocks;

      // Idempotency: if block 0 is already one of our ticket callouts, skip.
      if (blocks[0]?.type === "callout" && blocks[0].heading === mentor.labels.ticket) {
        skippedAlready++;
        continue;
      }

      const testTipIdx = blocks.findIndex((b) => b.type === "heading" && /^test tip/i.test(b.text || ""));
      const quizIdx = blocks.findIndex((b) => b.type === "quizQuestion");
      if (testTipIdx === -1 || quizIdx === -1) {
        throw new Error(`Lesson "${lesson.id}" is missing a Test tip heading or a quizQuestion block.`);
      }
      if (quizIdx < testTipIdx) {
        throw new Error(`Lesson "${lesson.id}" has quiz questions before its Test tip heading — unexpected shape.`);
      }

      // Insert from the highest index down so earlier insertions don't shift
      // indices we've already computed.
      blocks.splice(quizIdx, 0, calloutBlock("sandbox", mentor.labels.sandbox, voice.sandbox));
      blocks.splice(testTipIdx + 1, 0, calloutBlock("pr-review", mentor.labels.pr, voice.pr));
      blocks.splice(testTipIdx, 0, calloutBlock("senior-wisdom", mentor.labels.wisdom, voice.wisdom));
      blocks.splice(0, 0, calloutBlock("ticket", mentor.labels.ticket, voice.ticket));

      touched++;
    }
  }
}

if (skippedNoVoice > 0) {
  console.error(`\n${skippedNoVoice} lesson(s) had no authored voice content — see warnings above. Aborting without writing.`);
  process.exit(1);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`Done. ${touched} lessons updated, ${skippedAlready} already had mentor voice (skipped).`);
