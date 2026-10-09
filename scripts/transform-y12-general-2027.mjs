// Converts Clayton's Year 12 AIT General 2027 lesson decks (.pptx, one per lesson,
// named T{term}W{week}_L{lesson}_{Slug}.pptx) into the site's lesson-block schema
// and merges them into lib/content/data/year-12-applied-it-general.json, replacing
// each affected topic's `lessons` array (topic id/title/description are kept as-is).
//
// The decks all follow one fixed 9-slide template (verified across all 56 source
// files before writing this script):
//   1 title/context   2 objective+criteria   3 key-terms table   4 worked example
//   5 synthesis        6 test tip             7 practice questions (always exactly 2)
//   8 marking key table (one "Question N" divider row per question)
//   9 self-check + next-step link
//
// Re-run this whenever Clayton drops a fresh copy of the deck folder.
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import os from "os";

const SRC_BASE =
  "D:\\OneDrive - Catholic Education Western Australia\\General - Digital Technologies Master [8165]\\AIT\\Year 12\\Assessment Tasks 2027 GENERAL\\12 AIT General Content";
const OUT_PATH = path.resolve("lib/content/data/year-12-applied-it-general.json");

const TOPIC_BY_BREADCRUMB = {
  "3|project management": "project-management-u3",
  "3|impacts of technology": "impacts-of-technology-u3",
  "3|design concepts": "design-concepts",
  "3|application skills": "application-skills-u3",
  "3|hardware": "hardware",
  "4|application skills": "application-skills-u4",
  "4|project management": "project-management-u4",
  "4|managing data": "managing-data",
  "4|impacts of technology": "impacts-of-technology-u4",
  "4|networks": "networks",
};

// T1W6_L3_Audio_Software_Features's own slide breadcrumb says "Unit 4" but it lives
// in the Term 1 (Unit 3) folder alongside its Unit-3-tagged siblings (file formats,
// software management/licences) and is taught in that same week 6 block — almost
// certainly a copy-paste typo in that one slide. Filed under Unit 3 Application
// Skills; flagged in the run summary either way so Clayton can double check.
const TOPIC_OVERRIDES = {
  T1W6_L3_Audio_Software_Features: "application-skills-u3",
};

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Extracts each slide as an ordered array of tokens: {t:"p", text} | {t:"table", headers, rows} */
function extractSlides(unpackedDir) {
  const presXml = fs.readFileSync(`${unpackedDir}/ppt/presentation.xml`, "utf8");
  const relsXml = fs.readFileSync(`${unpackedDir}/ppt/_rels/presentation.xml.rels`, "utf8");
  const relMap = {};
  const relRegex = /<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g;
  let rm;
  while ((rm = relRegex.exec(relsXml)) !== null) relMap[rm[1]] = rm[2];
  const slideIds = [];
  const sldIdRegex = /<p:sldId[^>]*r:id="([^"]+)"/g;
  let sm;
  while ((sm = sldIdRegex.exec(presXml)) !== null) slideIds.push(sm[1]);
  const slideFiles = slideIds.map((rid) => `${unpackedDir}/ppt/${relMap[rid]}`);

  return slideFiles.map((f) => {
    let xml = fs.readFileSync(f, "utf8").replace(/<a:t\/>/g, "<a:t></a:t>");
    const tokens = [];
    let i = 0;
    while (i < xml.length) {
      const tblStart = xml.indexOf("<a:tbl>", i);
      const chunkEnd = tblStart === -1 ? xml.length : tblStart;
      const chunk = xml.slice(i, chunkEnd);
      const paraRegex = /<a:p>([\s\S]*?)<\/a:p>/g;
      let pm;
      while ((pm = paraRegex.exec(chunk)) !== null) {
        let text = "";
        const tRegex = /<a:t>([\s\S]*?)<\/a:t>/g;
        let tm;
        while ((tm = tRegex.exec(pm[1])) !== null) text += decode(tm[1]);
        if (text.trim()) tokens.push({ t: "p", text: text.trim() });
      }
      if (tblStart === -1) break;
      const tblEnd = xml.indexOf("</a:tbl>", tblStart);
      const tblXml = xml.slice(tblStart, tblEnd + "</a:tbl>".length);
      const rowRegex = /<a:tr[^>]*>([\s\S]*?)<\/a:tr>/g;
      let rowM;
      const allRows = [];
      while ((rowM = rowRegex.exec(tblXml)) !== null) {
        const cellRegex = /<a:tc[^>]*>([\s\S]*?)<\/a:tc>/g;
        let cellM;
        const cells = [];
        while ((cellM = cellRegex.exec(rowM[1])) !== null) {
          const cp = /<a:p>([\s\S]*?)<\/a:p>/g;
          let cpm;
          const parts = [];
          while ((cpm = cp.exec(cellM[1])) !== null) {
            let t = "";
            const tRegex = /<a:t>([\s\S]*?)<\/a:t>/g;
            let tm;
            while ((tm = tRegex.exec(cpm[1])) !== null) t += decode(tm[1]);
            if (t) parts.push(t);
          }
          cells.push(parts.join(" ").trim());
        }
        allRows.push(cells);
      }
      tokens.push({ t: "table", headers: allRows[0] ?? [], rows: allRows.slice(1) });
      i = tblEnd + "</a:tbl>".length;
    }
    return tokens;
  });
}

