// Read-only audit of the Year 11 / Year 12 General content. Prints per-topic coverage
// so gaps (thin topics, no quiz, no task, no interactive block) are visible before authoring.
import { readFileSync } from "node:fs";

const INTERACTIVE = new Set(["formulaBuilder", "scenarioChallenge", "spotTheThreat", "codePreview", "activity", "interactiveDiagram", "checkpointVideo"]);
const files = ["year-11-applied-it-general", "year-12-applied-it-general"];

for (const f of files) {
  const c = JSON.parse(readFileSync(`lib/content/data/${f}.json`, "utf8"));
  console.log(`\n=== ${f} ===`);
  console.log("unit/topic".padEnd(52), "les", "blk", "quiz", "task", "intr", "video", "flags");
  for (const u of c.units) {
    for (const t of u.topics) {
      let blk = 0, quiz = 0, task = 0, intr = 0, video = 0;
      const thin = [];
      for (const l of t.lessons) {
        const n = l.blocks.length;
        blk += n;
        if (n < 4) thin.push(l.id);
        for (const b of l.blocks) {
          if (b.type === "quizQuestion") quiz++;
          if (b.type === "task") task++;
          if (b.type === "video") video++;
          if (INTERACTIVE.has(b.type)) intr++;
        }
      }
      const flags = [];
      if (t.lessons.length === 0) flags.push("EMPTY");
      if (quiz === 0) flags.push("no-quiz");
      if (task === 0) flags.push("no-task");
      if (intr === 0) flags.push("no-interactive");
      if (video === 0) flags.push("no-video");
      if (thin.length) flags.push(`thin:${thin.join(",")}`);
      console.log(`${u.id}/${t.id}`.padEnd(52), String(t.lessons.length).padStart(3), String(blk).padStart(3), String(quiz).padStart(4), String(task).padStart(4), String(intr).padStart(4), String(video).padStart(5), flags.join(" "));
    }
  }
}
