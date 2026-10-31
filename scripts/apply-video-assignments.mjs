// Applies scripts/video-assignments.json to the course data. Safe to re-run.
// Each assignment fills a lesson's videoSlot with a YouTube ID and the real title of the video.
// To remove one, delete its entry from the JSON and run: node scripts/apply-video-assignments.mjs --reset <lessonId> <courseSlug>
import fs from "node:fs";

const FILE = (slug) => `lib/content/data/${slug}.json`;
const assignments = JSON.parse(fs.readFileSync("scripts/video-assignments.json", "utf8"));
const [flag, resetLesson, resetCourse] = process.argv.slice(2);
const byCourse = {};
for (const a of assignments) (byCourse[a.course] ??= []).push(a);
let applied = 0, skipped = [];
const courses = flag === "--reset" ? [resetCourse] : Object.keys(byCourse);
for (const slug of courses) {
  const course = JSON.parse(fs.readFileSync(FILE(slug), "utf8"));
  const lessons = new Map();
  for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) lessons.set(l.id, l);
  if (flag === "--reset") {
    const slot = lessons.get(resetLesson)?.blocks.find((b) => b.type === "videoSlot");
    if (!slot) { console.error("no videoSlot for", resetLesson); process.exit(1); }
    delete slot.youtubeId; delete slot.videoTitle; delete slot.videoSource;
    fs.writeFileSync(FILE(slug), JSON.stringify(course, null, 2) + "\n");
    console.log("cleared", resetLesson); continue;
  }
  for (const a of byCourse[slug]) {
    const slot = lessons.get(a.lesson)?.blocks.find((b) => b.type === "videoSlot");
    if (!slot) { skipped.push(`${slug}/${a.lesson} (no videoSlot; lesson may already have a real video)`); continue; }
    slot.youtubeId = a.youtubeId; slot.videoTitle = a.videoTitle; slot.videoSource = a.source;
    applied++;
  }
  fs.writeFileSync(FILE(slug), JSON.stringify(course, null, 2) + "\n");
}
if (flag !== "--reset") console.log(`applied ${applied}, skipped ${skipped.length}`);
skipped.forEach((s) => console.log("  skipped:", s));
