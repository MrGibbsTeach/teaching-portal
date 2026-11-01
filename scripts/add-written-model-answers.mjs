// Adds a full-mark model answer and the scenario text to every Y12 General written question.
// Idempotent: safe to re-run. Model answers live in scripts/data/y12-model-answers-*.json.
import fs from "node:fs";

const FILE = "lib/content/data/year-12-applied-it-general.json";
const course = JSON.parse(fs.readFileSync(FILE, "utf8"));
const answers = {
  ...JSON.parse(fs.readFileSync("scripts/data/y12-model-answers-a.json", "utf8")),
  ...JSON.parse(fs.readFileSync("scripts/data/y12-model-answers-b.json", "utf8")),
};

// Design Concepts lessons keep their scenario in the Content tab, so give the questions their own copy.
const DESIGN = {
  "design-concepts-1-elements-of-design":
    "A cafe menu board uses a chalkboard-look background, white hand-drawn lines between sections, round price badges, and wide gaps between the drinks and food sections.",
  "design-concepts-2-principles-of-design":
    'A school sports carnival flyer has a huge orange "CARNIVAL DAY" heading, a small team logo repeated in each corner, and event times grouped in one box. The date is in small grey text near the bottom.',
  "design-concepts-3-elements-and-principles-relationship":
    'A weather app home screen for Bunbury shows a large "22°" with "Partly cloudy" on a blue "Today" bar, with plenty of empty space around the temperature. Below it, three equal rounded cards in one row show TUE 21°, WED 23° and THU 22°.',
  "design-concepts-4-typography":
    "A retirement village is designing a printed newsletter for its residents, many of whom have poor eyesight.",
  "design-concepts-5-compositional-rules":
    "A student's Instagram post for a school play has the title, date, a photo and the ticket link all centred and stacked down the middle, with different gaps between each.",
  "design-concepts-6-analysing-existing-products":
    "A council event website home page has a full-width photo of fireworks, the event name in large white text over the photo, and four equal buttons below: Map, Food, Parking, Tickets.",
  "design-concepts-7-modifying-and-annotating-designs":
    "A bakery's draft Instagram post has the logo in the centre, the opening hours in tiny text at the bottom, and five different fonts. The owner wants people to notice the new Saturday hours.",
};

// Single questions whose case sits in the Content tab.
const BY_QUESTION = {
  "impacts-of-technology-u3-1-digital-citizenship-q2":
    "A Year 10 student has a public TikTok account. Her profile shows her school uniform, and her videos are often filmed at a local park.",
};

function scenarioBefore(blocks, idx) {
  for (let j = idx - 1; j >= 0; j--) {
    const b = blocks[j];
    if (b.type === "infoCards" && b.cards?.[0]?.heading?.startsWith("Scenario")) {
      const c = b.cards[0];
      const title = c.heading.replace(/^Scenario:?\s*/, "").trim();
      const body = c.text.replace(/\s*Answer the questions below using this scenario\.?\s*$/, "").trim();
      return title ? `${title}. ${body}` : body;
    }
  }
  return undefined;
}

let withAnswer = 0, withStimulus = 0, missing = [];
for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) {
  l.blocks.forEach((b, i) => {
    if (b.type !== "quizQuestion") return;
    const q = b.question;
    if (q.questionType !== "short_answer" && q.questionType !== "extended") return;
    if (answers[q.id]) { q.modelAnswer = answers[q.id]; withAnswer++; } else missing.push(q.id);
    const stim = BY_QUESTION[q.id] ?? DESIGN[l.id] ?? scenarioBefore(l.blocks, i);
    if (stim) { q.stimulus = stim; withStimulus++; }
  });
}
fs.writeFileSync(FILE, JSON.stringify(course, null, 2) + "\n");
console.log(`model answers: ${withAnswer}, scenarios attached: ${withStimulus}, missing answers: ${missing.length}`);
missing.forEach((m) => console.log("  missing", m));
