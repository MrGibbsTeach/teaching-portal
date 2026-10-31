// Shared helpers for the lesson-rebuild scripts (card/interactive block builders).
export const h = (text, level = 2) => ({ type: "heading", text, level });
export const mcq = (id, text, options, correctIndex, explanation) => ({
  type: "quizQuestion", question: { id, questionType: "mcq", text, options, correctIndex, explanation },
});
export const tf = (id, text, correctAnswer, explanation) => ({
  type: "quizQuestion", question: { id, questionType: "true_false", text, correctAnswer, explanation },
});
export const criteria = (items) => ({
  type: "infoCards", title: "By the end of this lesson you can", columns: 1,
  cards: items.map((t, i) => ({ icon: ["🎯", "🧭", "✅"][i] ?? "🎯", heading: t, text: "", tone: "blue" })),
});
export const testTip = (question, weak, weakWhy, strong, strongWhy) => ({
  type: "infoCards", title: "Test tip: what earns the marks", intro: question, columns: 2,
  cards: [
    { icon: "⚠️", heading: `Earns 0 or 1 mark: ${weak}`, text: weakWhy, tone: "red" },
    { icon: "⭐", heading: "Earns full marks", text: `${strong} ${strongWhy}`.trim(), tone: "green" },
  ],
});
export const scenario = (title, text) => ({
  type: "infoCards", columns: 1, part: "activities",
  cards: [{ icon: "📂", heading: `Scenario: ${title}`, text: `${text} Answer the questions below using this scenario.`, tone: "amber" }],
});
export const recap = (cards) => ({ type: "infoCards", columns: 1, cards });
export const video = (title, minutes, brief, watchFor) => ({ type: "videoSlot", title, minutes, brief, watchFor });
export const reducedMotion = "@media (prefers-reduced-motion: reduce){*{animation:none!important}}";
export const pick = (lesson, pred) => lesson.blocks.find(pred);
export const extended = (l) => l.blocks.filter((b) => b.type === "quizQuestion" && b.question.questionType === "extended");
export const keyTerms = (l) => pick(l, (b) => b.type === "keyTerms");
export const hook = (l) => l.blocks[0];
/** Assessment tasks and dates change every year, so they never live in lessons. */
export const isAssessmentRef = (b) => !!b && b.type === "callout" && /^(Task \d|EST preparation)/i.test(b.heading ?? "");
export const last = (l) => { const b = l.blocks[l.blocks.length - 1]; return isAssessmentRef(b) ? null : b; };

