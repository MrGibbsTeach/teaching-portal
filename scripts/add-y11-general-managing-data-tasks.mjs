#!/usr/bin/env node
/**
 * Adds hands-on `task` blocks to Year 11 Applied IT General — Managing Data,
 * the one remaining "no-task" topic in Y11 General whose gap is NOT by design
 * (unlike Hardware/Networks/Impacts of Technology, which
 * scripts/y12-general-tasks-data.mjs documents as deliberately task-free in
 * both years — "assessed by explanation, not by producing a file"). Y12's own
 * Managing Data topic already got 4 tasks for the same reason this one should:
 * file/folder work is itself hands-on.
 *
 * Mirrors the Y12 General task pattern: insert right after the lesson's
 * sandbox callout and before the quiz questions. The sandbox callout in each
 * of these lessons already asks the student to analyse/describe a scenario on
 * paper; the task pushes them to actually build the real folders/files using
 * the exact naming convention taught in the lesson, which the sandbox doesn't
 * require.
 *
 * Idempotent: skips any lesson that already has a task block.
 *
 * Usage: node scripts/add-y11-general-managing-data-tasks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "lib", "content", "data", "year-11-applied-it-general.json");

const LESSON_TASKS = {
  "file-and-folder-organisation": {
    type: "task",
    title: "Build a Real Client Folder Structure",
    software: "File Explorer or Finder (or your school's cloud drive)",
    intro:
      "Use the SW Logistical Analytics naming convention and folder structure from this lesson to build an actual, navigable folder tree — not a diagram of one.",
    steps: [
      "In your course folder, create a top-level folder named for a client you invent, e.g. SWL-Alpha.",
      "Inside it, create the six numbered subfolders from this lesson: 01_Briefs, 02_Working, 03_Review, 04_Approved, 05_Assets, 06_Delivery.",
      "Create at least 6 dummy files (empty text files are fine) and name every one using the lesson's convention — Client/Project code, document type, version number, date (YYYYMMDD), and status — e.g. SWL-Alpha_DeliveryReport_v1.0_20260718_draft.docx.",
      "Place each file in the folder it actually belongs in, not just 02_Working for everything.",
      "Take one file through two versions: save v1.0 in 02_Working, then save an edited v1.1 alongside it — never overwrite the original.",
      "Take a screenshot of the full expanded folder tree with file names visible.",
      "Write two sentences explaining which two naming-convention rules the badly-named files in this lesson's sandbox challenge broke, using your own folder as the correct example.",
    ],
  },
  "version-control-for-data-files": {
    type: "task",
    title: "Version a Real Data File",
    software: "A spreadsheet or text editor and File Explorer/Finder",
    intro:
      "Create a real CSV, then version it properly through a change — the same major.minor discipline SW Logistical Analytics uses on live client data.",
    steps: [
      "Create a simple CSV with at least 4 columns and 5 rows of sample data (any topic — e.g. a class roster or a product list).",
      "Save it using this lesson's convention: SWL-Alpha_DataSchema_v1.0_<today's date as YYYYMMDD>.csv.",
      "Make a minor change — add one new column of data to every row — and save it as a new file with the version bumped to v1.1, leaving v1.0 untouched.",
      "Make a major change to your v1.1 file — remove a column and restructure the column order — and save that as v2.0, again leaving the earlier versions untouched.",
      "Create a changelog.txt in the same folder listing all three versions, what changed in each, and the date.",
      "Confirm all three CSVs still exist side by side and open correctly.",
      "Write one sentence explaining why v1.0 was never edited in place, using this lesson's rule about shared or integrated files.",
    ],
  },
};

const raw = fs.readFileSync(DATA_PATH, "utf8");
const data = JSON.parse(raw);
const indent = raw.startsWith('{\n "') ? 1 : 2;

let added = 0;
let skippedAlready = 0;

for (const unit of data.units) {
  for (const topic of unit.topics) {
    if (topic.id !== "managing-data") continue;
    for (const lesson of topic.lessons) {
      const task = LESSON_TASKS[lesson.id];
      if (!task) continue;

      if (lesson.blocks.some((b) => b.type === "task")) {
        skippedAlready++;
        continue;
      }

      const sandboxIdx = lesson.blocks.findIndex((b) => b.type === "callout" && b.variant === "sandbox");
      if (sandboxIdx === -1) {
        throw new Error(`Lesson "${lesson.id}" has no sandbox callout to insert the task after.`);
      }

      lesson.blocks.splice(sandboxIdx + 1, 0, task);
      added++;
    }
  }
}

const missing = Object.keys(LESSON_TASKS).length - (added + skippedAlready);
if (missing !== 0) {
  console.error(`${missing} lesson id(s) in LESSON_TASKS were not found under managing-data — check for typos.`);
  process.exit(1);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, indent) + (raw.endsWith("\n") ? "\n" : ""));
console.log(`Done. ${added} task blocks added, ${skippedAlready} already had one (skipped).`);
