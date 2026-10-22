// Add lesson-specific visual models to the non-Design Concepts topics in the
// Year 11 and Year 12 AIT General courses. Labels and examples come from each
// lesson's existing comparisons, tables, key terms, lists or check questions.
import { readFileSync, writeFileSync } from "node:fs";

const palettes = {
  hardware: ["#1d4ed8", "#0e7490", "#dbeafe", "#e0f2fe"],
  impact: ["#7c3aed", "#c2410c", "#ede9fe", "#ffedd5"],
  application: ["#047857", "#2563eb", "#d1fae5", "#dbeafe"],
  project: ["#7c3aed", "#b45309", "#ede9fe", "#fef3c7"],
  data: ["#0f766e", "#4f46e5", "#ccfbf1", "#e0e7ff"],
  network: ["#0369a1", "#7c3aed", "#e0f2fe", "#ede9fe"],
  general: ["#4f46e5", "#0f766e", "#e0e7ff", "#ccfbf1"],
};

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function plain(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:amp|nbsp|quot|#39|lt|gt);/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrap(value, maxChars, maxLines = 3) {
  const words = plain(value).split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const visible = lines.slice(0, maxLines);
    visible[maxLines - 1] = `${visible[maxLines - 1].replace(/[.,;:]$/, "")}…`;
    return visible;
  }
  return lines;
}

function textLines(value, x, y, maxChars, size = 14, color = "#475569", maxLines = 3, anchor = "start", weight = 400) {
  const lines = wrap(value, maxChars, maxLines);
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? 19 : 0}">${esc(line)}</tspan>`).join("")}</text>`;
}

function paletteFor(topicId) {
  if (/hardware/i.test(topicId)) return palettes.hardware;
  if (/impacts/i.test(topicId)) return palettes.impact;
  if (/application/i.test(topicId)) return palettes.application;
  if (/project/i.test(topicId)) return palettes.project;
  if (/managing-data/i.test(topicId)) return palettes.data;
  if (/networks/i.test(topicId)) return palettes.network;
  return palettes.general;
}

function collectItems(lesson) {
  const comparison = lesson.blocks.find((block) => block.type === "comparison" && block.items.length >= 2);
  if (comparison) {
    return {
      mode: "compare",
      label: comparison.title || "Compare the options",
      items: comparison.items.slice(0, 3).map((item) => ({
        label: item.label,
        detail: item.points.slice(0, 2).join(" · "),
      })),
    };
  }

  const table = lesson.blocks.find((block) => block.type === "table" && block.rows.length >= 2);
  if (table) {
    const headers = table.headers;
    const heading = headers[0] || "Key idea";
    const detailIndexes = headers.slice(1).map((_, index) => index + 1).slice(0, 2);
    const rows = table.rows.slice(0, 4).map((row) => ({
      label: row[0],
      detail: detailIndexes.map((index) => `${headers[index]}: ${row[index]}`).filter((s) => !s.endsWith(": ")).join(" · "),
    }));
    const isProcess = /step|stage|phase|sequence|order/i.test(heading)
      || /process|lifecycle|workflow|troubleshoot|plan of action|life of/i.test(lesson.title);
    const isHierarchy = /hierarchy|level|tier/i.test(heading)
      || /hierarchy|system types|computer systems/i.test(lesson.title);
    return { mode: isProcess ? "flow" : isHierarchy ? "layers" : "cards", label: table.headers[0], items: rows };
  }

  const terms = lesson.blocks.find((block) => block.type === "keyTerms" && block.items.length >= 2);
  if (terms) {
    return {
      mode: "cards",
      label: "Core ideas",
      items: terms.items.slice(0, 4).map((item) => ({ label: item.term, detail: item.definition })),
    };
  }

  const list = lesson.blocks.find((block) => block.type === "list" && block.items.length >= 2);
  if (list) {
    return { mode: "flow", label: "Key steps and checks", items: list.items.slice(0, 4).map((item, i) => ({ label: `Step ${i + 1}`, detail: item })) };
  }

  const questions = lesson.blocks.filter((block) => block.type === "quizQuestion").slice(0, 4);
  if (questions.length >= 2) {
    return {
      mode: "cards",
      label: "Revision checkpoints",
      items: questions.map((block, i) => ({ label: `Check ${i + 1}`, detail: block.question.text })),
    };
  }

  const headings = lesson.blocks.filter((block) => block.type === "heading").slice(0, 4);
  return { mode: "cards", label: "Lesson map", items: headings.map((block) => ({ label: block.text, detail: "Connect this idea to the worked example and your check questions." })) };
}

