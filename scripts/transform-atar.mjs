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
const examMeta = extractObject(BASE + "unit1PracticeExam.js", "export const examMeta = ");
const mcqQuestions = extractObject(BASE + "unit1PracticeExam.js", "export const mcqQuestions = ");
const shortAnswerQuestions = extractObject(
  BASE + "unit1PracticeExam.js",
  "export const shortAnswerQuestions = "
);
const extendedAnswer = extractObject(BASE + "unit1PracticeExam.js", "export const extendedAnswer = ");
const examScenario = extractObject(BASE + "unit1PracticeExam.js", "export const scenario = ");
const glossaryTerms = extractObject(BASE + "glossary.js", "export const glossaryTerms = ");

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

function markdownToHtml(md) {
  if (!md) return "";
  const withInline = md.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  const lines = withInline.split("\n");
  const htmlParts = [];
  let listBuffer = [];
  const flushList = () => {
    if (listBuffer.length) {
      htmlParts.push(`<ul>${listBuffer.map((li) => `<li>${li}</li>`).join("")}</ul>`);
      listBuffer = [];
    }
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^-\s/, "").replace(/^\d+\.\s/, ""));
    } else if (trimmed === "") {
      flushList();
    } else {
      flushList();
      htmlParts.push(`<p>${trimmed}</p>`);
    }
  }
  flushList();
  return htmlParts.join("");
}

function examMcqLesson() {
  return {
    id: "unit1-exam-mcq",
    title: "Section 1 — Multiple Choice",
    blocks: mcqQuestions.map((q) => ({
      type: "quizQuestion",
      question: {
        id: q.id,
        questionType: "mcq",
        text: q.question,
        options: q.options,
        correctIndex: q.answer,
        explanation: q.explanation,
      },
    })),
  };
}

function examShortAnswerLesson() {
  const blocks = [];
  for (const q of shortAnswerQuestions) {
    if (q.context) blocks.push({ type: "richText", html: markdownToHtml(q.context) });
    if (q.parts) {
      for (const part of q.parts) {
        blocks.push({
          type: "quizQuestion",
          question: {
            id: `${q.id}${part.label}`,
            questionType: "extended",
            text: `(${part.label}) ${part.question}`,
            marks: part.marks,
            explanation: part.modelAnswer,
          },
        });
      }
    } else {
      blocks.push({
        type: "quizQuestion",
        question: {
          id: q.id,
          questionType: "extended",
          text: q.question,
          marks: q.marks,
          explanation: q.modelAnswer,
        },
      });
    }
  }
  return { id: "unit1-exam-short-answer", title: "Section 2 — Short Answer", blocks };
}

function examExtendedLesson() {
  const blocks = [{ type: "richText", html: markdownToHtml(extendedAnswer.scenario) }];
  for (const quote of extendedAnswer.quotations) {
    blocks.push({
      type: "richText",
      heading: `${quote.label} — ${quote.supplier} (${quote.price})`,
      html: "",
    });
    blocks.push({
      type: "table",
      headers: ["Component", "Detail"],
      rows: quote.specs.map((s) => [s.component, s.detail]),
    });
  }
  for (const q of extendedAnswer.questions) {
    blocks.push({
      type: "quizQuestion",
      question: {
        id: q.id,
        questionType: "extended",
        text: q.question,
        marks: q.marks,
        explanation: q.modelAnswer,
      },
    });
  }
  return { id: "unit1-exam-extended", title: "Section 3 — Extended Answer", blocks };
}

function examScenarioLesson() {
  const blocks = [
    { type: "richText", html: markdownToHtml(examScenario.context) },
    { type: "list", style: "bullet", items: examScenario.websiteRequirements },
    { type: "list", style: "bullet", items: examScenario.appRequirements },
  ];
  for (const q of examScenario.questions) {
    blocks.push({
      type: "quizQuestion",
      question: {
        id: q.id,
        questionType: "extended",
        text: q.question,
        marks: q.marks,
        explanation: q.modelAnswer,
      },
    });
  }
  return { id: "unit1-exam-scenario", title: "Section 4 — Scenario", blocks };
}

function examPracticeTopic() {
  return {
    id: "unit1-practice-exam",
    title: "Unit 1 Practice Exam",
    description: `${examMeta.title} — ${examMeta.totalMarks} marks, ${examMeta.workingTime}`,
    lessons: [examMcqLesson(), examShortAnswerLesson(), examExtendedLesson(), examScenarioLesson()],
  };
}

function glossaryUnit() {
  const byTopic = new Map();
  for (const t of glossaryTerms) {
    const key = t.topic ?? "General";
    if (!byTopic.has(key)) byTopic.set(key, []);
    byTopic.get(key).push({ term: t.term, definition: t.definition });
  }
  const blocks = [];
  for (const [topicName, items] of [...byTopic.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    items.sort((a, b) => a.term.localeCompare(b.term));
    blocks.push({ type: "heading", text: topicName, level: 3 });
    blocks.push({ type: "keyTerms", items });
  }
  return {
    id: "glossary",
    title: "Glossary",
    status: "available",
    topics: [
      {
        id: "glossary",
        title: "Glossary",
        description: `${glossaryTerms.length} key terms`,
        lessons: [{ id: "glossary-a-z", title: "Glossary (A–Z by topic)", blocks }],
      },
    ],
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

const unit1Topics = [
  ...Object.values(modules)
    .filter((m) => m.unit === 1)
    .map(mapModule),
  examPracticeTopic(),
];
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
    glossaryUnit(),
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
