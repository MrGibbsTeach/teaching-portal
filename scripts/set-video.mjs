// Fills a video placeholder: node scripts/set-video.mjs <lessonId> <youtubeId> [courseSlug]
// If the lesson id exists in more than one course, pass the course slug (shown in the register).
import fs from "node:fs";
import path from "node:path";

const [lessonId, youtubeId, courseSlug] = process.argv.slice(2);
if (!lessonId || !/^[\w-]{11}$/.test(youtubeId ?? "")) {
  console.error("Usage: node scripts/set-video.mjs <lessonId> <11-character youtubeId> [courseSlug]");
  process.exit(1);
}
const DIR = "lib/content/data";
const matches = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const p = path.join(DIR, f);
  const course = JSON.parse(fs.readFileSync(p, "utf8"));
  if (courseSlug && course.slug !== courseSlug) continue;
  for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) {
    if (l.id !== lessonId) continue;
    const slots = l.blocks.filter((b) => b.type === "videoSlot");
    if (slots.length === 1) matches.push({ p, course, slot: slots[0], slug: course.slug });
  }
}
if (matches.length === 0) { console.error(`No lesson "${lessonId}" with a video placeholder found${courseSlug ? ` in ${courseSlug}` : ""}.`); process.exit(1); }
if (matches.length > 1) { console.error(`"${lessonId}" has a placeholder in several courses: ${matches.map((m) => m.slug).join(", ")}. Pass the course slug as the third argument.`); process.exit(1); }
const m = matches[0];
m.slot.youtubeId = youtubeId;
fs.writeFileSync(m.p, JSON.stringify(m.course, null, 2) + "\n");
console.log(`Set ${lessonId} (${m.slug}) -> ${youtubeId}`);
