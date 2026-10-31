// Validates Y11 and Y12 AIT General course data. Exit code 1 on errors. Run: node scripts/validate-content.mjs
import fs from "node:fs";
import { JSDOM } from "jsdom";

const FILES = ["year-11-applied-it-general", "year-12-applied-it-general"];
const errors = [];
const warns = [];
const err = (l, m) => errors.push(`${l}: ${m}`);
const warn = (l, m) => warns.push(`${l}: ${m}`);
const DOMParserCtor = new JSDOM("").window.DOMParser;
const INTERACTIVE = new Set(["sorter", "sequence", "branchingScenario", "flipCards", "placer", "fileSizeLab", "interactiveDiagram", "codeExercise", "spotTheThreat", "formulaBuilder", "activity"]);

for (const f of FILES) {
  const course = JSON.parse(fs.readFileSync(`lib/content/data/${f}.json`, "utf8"));
  const qids = new Map();
  for (const u of course.units) for (const t of u.topics) for (const l of t.lessons) {
    const L = `${f}/${l.id}`;
    const isQuiz = /quiz|review/.test(l.id);
    if (!l.blocks.length) err(L, "no blocks");
    let interactive = 0, words = 0;
    l.blocks.forEach((b, i) => {
      const at = `${L}[${i}]`;
      if (!b || !b.type) return err(at, "null or typeless block");
      if (INTERACTIVE.has(b.type)) interactive++;
      const txt = JSON.stringify(b).replace(/<[^>]+>/g, " ");
      words += (txt.match(/[A-Za-z']+/g) ?? []).length;
      if (/\bexams?\b|\bexamination\b/i.test(txt) && !/Externally Set Task|EST/.test(txt)) warn(at, "uses 'exam' wording (General uses tests and assessments)");
      switch (b.type) {
        case "sorter":
          if (b.categories.length < 2) err(at, "sorter needs 2+ categories");
          if (b.items.length < 3) err(at, "sorter needs 3+ items");
          b.items.forEach((it, k) => { if (!Number.isInteger(it.category) || it.category < 0 || it.category >= b.categories.length) err(at, `sorter item ${k} category out of range`); if (!it.text || !it.why) err(at, `sorter item ${k} missing text or why`); });
          for (let c = 0; c < b.categories.length; c++) if (!b.items.some((it) => it.category === c)) warn(at, `sorter category "${b.categories[c]}" has no items`);
          break;
        case "sequence":
          if (b.items.length < 3) err(at, "sequence needs 3+ items");
          break;
        case "flipCards":
          if (b.cards.length < 1 || b.cards.some((c) => !c.front || !c.back)) err(at, "flipCards needs complete cards");
          if (b.cards.length === 1) warn(at, "flipCards has a single card");
          break;
        case "branchingScenario":
          b.steps.forEach((s, k) => { const n = s.choices.filter((c) => c.correct).length; if (n !== 1) err(at, `branching step ${k} has ${n} correct choices`); if (s.choices.length < 2) err(at, `branching step ${k} needs 2+ choices`); });
          break;
        case "placer":
          b.devices.forEach((d) => { if (!b.spots.some((s) => s.id === d.correctSpot)) err(at, `placer device "${d.name}" correctSpot missing`); });
          { const doc = new DOMParserCtor().parseFromString(b.planSvg, "image/svg+xml"); if (doc.querySelector("parsererror")) err(at, "plan SVG does not parse"); }
          break;
        case "svgFigure": {
          const doc = new DOMParserCtor().parseFromString(b.svg, "image/svg+xml");
          if (doc.querySelector("parsererror")) err(at, "SVG does not parse");
          if (!b.alt) err(at, "svgFigure missing alt text");
          break;
        }
        case "videoSlot":
          if (!b.title || !b.brief) err(at, "videoSlot needs title and brief");
          if (b.youtubeId && !/^[\w-]{11}$/.test(b.youtubeId)) err(at, "bad youtubeId");
          break;
        case "infoCards":
          if (!b.cards?.length) err(at, "infoCards empty");
          break;
        case "quizQuestion": {
          const q = b.question;
          if (q.id !== undefined) { if (qids.has(q.id)) err(at, `duplicate question id ${q.id} (also ${qids.get(q.id)})`); qids.set(q.id, at); }
          if (q.questionType === "mcq") {
            if (!q.options || q.options.length < 2) err(at, "mcq needs options");
            else if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) err(at, "mcq correctIndex out of range");
          }
          if (q.questionType === "true_false" && typeof q.correctAnswer !== "boolean") err(at, "true_false needs correctAnswer");
          if ((q.questionType === "extended" || q.questionType === "short_answer") && !q.explanation) warn(at, "written question without a model answer");
          break;
        }
      }
    });
    if (!isQuiz && interactive === 0) warn(L, "no interactive block");
    if (!isQuiz && words > 2600) warn(L, `very long lesson (~${words} words)`);
  }
}
console.log(`errors: ${errors.length}, warnings: ${warns.length}`);
errors.forEach((e) => console.log("ERROR", e));
const by = {};
warns.forEach((w) => { const k = w.split(": ").slice(1).join(": ").replace(/\d+/g, "N").replace(/"[^"]*"/g, '"…"'); (by[k] ??= []).push(w); });
Object.entries(by).forEach(([k, v]) => { console.log(`WARN x${v.length} ${k}`); v.slice(0, 3).forEach((x) => console.log("   ", x.split(" ")[0])); });
process.exit(errors.length ? 1 : 0);