// ---------- harvest: carry over the parts of an existing lesson that need no re-authoring ----------
const strip = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
export const harvest = (l) => {
  const b = l.blocks;
  const firstList = b.find((x) => x.type === "list");
  const tipBlock = b.find((x) => x.type === "richText" && /Earns full marks/.test(x.html ?? ""));
  let testTipBlock = null;
  if (tipBlock) {
    const t = strip(tipBlock.html);
    const q = (t.match(/Question:\s*(.*?\(\d+\s*marks?\))/) ?? [])[1] ?? "";
    const rest = t.slice(t.indexOf("Earns 0 or 1 mark") + "Earns 0 or 1 mark".length);
    const [weak, strong] = rest.split(/Earns full marks/);
    testTipBlock = {
      type: "infoCards", title: "Test tip: what earns the marks", intro: q, columns: 2,
      cards: [
        { icon: "⚠️", heading: "Earns 0 or 1 mark", text: (weak ?? "").replace(/^\s*[—-]\s*/, "").trim(), tone: "red" },
        { icon: "⭐", heading: "Earns full marks", text: (strong ?? "").replace(/^\s*[—-]\s*/, "").trim(), tone: "green" },
      ],
    };
  }
  const tipIdx = b.indexOf(tipBlock);
  const scenarioPara = tipIdx >= 0 ? b.slice(tipIdx + 1).find((x) => x.type === "paragraph") : null;
  const scenarioBlock = scenarioPara
    ? { type: "infoCards", columns: 1, part: "activities", cards: [{ icon: "📂", heading: "Scenario", text: `${scenarioPara.text} Answer the questions below using this scenario.`, tone: "amber" }] }
    : null;
  const mentorNotes = b.filter((x) => x.type === "callout" && x.variant === "senior-wisdom");
  const keep = (t) => b.filter((x) => t.includes(x.type));
  return {
    hook: b[0],
    criteria: firstList ? criteria(firstList.items) : null,
    keyTerms: b.find((x) => x.type === "keyTerms"),
    tables: keep(["table"]),
    animations: keep(["animation3d"]),
    interactive: keep(["interactiveDiagram", "codeExercise", "formulaBuilder", "spotTheThreat", "codePreview", "checkpointVideo"]),
    tasks: keep(["task"]),
    mentor: mentorNotes,
    testTip: testTipBlock,
    scenario: scenarioBlock,
    extended: extended(l),
    last: isAssessmentRef(b[b.length - 1]) ? null : b[b.length - 1],
  };
};
export const standardRecap = (a, bText, c) => recap([
  { icon: "📌", heading: a[0], text: a[1], tone: "blue" },
  { icon: "🧭", heading: bText[0], text: bText[1], tone: "purple" },
  { icon: "🎯", heading: "Aim for", text: c, tone: "green" },
]);
export const flip = (title, cards) => ({ type: "flipCards", title, instruction: "Answer first, then flip.", cards });
export const sorter = (title, instruction, categories, items) => ({ type: "sorter", title, instruction, categories, items });
export const seq = (title, instruction, items, explanation) => ({ type: "sequence", title, instruction, items, explanation });
export const branch = (title, intro, steps) => ({ type: "branchingScenario", title, intro, steps });
export const fig = (title, alt, svg, caption) => ({ type: "svgFigure", title, alt, svg, caption });
export const assemble = (l, parts) => {
  // parts: ordered array; strings select harvested pieces, objects are authored blocks.
  const hv = harvest(l);
  if (parts.includes("criteria") && !hv.criteria) {
    throw new Error(`${l.id}: already rebuilt (the original goals list is gone). Restore the original data first: git checkout <commit-before-rebuild> -- lib/content/data/year-12-applied-it-general.json`);
  }
  const out = [];
  for (const p of parts) {
    if (p == null) continue;
    if (typeof p === "string") {
      const v = hv[p];
      if (Array.isArray(v)) out.push(...v); else if (v) out.push(v);
    } else if (Array.isArray(p)) out.push(...p);
    else out.push(p);
  }
  return out;
};

