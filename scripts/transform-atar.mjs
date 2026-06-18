import fs from "fs";

const BASE = "D:\\OneDrive\\Personal\\Work\\archive\\11-ait-atar-course\\src\\data\\";

function extractObject(filePath, marker) {
  const txt = fs.readFileSync(filePath, "utf8");
  const start = txt.indexOf(marker);
  if (start === -1) throw new Error(`marker not found in ${filePath}`);
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
    if (c === "{" || c === "[") depth++;
    if (c === "}" || c === "]") {
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

const modules = extractObject(BASE + "modules.js", "export const modules = ");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapBlock(b) {
  switch (b.type) {
    case "intro":
      return { type: "paragraph", text: b.text };
    case "section":
      return {
        type: "richText",
        heading: b.title,
        html: b.paragraphs.map((p) => `<p>${p}</p>`).join(""),
      };
    case "keyTerms":
      return { type: "keyTerms", items: b.items };
    case "callout":
      return { type: "callout", variant: b.variant, heading: b.heading, text: b.body };
    case "video":
      return { type: "video", youtubeId: b.youtubeId, title: b.title, caption: b.caption };
    case "grid":
      return {
        type: "grid",
        title: b.title,
        items: b.items.map((it) => ({
          icon: it.icon,
          photo: it.photo,
          label: it.label,
          description: it.description,
        })),
      };
    case "comparison":
      return { type: "comparison", title: b.title, items: b.items };
    case "softwareExamples":
      return {
        type: "softwareExamples",
        title: b.title,
        apps: b.apps.map((a) => ({ name: a.name, logo: a.logo, licence: a.licence, note: a.note })),
      };
    case "formulaBreakdown":
      return {
        type: "formulaBreakdown",
        title: b.title,
        functionName: b.functionName,
        args: b.arguments.map((a) => ({ name: a.name, description: a.description })),
      };
    case "formulaBuilder":
      return {
        type: "formulaBuilder",
        title: b.title,
        instruction: b.instruction,
        context: b.context,
        template: b.template,
      };
    case "scenarioChallenge":
      return {
        type: "scenarioChallenge",
        title: b.title,
        scenario: b.scenario,
        questions: b.questions.map((q) => ({ question: q.question, marks: q.marks })),
      };
    case "spotTheThreat":
      return {
        type: "spotTheThreat",
        title: b.title,
        instruction: b.instruction,
        emails: b.emails.map((e) => ({
          isPhishing: e.isPhishing,
          from: e.from,
          subject: e.subject,
          body: e.body,
          redFlags: e.redFlags,
        })),
      };
    case "codePreview":
      return { type: "codePreview", title: b.title, defaultCode: b.defaultCode, challenge: b.challenge };
    default:
      return { type: "paragraph", text: `[unmapped block: ${b.type}]` };
  }
}

function mapModuleLessons(mod) {
  return mod.lessons.map((lesson, idx) => ({
    id: `${slugify(mod.title)}-${idx + 1}-${slugify(lesson.title)}`,
    title: lesson.title,
    blocks: lesson.blocks.map(mapBlock),
  }));
}

function quizLesson(mod) {
  if (!mod.quiz?.length) return null;
  return {
    id: `${slugify(mod.title)}-quiz`,
    title: `Quiz — ${mod.title}`,
    blocks: mod.quiz.map((q) => ({
      type: "quizQuestion",
      question: {
        id: q.id,
        questionType: "mcq",
        text: q.question,
        options: q.options,
        correctIndex: q.correct,
      },
    })),
  };
}

function extendedLesson(idSuffix, titlePrefix, mod, items) {
  if (!items?.length) return null;
  return {
    id: `${slugify(mod.title)}-${idSuffix}`,
    title: `${titlePrefix} — ${mod.title}`,
    blocks: items.map((q) => ({
      type: "quizQuestion",
      question: {
        id: q.id,
        questionType: "extended",
        text: q.question,
        marks: q.marks,
        explanation: q.modelAnswer,
      },
    })),
  };
}

function mapModule(mod) {
  const lessons = [
    ...mapModuleLessons(mod),
    quizLesson(mod),
    extendedLesson("practice", "Practice Questions", mod, mod.practiceQuestions),
    extendedLesson("exam", "Exam Practice", mod, mod.examPractice),
  ].filter(Boolean);
  return {
    id: slugify(mod.title) + "-" + mod.id,
    title: mod.title,
    description: mod.shortDescription,
    lessons,
  };
}

const unit1Topics = Object.values(modules)
  .filter((m) => m.unit === 1)
  .map(mapModule);
const unit2Topics = Object.values(modules)
  .filter((m) => m.unit === 2)
  .map(mapModule);

const content = {
  slug: "year-11-applied-it-atar",
  title: "Applied IT — ATAR",
  units: [
    {
      id: "unit-1-media-ict",
      title: "Unit 1 — Application of Media and Information Communications Technology",
      status: "available",
      topics: unit1Topics,
    },
    {
      id: "unit-2-digital-tech-business",
      title: "Unit 2 — Digital Technology in Business",
      status: "available",
      topics: unit2Topics,
    },
  ],
};

fs.writeFileSync(
  "lib/content/data/year-11-applied-it-atar.json",
  JSON.stringify(content, null, 2)
);
console.log(
  "ATAR course written. Topics:",
  [...unit1Topics, ...unit2Topics].map((t) => `${t.title} (${t.lessons.length} lessons)`)
);