function renderCompare(items, colors) {
  const gap = 18;
  const margin = 30;
  const width = (700 - gap * (items.length - 1)) / items.length;
  return items.map((item, index) => {
    const x = margin + index * (width + gap);
    const title = textLines(item.label, x + 16, 151, Math.floor(width / 13), 17, colors[index % 2], 2, "start", 700);
    const detail = textLines(item.detail, x + 16, 194, Math.floor(width / 8.2), 12, "#334155", 4);
    return `<rect x="${x}" y="115" width="${width}" height="177" rx="18" fill="#fff" stroke="${index % 2 ? colors[1] : colors[0]}" stroke-opacity=".35" stroke-width="2"/><rect x="${x}" y="115" width="${width}" height="12" rx="6" fill="${index % 2 ? colors[1] : colors[0]}"/>${title}${detail}`;
  }).join("");
}

function renderFlow(items, colors) {
  const visible = items.slice(0, 4);
  const cardWidth = 157;
  const start = 28;
  return visible.map((item, index) => {
    const x = start + index * 178;
    const accent = index % 2 ? colors[1] : colors[0];
    const title = textLines(item.label, x + 12, 178, 16, 15, "#0f172a", 2, "middle", 700);
    const detail = textLines(item.detail, x + 12, 221, 20, 12, "#475569", 3, "middle");
    const arrow = index < visible.length - 1
      ? `<path d="M${x + cardWidth + 2} 191h17m-7-7 7 7-7 7" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
      : "";
    return `<rect x="${x}" y="127" width="${cardWidth}" height="161" rx="18" fill="#fff" stroke="${accent}" stroke-opacity=".35" stroke-width="2"/><circle cx="${x + cardWidth / 2}" cy="153" r="15" fill="${accent}"/><text x="${x + cardWidth / 2}" y="158" text-anchor="middle" fill="#fff" font-family="Arial" font-size="13" font-weight="700">${index + 1}</text>${title}${detail}${arrow}`;
  }).join("");
}

function renderLayers(items, colors) {
  const visible = items.slice(0, 4);
  return visible.map((item, index) => {
    const y = 118 + index * 45;
    const accent = index % 2 ? colors[1] : colors[0];
    return `<rect x="74" y="${y}" width="612" height="38" rx="10" fill="${index % 2 ? "#eef2ff" : "#ecfeff"}"/><rect x="74" y="${y}" width="10" height="38" rx="5" fill="${accent}"/>${textLines(item.label, 102, y + 24, 24, 15, "#0f172a", 1, "start", 700)}${textLines(item.detail, 360, y + 23, 60, 12, "#475569", 1)}`;
  }).join("");
}

function renderWorkspace(items, colors) {
  const visible = items.slice(0, 4);
  const positions = [[62, 133], [394, 133], [62, 217], [394, 217]];
  return `<rect x="28" y="110" width="704" height="194" rx="18" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><rect x="28" y="110" width="704" height="31" rx="18" fill="#e2e8f0"/><circle cx="49" cy="125" r="5" fill="#fb7185"/><circle cx="66" cy="125" r="5" fill="#fbbf24"/><circle cx="83" cy="125" r="5" fill="#34d399"/>${visible.map((item, index) => {
    const [x, y] = positions[index].map((v) => v + 10);
    const accent = index % 2 ? colors[1] : colors[0];
    return `<rect x="${x}" y="${y}" width="304" height="70" rx="12" fill="${index % 2 ? "#eef2ff" : "#ecfdf5"}"/><circle cx="${x + 22}" cy="${y + 22}" r="10" fill="${accent}"/>${textLines(item.label, x + 42, y + 26, 27, 14, "#0f172a", 1, "start", 700)}${textLines(item.detail, x + 16, y + 49, 41, 11, "#475569", 2)}`;
  }).join("")}`;
}

function renderCards(items, colors) {
  const visible = items.slice(0, 4);
  const positions = [[34, 122], [394, 122], [34, 212], [394, 212]];
  return visible.map((item, index) => {
    const [x, y] = positions[index];
    const accent = index % 2 ? colors[1] : colors[0];
    return `<rect x="${x}" y="${y}" width="332" height="78" rx="16" fill="#fff" stroke="${accent}" stroke-opacity=".26" stroke-width="2"/><circle cx="${x + 26}" cy="${y + 25}" r="14" fill="${accent}"/><text x="${x + 26}" y="${y + 30}" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12" font-weight="700">${index + 1}</text>${textLines(item.label, x + 50, y + 27, 32, 14, "#0f172a", 1, "start", 700)}${textLines(item.detail, x + 50, y + 52, 43, 11, "#475569", 2)}`;
  }).join("");
}

