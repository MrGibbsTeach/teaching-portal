// Adds verified YouTube videos to key lessons in both General courses.
// All IDs confirmed via YouTube oEmbed API.
// Run with: node scripts/add-general-videos.mjs
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// Every confirmed video with the lesson (courseSlug/topicId/lessonIndex) it belongs to.
const PLACEMENTS = [
  // ── Y11 General ────────────────────────────────────────────────
  {
    file: "year-11-applied-it-general.json",
    topicId: "design-concepts",
    lessonIndex: 0,
    video: { youtubeId: "yNDgFK2Jj1E", title: "Understanding Visual Design Principles", caption: "Google UX Design — a great intro to the visual design principles you'll use throughout this course." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "design-concepts",
    lessonIndex: 1,
    video: { youtubeId: "a5KYlHNKQB8", title: "Beginning Graphic Design: Layout & Composition", caption: "GCFLearnFree — watch how layout and composition principles are applied in real graphic design work." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "hardware",
    lessonIndex: 0,
    video: { youtubeId: "OAx_6-wdslM", title: "Introducing How Computers Work", caption: "Code.org — a clear overview of the hardware and software that make up a computer system." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "hardware",
    lessonIndex: 1,
    video: { youtubeId: "AkFi90lZmXA", title: "Inside Your Computer", caption: "TED-Ed — a visual tour of what's physically happening inside a computer." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "hardware",
    lessonIndex: 2,
    video: { youtubeId: "p3q5zWCw8J4", title: "How Computer Memory Works", caption: "TED-Ed — how RAM, ROM, and storage work together inside a computer." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "impacts-of-technology",
    lessonIndex: 1,
    video: { youtubeId: "7_LPdttKXPc", title: "How the Internet Works in 5 Minutes", caption: "A simple, clear explanation of how data moves across the internet." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "networks",
    lessonIndex: 0,
    video: { youtubeId: "3QhU9jd03a0", title: "Computer Networks: Crash Course CS #28", caption: "Crash Course Computer Science — how networks are structured and how they communicate." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "networks",
    lessonIndex: 1,
    video: { youtubeId: "ewrBalT_eBM", title: "A Packet's Tale: How Does the Internet Work?", caption: "World Science Festival — follow a packet of data as it travels across the internet." },
  },
  {
    file: "year-11-applied-it-general.json",
    topicId: "networks",
    lessonIndex: 2,
    video: { youtubeId: "x3c1ih2NJEg", title: "How Does the Internet Work?", caption: "A step-by-step visual walkthrough of internet infrastructure." },
  },
  // ── Y12 General ────────────────────────────────────────────────
  {
    file: "year-12-applied-it-general.json",
    topicId: "design-concepts",
    lessonIndex: 0,
    video: { youtubeId: "yNDgFK2Jj1E", title: "Understanding Visual Design Principles", caption: "Google UX Design — visual design principles applied in professional product design." },
  },
  {
    file: "year-12-applied-it-general.json",
    topicId: "design-concepts",
    lessonIndex: 2,
    video: { youtubeId: "a5KYlHNKQB8", title: "Beginning Graphic Design: Layout & Composition", caption: "GCFLearnFree — how professional designers apply layout composition rules." },
  },
  {
    file: "year-12-applied-it-general.json",
    topicId: "hardware",
    lessonIndex: 0,
    video: { youtubeId: "6mbFO0ZLMW8", title: "Hardware — CS50's Understanding Technology", caption: "Harvard's CS50 — a deep dive into computer hardware for IT professionals." },
  },
  {
    file: "year-12-applied-it-general.json",
    topicId: "hardware",
    lessonIndex: 1,
    video: { youtubeId: "I0-izyq6q5s", title: "How Do Computers Remember?", caption: "Sebastian Lague — a beautiful visual explanation of how computer memory and storage work." },
  },
  {
    file: "year-12-applied-it-general.json",
    topicId: "networks",
    lessonIndex: 0,
    video: { youtubeId: "3QhU9jd03a0", title: "Computer Networks: Crash Course CS #28", caption: "Crash Course Computer Science — network types, protocols, and how the internet is structured." },
  },
  {
    file: "year-12-applied-it-general.json",
    topicId: "networks",
    lessonIndex: 2,
    video: { youtubeId: "ewrBalT_eBM", title: "A Packet's Tale: How Does the Internet Work?", caption: "World Science Festival — see exactly how data packets travel between computers." },
  },
  {
    file: "year-12-applied-it-general.json",
    topicId: "impacts-of-technology-u3",
    lessonIndex: 0,
    video: { youtubeId: "guvsH5OFizE", title: "The World Wide Web: Crash Course CS #30", caption: "Crash Course CS — how the web works and how it's transformed how we publish and share information." },
  },
];

const loaded = {};
function getData(filename) {
  if (!loaded[filename]) {
    loaded[filename] = JSON.parse(readFileSync(join(root, "lib/content/data", filename), "utf8"));
  }
  return loaded[filename];
}

let inserted = 0;
for (const p of PLACEMENTS) {
  const data = getData(p.file);
  let topic;
  for (const u of data.units) {
    topic = u.topics.find(t => t.id === p.topicId);
    if (topic) break;
  }
  if (!topic) { console.warn(`  ⚠ topic not found: ${p.topicId} in ${p.file}`); continue; }
  const lesson = topic.lessons[p.lessonIndex];
  if (!lesson) { console.warn(`  ⚠ lesson index ${p.lessonIndex} not found in ${p.topicId}`); continue; }

  // Insert after first heading block (or at index 2, whichever is earlier), but not at 0
  const insertAt = Math.min(2, lesson.blocks.length);
  lesson.blocks.splice(insertAt, 0, { type: "video", ...p.video });
  inserted++;
  console.log(`  ✓ ${p.file.replace('.json','')}/${p.topicId}[${p.lessonIndex}] → ${p.video.title}`);
}

for (const [filename, data] of Object.entries(loaded)) {
  writeFileSync(join(root, "lib/content/data", filename), JSON.stringify(data, null, 1), "utf8");
}
console.log(`\nInserted ${inserted} video blocks.`);
