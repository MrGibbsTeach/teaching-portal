// Replaces Watch & Learn callout blocks with actual embedded video blocks
// for lessons where a verified YouTube video ID is available.
// Run with: node scripts/add-foundation-videos.mjs

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataFile = join(root, "lib/content/data/ait-foundations.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

// Verified YouTube IDs — every one confirmed via oEmbed API.
// Map: "topicId/lessonIndex" → { youtubeId, title, caption }
const VERIFIED_VIDEOS = {
  // Computer System (Year 11)
  "c11_1/0": {
    youtubeId: "OAx_6-wdslM",
    title: "Introducing How Computers Work",
    caption: "Code.org — a great overview of what computers actually do.",
  },
  "c11_1/1": {
    youtubeId: "AkFi90lZmXA",
    title: "Inside Your Computer",
    caption: "TED-Ed — see exactly what's happening inside a computer.",
  },
  // Digital Citizenship (Year 11)
  "c11_4/0": {
    youtubeId: "7_LPdttKXPc",
    title: "How the Internet Works in 5 Minutes",
    caption: "A clear, simple explanation of how data travels online.",
  },
  "c11_4/2": {
    youtubeId: "eHp1l73ztB8",
    title: "How Does The Internet Work? — BBC Click",
    caption: "BBC Click explains the internet in an easy-to-follow way.",
  },
  // Computer System (Year 12)
  "c12_1/0": {
    youtubeId: "6mbFO0ZLMW8",
    title: "Hardware — CS50's Understanding Technology",
    caption: "Harvard's CS50 breaks down computer hardware clearly.",
  },
  // Online Ethics (Year 12)
  "c12_5/0": {
    youtubeId: "guvsH5OFizE",
    title: "The World Wide Web: Crash Course Computer Science #30",
    caption: "How the web, social media, and online services connect us all.",
  },
};

let replaced = 0;

for (const unit of data.units) {
  for (const topic of unit.topics) {
    for (let li = 0; li < topic.lessons.length; li++) {
      const key = `${topic.id}/${li}`;
      const video = VERIFIED_VIDEOS[key];
      if (!video) continue;

      const lesson = topic.lessons[li];
      const idx = lesson.blocks.findIndex(
        (b) => b.type === "callout" && b.variant === "video"
      );
      if (idx === -1) {
        console.log(`  warn: no video callout found in ${key}`);
        continue;
      }

      lesson.blocks[idx] = {
        type: "video",
        youtubeId: video.youtubeId,
        title: video.title,
        caption: video.caption,
      };
      replaced++;
      console.log(`  ✓ ${key} — ${video.title}`);
    }
  }
}

writeFileSync(dataFile, JSON.stringify(data, null, 1), "utf8");
console.log(`\nReplaced ${replaced} callout blocks with embedded videos.`);
