import fs from "fs";

const BASE = "D:\\OneDrive\\Personal\\Work\\archive\\11-ait-general-course\\db\\";

function extractArrays(filePath, names) {
  const txt = fs.readFileSync(filePath, "utf8");
  const out = {};
  for (const name of names) {
    const marker = `const ${name} = [`;
    const start = txt.indexOf(marker);
    if (start === -1) throw new Error(`${name} not found in ${filePath}`);
    let i = start + marker.length - 1; // at '['
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
      if (c === "[") depth++;
      if (c === "]") {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    const literal = txt.slice(start + marker.length - 1, i);
    out[name] = new Function(`return (${literal});`)();
  }
  return out;
}

const { topic1Lessons, topic2Lessons } = extractArrays(BASE + "seed-lessons.ts", [
  "topic1Lessons",
  "topic2Lessons",
]);
const { topic3Lessons, topic4Lessons, topic5Lessons } = extractArrays(
  BASE + "seed-topics-3-5.ts",
  ["topic3Lessons", "topic4Lessons", "topic5Lessons"]
);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapQuestion(q) {
  return {
    id: q.id,
    questionType: q.question_type ?? q.type,
    text: q.text,
    options: q.options,
    correctIndex: q.correct_index,
    correctAnswer: q.correct_answer,
    pairs: q.pairs
      ? q.pairs.map((p) => ({ term: p.term ?? p.left, definition: p.definition ?? p.right }))
      : undefined,
    marks: q.marks,
    explanation: q.explanation,
  };
}

function mapBlock(b) {
  switch (b.type) {
    case "heading":
      return { type: "heading", text: b.text, level: b.level };
    case "paragraph":
      return { type: "paragraph", text: b.text };
    case "key_term":
      return { type: "keyTerm", term: b.term, definition: b.definition };
    case "callout":
      return { type: "callout", variant: b.variant, text: b.text };
    case "list":
      return { type: "list", style: b.style, items: b.items };
    case "table":
      return { type: "table", headers: b.headers, rows: b.rows };
    case "divider":
      return { type: "divider" };
    case "exercise_question":
      return { type: "quizQuestion", question: mapQuestion(b) };
    case "task":
      return { type: "task", title: b.title, software: b.software, intro: b.intro, steps: b.steps };
    default:
      return { type: "paragraph", text: `[unmapped block: ${b.type}]` };
  }
}

function mapLesson(lesson, idx) {
  const id = slugify(lesson.title);
  if (lesson.type === "quiz") {
    return {
      id,
      title: lesson.title,
      estimatedMinutes: lesson.estimated_minutes,
      blocks: lesson.content.questions.map((q) => ({
        type: "quizQuestion",
        question: mapQuestion(q),
      })),
    };
  }
  return {
    id,
    title: lesson.title,
    estimatedMinutes: lesson.estimated_minutes,
    blocks: lesson.content.blocks.map(mapBlock),
  };
}

const topics = [
  { title: "Managing Data", lessons: topic1Lessons },
  { title: "Networks", lessons: topic2Lessons },
  { title: "Impacts of Technology", lessons: topic3Lessons },
  { title: "Application Skills", lessons: topic4Lessons },
  { title: "Project Management", lessons: topic5Lessons },
].map((t) => ({
  id: slugify(t.title),
  title: t.title,
  lessons: t.lessons.map(mapLesson),
}));

const content = {
  slug: "year-11-applied-it-general",
  title: "Applied IT — General",
  units: [
    {
      id: "personal-communication",
      title: "Personal Communication",
      subtitle: "Using technology to meet personal needs",
      status: "coming_soon",
      topics: [],
    },
    {
      id: "working-with-others",
      title: "Working with Others",
      subtitle: "Managing data, networks and digital solutions",
      status: "available",
      topics,
    },
  ],
};

fs.writeFileSync(
  "lib/content/data/year-11-applied-it-general.json",
  JSON.stringify(content, null, 2)
);
console.log(
  "General course written. Topics:",
  topics.map((t) => `${t.title} (${t.lessons.length} lessons)`)
);