/** Drops the generic slide-type label (token 0) and the "AIT General Year 12..." breadcrumb (token 2). */
function stripHeader(tokens) {
  const heading = tokens[1]?.t === "p" ? tokens[1].text : undefined;
  const body = tokens.slice(3);
  return { heading, body };
}

/**
 * Renders a run of paragraph tokens as HTML, bolding a short "label" line that's
 * immediately followed by its longer explanation (e.g. "Scope" / "One 30-second
 * reel..."), which is how the worked-example and synthesis slides present things.
 */
function paragraphsToRichText(tokens) {
  const texts = tokens.filter((t) => t.t === "p").map((t) => t.text);
  const parts = [];
  for (let i = 0; i < texts.length; i++) {
    const cur = texts[i];
    const next = texts[i + 1];
    if (cur.length <= 25 && !/[.?!]$/.test(cur) && next && next.length >= 30) {
      parts.push(`<p><strong>${cur}</strong> — ${next}</p>`);
      i++;
    } else {
      parts.push(`<p>${cur}</p>`);
    }
  }
  return parts.join("");
}

function buildLesson(file, slides, topicId, lessonIndexInTopic) {
  const title = file.slug.replace(/_/g, " ");
  const lessonId = `${topicId}-${lessonIndexInTopic}-${slugify(title)}`;
  const blocks = [];

  // Slide 1: title/context (no "AIT General Year 12" breadcrumb here — different shape)
  const s1 = slides[0].filter((t) => t.t === "p").map((t) => t.text);
  if (s1[1]) blocks.push({ type: "paragraph", text: s1[1] });
  if (s1[3]) blocks.push({ type: "callout", heading: "How to use this lesson", text: s1[3] });

  // Slide 2: Lesson Objective + Success Criteria
  {
    const { body } = stripHeader(slides[1]);
    const texts = body.filter((t) => t.t === "p").map((t) => t.text);
    const objIdx = texts.findIndex((t) => t === "Lesson Objective");
    const critIdx = texts.findIndex((t) => t === "Success Criteria");
    const objective = objIdx !== -1 ? texts.slice(objIdx + 1, critIdx === -1 ? undefined : critIdx).join(" ") : "";
    const criteria = critIdx !== -1 ? texts.slice(critIdx + 1) : [];
    if (objective) blocks.push({ type: "callout", heading: "Lesson objective", text: objective });
    if (criteria.length) {
      blocks.push({ type: "heading", text: "Success criteria", level: 3 });
      blocks.push({ type: "list", style: "bullet", items: criteria });
    }
  }

  // Slide 3: key terms / definitions table
  {
    const { heading, body } = stripHeader(slides[2]);
    if (heading) blocks.push({ type: "heading", text: heading, level: 3 });
    const table = body.find((t) => t.t === "table");
    if (table) {
      if (table.headers.length === 2) {
        blocks.push({
          type: "keyTerms",
          items: table.rows.map((r) => ({ term: r[0] ?? "", definition: r[1] ?? "" })),
        });
      } else {
        blocks.push({ type: "table", headers: table.headers, rows: table.rows });
      }
    }
  }

  // Slide 4: worked example
  {
    const { heading, body } = stripHeader(slides[3]);
    if (heading) blocks.push({ type: "heading", text: `Worked example: ${heading}`, level: 3 });
    const html = paragraphsToRichText(body);
    if (html) blocks.push({ type: "richText", html });
  }

  // Slide 5: synthesis (table in ~1/3 of decks, prose in the rest)
  {
    const { heading, body } = stripHeader(slides[4]);
    if (heading) blocks.push({ type: "heading", text: heading, level: 3 });
    const table = body.find((t) => t.t === "table");
    if (table) {
      blocks.push({ type: "table", headers: table.headers, rows: table.rows });
    } else {
      const html = paragraphsToRichText(body);
      if (html) blocks.push({ type: "richText", html });
    }
  }

  // Slide 6: test tip
  {
    const { heading, body } = stripHeader(slides[5]);
    blocks.push({ type: "heading", text: heading ? `Test tip: ${heading}` : "Test tip", level: 3 });
    const html = paragraphsToRichText(body);
    if (html) blocks.push({ type: "richText", html });
  }

  // Slide 7 + 8: practice questions + marking key, merged into quizQuestion blocks
  {
    const { body: q } = stripHeader(slides[6]);
    const qTexts = q.filter((t) => t.t === "p").map((t) => t.text);
    const q1MarkerIdx = qTexts.findIndex((t) => /^Question 1 \(/.test(t));
    const q2MarkerIdx = qTexts.findIndex((t) => /^Question 2 \(/.test(t));
    const scenario = qTexts.slice(0, q1MarkerIdx).join(" ");
    const marks1 = Number((qTexts[q1MarkerIdx].match(/\((\d+)\s*marks?\)/i) ?? [])[1]);
    const marks2 = Number((qTexts[q2MarkerIdx].match(/\((\d+)\s*marks?\)/i) ?? [])[1]);
    const endIdx = qTexts.findIndex((t) => t.startsWith("Write your answers"));
    const q1Text = qTexts.slice(q1MarkerIdx + 1, q2MarkerIdx).join(" ");
    const q2Text = qTexts.slice(q2MarkerIdx + 1, endIdx === -1 ? undefined : endIdx).join(" ");

    if (scenario) blocks.push({ type: "paragraph", text: scenario });

    // Marking key from slide 8
    const { body: mkBody } = stripHeader(slides[7]);
    const table = mkBody.find((t) => t.t === "table");
    const explanations = { 1: "", 2: "" };
    if (table) {
      let current = 0;
      let note = { 1: "", 2: "" };
      const lines = { 1: [], 2: [] };
      for (const row of table.rows.length ? [table.headers, ...table.rows] : []) {
        const [desc, marks] = row;
        const qMatch = desc?.match(/^Question (\d+)\s*:?\s*(.*)$/);
        if (qMatch) {
          current = Number(qMatch[1]);
          if (qMatch[2]) note[current] = qMatch[2];
          continue;
        }
        if (current === 1 || current === 2) {
          if (marks !== undefined && marks !== "" && desc !== undefined) {
            const n = Number(marks);
            const unit = n === 1 ? "mark" : "marks";
            lines[current].push(`${marks} ${unit} – ${desc}`);
          }
        }
      }
      for (const n of [1, 2]) {
        const parts = [];
        if (note[n]) parts.push(note[n]);
        parts.push(...lines[n]);
        explanations[n] = parts.join("\n");
      }
    }

    blocks.push({
      type: "quizQuestion",
      question: {
        id: `${lessonId}-q1`,
        questionType: "extended",
        text: q1Text,
        marks: Number.isFinite(marks1) ? marks1 : undefined,
        explanation: explanations[1] || undefined,
      },
    });
    blocks.push({
      type: "quizQuestion",
      question: {
        id: `${lessonId}-q2`,
        questionType: "extended",
        text: q2Text,
        marks: Number.isFinite(marks2) ? marks2 : undefined,
        explanation: explanations[2] || undefined,
      },
    });
  }

  // Slide 9: self-check + next-step
  {
    const { heading, body } = stripHeader(slides[8]);
    const texts = body.filter((t) => t.t === "p").map((t) => t.text);
    const checkIdx = texts.findIndex((t) => t === "Check yourself");
    const ifNotIdx = texts.findIndex((t) => t.startsWith("If not"));
    const sectionHeaderIdx = ifNotIdx !== -1 ? ifNotIdx + 1 : -1;
    const checklist = checkIdx !== -1 ? texts.slice(checkIdx + 1, ifNotIdx === -1 ? undefined : ifNotIdx + 1) : [];
    const sectionHeader = sectionHeaderIdx !== -1 ? texts[sectionHeaderIdx] : undefined;
    const sectionBody = sectionHeaderIdx !== -1 ? texts.slice(sectionHeaderIdx + 1).join(" ") : "";

    if (heading) blocks.push({ type: "heading", text: heading, level: 3 });
    if (checklist.length) blocks.push({ type: "list", style: "bullet", items: checklist });
    if (sectionHeader && sectionBody) {
      blocks.push({ type: "callout", heading: sectionHeader, text: sectionBody });
    }
  }

  return { id: lessonId, title, blocks };
}

function main() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "y12gen-"));
  const files = [];
  for (const termDir of fs.readdirSync(SRC_BASE)) {
    const full = path.join(SRC_BASE, termDir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const f of fs.readdirSync(full)) {
      if (!f.endsWith(".pptx")) continue;
      const m = f.match(/^T(\d+)W(\d+)_L(\d+)_(.+)\.pptx$/);
      if (!m) {
        console.error(`SKIPPING (name doesn't match pattern): ${f}`);
        continue;
      }
      files.push({
        path: path.join(full, f),
        base: f.replace(/\.pptx$/, ""),
        term: Number(m[1]),
        week: Number(m[2]),
        lesson: Number(m[3]),
        slug: m[4],
      });
    }
  }
  files.sort((a, b) => a.term - b.term || a.week - b.week || a.lesson - b.lesson);

  const byTopic = {};
  const flags = [];

  for (const file of files) {
    const dest = path.join(tmpRoot, file.base);
    fs.mkdirSync(dest, { recursive: true });
    execSync(`unzip -q -o "${file.path}" -d "${dest}"`, { shell: "C:\\Program Files\\Git\\bin\\bash.exe" });
    const slides = extractSlides(dest);
    if (slides.length !== 9) {
      flags.push(`${file.base}: expected 9 slides, found ${slides.length} — SKIPPED`);
      continue;
    }

    const breadcrumb = slides[0].find((t) => t.t === "p")?.text ?? "";
    const bcMatch = breadcrumb.match(/Unit\s*(\d)\s*\|\s*([a-z ]+)/i);
    const bcKey = bcMatch ? `${bcMatch[1]}|${bcMatch[2].trim().toLowerCase()}` : null;
    let topicId = TOPIC_OVERRIDES[file.base] ?? (bcKey ? TOPIC_BY_BREADCRUMB[bcKey] : undefined);
    if (TOPIC_OVERRIDES[file.base] && bcKey && TOPIC_BY_BREADCRUMB[bcKey] !== topicId) {
      flags.push(`${file.base}: breadcrumb says "${breadcrumb}" but filed under override topic "${topicId}"`);
    }
    if (!topicId) {
      flags.push(`${file.base}: could not classify topic from breadcrumb "${breadcrumb}" — SKIPPED`);
      continue;
    }

    byTopic[topicId] = byTopic[topicId] ?? [];
    byTopic[topicId].push({ file, slides });
  }

  const content = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
  const summary = [];
  for (const unit of content.units) {
    for (const topic of unit.topics) {
      const entries = byTopic[topic.id];
      if (!entries) continue;
      const newLessons = entries.map((e, idx) => buildLesson(e.file, e.slides, topic.id, idx + 1));
      topic.lessons = newLessons;
      summary.push(`${topic.id} (${unit.id}): ${newLessons.length} lessons`);
      delete byTopic[topic.id];
    }
  }
  const unmatched = Object.keys(byTopic);
  if (unmatched.length) {
    console.error("Topic ids produced by the decks but not found in the existing course JSON:", unmatched);
    process.exit(1);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(content, null, 2));
  console.log("Flags:\n" + flags.join("\n"));
  console.log("\nSummary:\n" + summary.join("\n"));
  console.log(`\nWritten to ${OUT_PATH}`);

  fs.rmSync(tmpRoot, { recursive: true, force: true });
}

main();