// ---------- generic animated diagram generators (text is auto-wrapped to fit) ----------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const wrap = (text, max) => {
  const words = String(text).split(/\s+/); const lines = []; let cur = "";
  for (const w of words) { if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }
  if (cur) lines.push(cur); return lines;
};
/** A row of up to 6 boxes that light up in order. steps: [{t: title, s: subtitle}] */
export const stepsSvg = (steps, { numbered = true, colour = "#bfdbfe" } = {}) => {
  const n = steps.length, gap = 14, W = 680, bw = Math.floor((W - 12 - gap * (n - 1)) / n);
  const maxc = Math.max(8, Math.floor((bw - 20) / 6.4));
  const lines = steps.map((s) => wrap(s.s ?? "", maxc)); const tl = steps.map((s) => wrap(s.t, Math.floor(maxc * 0.85)));
  const rows = Math.max(...lines.map((l) => l.length)) + Math.max(...tl.map((l) => l.length));
  const H = 40 + rows * 17 + 40;
  const dur = n * 2;
  let body = `<style>.sg-b{fill:#f1f5f9;stroke:#cbd5e1;stroke-width:2;animation:sg-g ${dur}s infinite}.sg-n{font-size:18px;font-weight:800;fill:#1d4ed8;font-family:system-ui,sans-serif}.sg-t{font-size:13.5px;font-weight:700;fill:#0f172a;font-family:system-ui,sans-serif}.sg-s{font-size:11.5px;fill:#475569;font-family:system-ui,sans-serif}.sg-a{stroke:#94a3b8;stroke-width:3}@keyframes sg-g{0%,${Math.floor(100 / n) - 4}%{fill:${colour}}${Math.floor(100 / n)}%,100%{fill:#f1f5f9}}${"@media (prefers-reduced-motion: reduce){*{animation:none!important}}"}</style>`;
  steps.forEach((s, i) => {
    const x = 6 + i * (bw + gap); let y = 62;
    body += `<rect class="sg-b" style="animation-delay:${i * 2}s" x="${x}" y="22" width="${bw}" height="${H - 44}" rx="14"/>`;
    if (numbered) body += `<text class="sg-n" x="${x + 12}" y="48">${i + 1}</text>`;
    tl[i].forEach((ln) => { body += `<text class="sg-t" x="${x + 12}" y="${y}">${esc(ln)}</text>`; y += 17; });
    lines[i].forEach((ln) => { body += `<text class="sg-s" x="${x + 12}" y="${y + 2}">${esc(ln)}</text>`; y += 15; });
    if (i < n - 1) body += `<line class="sg-a" x1="${x + bw}" y1="${H / 2}" x2="${x + bw + gap}" y2="${H / 2}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
};
/** Two panels with a pulsing label between them. left/right: {t, lines[], fill} ; mid: text */
export const twoPanelSvg = (left, right, mid = "") => {
  const ml = Math.max(left.lines.flatMap((l) => wrap(l, 30)).length, right.lines.flatMap((l) => wrap(l, 30)).length);
  const H = 92 + ml * 19;
  const panel = (p, x) => { let y = 70; let s = `<rect x="${x}" y="14" width="270" height="${H - 28}" rx="16" fill="${p.fill}"/><text x="${x + 16}" y="42" class="tp-t">${esc(p.t)}</text>`; p.lines.flatMap((l) => wrap(l, 30)).forEach((l) => { s += `<text x="${x + 16}" y="${y}" class="tp-s">${esc(l)}</text>`; y += 19; }); return s; };
  return `<svg viewBox="0 0 680 ${H + 24}" xmlns="http://www.w3.org/2000/svg"><style>.tp-t{font:700 14px system-ui,sans-serif;fill:#0f172a}.tp-s{font:12px system-ui,sans-serif;fill:#334155}.tp-w{stroke:#2563eb;stroke-width:3;stroke-dasharray:6 6;fill:none;animation:tp-d 2s linear infinite}@keyframes tp-d{to{stroke-dashoffset:-24}}.tp-m{font:700 12.5px system-ui,sans-serif;fill:#1d4ed8;animation:tp-b 3s infinite}@keyframes tp-b{0%,45%{opacity:1}55%,100%{opacity:.3}}${"@media (prefers-reduced-motion: reduce){*{animation:none!important}}"}</style>${panel(left, 10)}${panel(right, 400)}<path class="tp-w" d="M285 ${H / 2} Q 340 ${H / 2 - 50} 395 ${H / 2}"/><text class="tp-m" x="340" y="${H + 14}" text-anchor="middle">${esc(mid)}</text></svg>`;
};
export const fileSizeLab = (o) => ({ type: "fileSizeLab", ...o });

// ---------- compact helpers + in-place upgrade (used for Year 11 General) ----------
/** Sorter from compact rows: [text, categoryIndex, why] */
export const S = (title, instruction, categories, rows) => sorter(title, instruction, categories, rows.map(([text, category, why]) => ({ text, category, why })));
/** Flip cards from compact rows: [tag, front, back] */
export const F = (title, rows) => flip(title, rows.map(([tag, front, back]) => ({ tag, front, back })));
/** Branching scenario: steps = [[situation, prompt, [[text, correct(bool), feedback], ...]], ...] */
export const B = (title, intro, steps) => branch(title, intro, steps.map(([situation, prompt, choices]) => ({ situation, prompt, choices: choices.map(([text, correct, feedback]) => ({ text, correct, feedback })) })));
export const V = (title, minutes, brief, watchFor) => video(title, minutes, brief, watchFor);
/**
 * Upgrade an existing lesson in place: remove boilerplate "Visual model" filler, add a video placeholder
 * (unless the lesson already has a real video), and insert interactives before "Assessment practice".
 * Skips lessons already upgraded.
 */
export const upgradeInPlace = (l, { video: vid, blocks }) => {
  if (l.blocks.some((b) => b.type === "heading" && b.text === "Try it yourself")) return false;
  l.blocks = l.blocks.filter((b) => !(b.type === "richText" && (b.heading ?? "").startsWith("Visual model") && /Treat each card/.test(b.html ?? "")));
  const hasRealVideo = l.blocks.some((b) => b.type === "video" || b.type === "checkpointVideo");
  if (vid && !hasRealVideo) {
    const li = l.blocks.findIndex((b) => b.type === "list");
    l.blocks.splice(li >= 0 ? li + 1 : 1, 0, vid);
  }
  let at = l.blocks.findIndex((b) => b.type === "heading" && /^Assessment practice/.test(b.text));
  if (at < 0) at = l.blocks.findIndex((b) => b.type === "heading" && /^Test-ready recap/.test(b.text));
  if (at < 0) at = l.blocks.length;
  l.blocks.splice(at, 0, h("Try it yourself"), ...blocks);
  return true;
};
