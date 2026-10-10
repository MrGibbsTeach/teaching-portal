#!/usr/bin/env node
/**
 * Adds hands-on `task` blocks to Year 12 Applied IT General (STATUS.md's
 * audit flagged 0 task blocks across the whole course, versus 19 in Y11
 * General, for a course whose own design direction calls for "practical,
 * hands-on... student independence").
 *
 * Inserts each lesson's task block right after its sandbox callout (added by
 * scripts/add-y12-general-mentor-voice.mjs) and before the quiz questions —
 * the same position Y11 General uses: sandbox callout introduces the
 * challenge, the task gives the actual steps, then the quiz follows. Must
 * run after the mentor-voice script, since it depends on that sandbox
 * callout already being there.
 *
 * Idempotent: skips any lesson that already has a task block.
 *
 * Usage: node scripts/add-y12-general-tasks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LESSON_TASKS } from "./y12-general-tasks-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "lib", "content", "data", "year-12-applied-it-general.json");

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

let added = 0;
let skippedAlready = 0;

for (const unit of data.units) {
  for (const topic of unit.topics) {
    for (const lesson of topic.lessons) {
      const task = LESSON_TASKS[lesson.id];
      if (!task) continue;

      if (lesson.blocks.some((b) => b.type === "task")) {
        skippedAlready++;
        continue;
      }

      const sandboxIdx = lesson.blocks.findIndex((b) => b.type === "callout" && b.variant === "sandbox");
      if (sandboxIdx === -1) {
        throw new Error(
          `Lesson "${lesson.id}" has no sandbox callout — run add-y12-general-mentor-voice.mjs first.`
        );
      }

      lesson.blocks.splice(sandboxIdx + 1, 0, task);
      added++;
    }
  }
}

const missing = Object.keys(LESSON_TASKS).length - (added + skippedAlready);
if (missing !== 0) {
  console.error(`${missing} lesson id(s) in LESSON_TASKS were not found in the course data — check for typos.`);
  process.exit(1);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`Done. ${added} task blocks added, ${skippedAlready} already had one (skipped).`);
