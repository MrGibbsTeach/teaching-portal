import fs from "fs";

const FOUNDATIONS_HTML =
  "D:\\OneDrive\\Personal\\Work\\archive\\ait-foundations-course\\ait-foundation-course\\index.html";

function extractCourseData() {
  const txt = fs.readFileSync(FOUNDATIONS_HTML, "utf8");
  const marker = "const COURSE_DATA = ";
  const start = txt.indexOf(marker);
  let i = start + marker.length;
  let depth = 0;
  let inStr = false;
  let strCh = "";
  let escaped = false;
  for (; i < txt.length; i++) {
    const c = txt[i];
    if (inStr) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = true;
      strCh = c;
      continue;
    }
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const literal = txt.slice(start + marker.length, i);
  return new Function(`return (${literal});`)();
}

const data = extractCourseData();

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapCheckQuestion(q) {
  return {
    type: "quizQuestion",
    question: {
      questionType: "mcq",
      text: q.question,
      options: q.options.map((o) => o.text),
      correctIndex: q.options.findIndex((o) => o.correct),
      explanation: q.explanation,
    },
  };
}

function mapTryIt(t) {
  if (!t) return null;
  switch (t.type) {
    case "matching":
      return {
        type: "activity",
        title: t.question,
        pairs: t.pairs.map((p) => ({ term: p.left, definition: p.right })),
      };
    case "multipleChoice":
      return {
        type: "quizQuestion",
        question: {
          questionType: "mcq",
          text: t.question,
          options: t.options.map((o) => o.text),
          correctIndex: t.options.findIndex((o) => o.correct),
          explanation: t.explanation,
        },
      };
    case "fillBlank":
      return {
        type: "activity",
        title: t.question,
        answer: t.answer,
        explanation: t.explanation,
      };
    case "ordering":
      return {
        type: "activity",
        title: t.question,
        orderedItems: [...t.items].sort((a, b) => a.order - b.order).map((i) => i.text),
      };
    case "dragDrop":
      return {
        type: "activity",
        title: t.question,
        categories: t.categories.map((c) => ({ label: c.label, items: c.accepts })),
      };
    case "hotspot":
      return {
        type: "activity",
        title: t.question,
        instruction: "Interactive hotspot activity (see archived Foundations app for the original visual version).",
      };
    default:
      return { type: "activity", title: t.question };
  }
}

function mapLearnBlock(b) {
  return { type: "richText", heading: b.heading, html: b.body };
}

function mapLesson(lesson) {
  const blocks = [
    ...lesson.parts.learn.map(mapLearnBlock),
    ...(lesson.parts.tryIt ? [mapTryIt(lesson.parts.tryIt)] : []),
    ...(lesson.parts.check ?? []).map(mapCheckQuestion),
  ];
  return {
    id: lesson.id,
    title: lesson.title,
    estimatedMinutes: lesson.estimatedMinutes,
    blocks,
  };
}

function mapModule(mod) {
  return {
    id: mod.id,
    title: mod.title,
    description: mod.code,
    lessons: mod.lessons.map(mapLesson),
  };
}

const units = data.units.map((u) => ({
  id: u.id,
  title: u.title,
  status: (u.modules?.length ?? 0) > 0 ? "available" : "coming_soon",
  topics: (u.modules ?? []).map(mapModule),
}));

const content = {
  slug: "ait-foundations",
  title: "AIT Foundations",
  units,
};

fs.writeFileSync("lib/content/data/ait-foundations.json", JSON.stringify(content, null, 2));
console.log(
  "Foundations course written. Units:",
  units.map((u) => `${u.title} (${u.topics.length} topics, ${u.status})`)
);
