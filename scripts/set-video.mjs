// Fills a video placeholder: node scripts/set-video.mjs <lessonId> <youtubeId>
import fs from "node:fs";
import path from "node:path";

const [lessonId, youtubeId] = process.argv.slice(2);
if (!lessonId || !/^[\w-]{11}$/.test(youtubeId ?? "")) {
  console.error("Usage: node scripts/set-video.mjs <lessonId> <11-character youtubeId>");
  process.exit(1);
}
const DIR = "lib/content/data";
let done = false;
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const p = path.join(DIR, f);
  const course = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) {
    if (l.id !== lessonId) continue;
    const slots = l.blocks.filter((b) => b.type === "videoSlot");
    if (slots.length !== 1) { console.error(`Lesson has ${slots.length} videoSlot blocks; expected 1.`); process.exit(1); }
    slots[0].youtubeId = youtubeId;
    fs.writeFileSync(p, JSON.stringify(course, null, 2) + "\n");
    console.log(`Set ${lessonId} -> ${youtubeId} in ${f}`);
    done = true;
  }
}
if (!done) { console.error(`Lesson not found: ${lessonId}`); process.exit(1); }