function visualFor(lesson, topicId) {
  const { mode, label, items } = collectItems(lesson);
  const colors = paletteFor(topicId);
  const title = lesson.title.length > 52 ? `${lesson.title.slice(0, 49)}…` : lesson.title;
  const titleSvg = textLines(title, 36, 68, 56, 23, "#0f172a", 1, "start", 700);
  const category = esc(label.length > 52 ? `${label.slice(0, 49)}…` : label);
  const body = mode === "compare" ? renderCompare(items, colors)
    : mode === "flow" ? renderFlow(items, colors)
      : mode === "layers" ? renderLayers(items, colors)
        : /application/i.test(topicId) ? renderWorkspace(items, colors)
          : renderCards(items, colors);
  const aria = esc(`${lesson.title}: visual model showing ${items.slice(0, 4).map((item) => item.label).join(", ")}`);
  const svg = `<svg viewBox="0 0 760 320" role="img" aria-label="${aria}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto"><title>${aria}</title><rect x="8" y="8" width="744" height="304" rx="24" fill="#f8fafc" stroke="#dbe4f0" stroke-width="2"/><rect x="28" y="20" width="116" height="22" rx="11" fill="${colors[2]}"/><text x="86" y="35" text-anchor="middle" fill="${colors[0]}" font-family="Arial" font-size="10" font-weight="700" letter-spacing="1.4">VISUAL MODEL</text>${titleSvg}<text x="36" y="94" fill="${colors[0]}" font-family="Arial" font-size="12" font-weight="700">${category.toUpperCase()}</text>${body}</svg>`;
  const caption = `Use this visual to review the key ideas from ${lesson.title}. Check how each label connects to the example and explanation in the lesson.`;
  return {
    type: "richText",
    heading: `Visual model: ${lesson.title}`,
    html: `<figure style="margin:1.25rem 0;padding:.75rem;border:1px solid #dbe4f0;border-radius:16px;background:linear-gradient(135deg,#f8fafc,#eef2ff);overflow:hidden">${svg}<figcaption style="margin:.65rem .25rem .15rem;color:#475569;font-size:.93rem;line-height:1.55">${esc(caption)}</figcaption></figure>`,
  };
}

function insertVisual(lesson, topicId, dryRun) {
  const existingIndex = lesson.blocks.findIndex((block) => block.type === "richText" && block.heading === `Visual model: ${lesson.title}`);
  const visual = visualFor(lesson, topicId);
  if (existingIndex >= 0) {
    if (lesson.blocks[existingIndex].html === visual.html) return false;
    if (!dryRun) lesson.blocks[existingIndex] = visual;
    return true;
  }
  const firstQuiz = lesson.blocks.findIndex((block) => block.type === "quizQuestion");
  const workedExample = lesson.blocks.findIndex((block) => block.type === "heading" && /worked example|visual worked example/i.test(block.text));
  const terms = lesson.blocks.findLastIndex((block) => block.type === "keyTerms");
  let at = workedExample >= 0 ? workedExample : terms >= 0 ? terms + 1 : firstQuiz >= 0 ? firstQuiz : lesson.blocks.length;
  if (firstQuiz >= 0) at = Math.min(at, firstQuiz);
  if (!dryRun) lesson.blocks.splice(at, 0, visual);
  return true;
}

const dryRun = process.argv.includes("--dry-run");
const targets = [
  { year: 11, file: "lib/content/data/year-11-applied-it-general.json", indent: 1 },
  { year: 12, file: "lib/content/data/year-12-applied-it-general.json", indent: 2 },
];

let added = 0;
for (const target of targets) {
  const data = JSON.parse(readFileSync(target.file, "utf8"));
  let yearAdded = 0;
  for (const unit of data.units) {
    for (const topic of unit.topics) {
      if (topic.id === "design-concepts") continue;
      for (const lesson of topic.lessons) {
        if (insertVisual(lesson, topic.id, dryRun)) yearAdded += 1;
      }
    }
  }
  if (!dryRun && yearAdded) writeFileSync(target.file, `${JSON.stringify(data, null, target.indent)}\n`);
  added += yearAdded;
  console.log(`Year ${target.year}: ${yearAdded} visual models ${dryRun ? "would be added" : "added"}.`);
}
console.log(`Total: ${added} visual models ${dryRun ? "would be added" : "added"}.`);
