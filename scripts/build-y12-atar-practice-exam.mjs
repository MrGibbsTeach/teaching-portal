#!/usr/bin/env node
/**
 * Builds the Year 12 Applied IT ATAR practice exam from
 * scripts/y12-atar-practice-exam-data.mjs and appends it as a new topic.
 * Y12 ATAR had no practice exam or glossary — see STATUS.md.
 *
 * Unlike Year 11's Unit 1 Practice Exam (one unit only), this one spans both
 * Year 12 units, since the real end-of-year WACE exam does too. Same four
 * sections as Y11's, in the same block shapes (quizQuestion, richText,
 * table, list) so it renders through the existing generic ATAR lesson layout
 * with no component changes needed.
 *
 * The section and exam mark totals shown in the topic description are
 * computed from the question data, not hardcoded, so they can never drift
 * out of sync with the actual questions if the data file is edited later.
 *
 * Idempotent: removes any topic with id "unit-3-4-practice-exam" from every
 * unit before rebuilding.
 *
 * Usage: node scripts/build-y12-atar-practice-exam.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SECTION_1_MCQ,
  SECTION_2_SHORT_ANSWER,
  SECTION_3_EXTENDED,
  SECTION_4_SCENARIO,
} from "./y12-atar-practice-exam-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "lib", "content", "data", "year-12-applied-it-atar.json");
const TOPIC_ID = "unit-3-4-practice-exam";

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

function mcqQuestion(q) {
  return {
    type: "quizQuestion",
    question: {
      id: q.id,
      questionType: "mcq",
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    },
  };
}

function extendedQuestion(q) {
  return {
    type: "quizQuestion",
    question: {
      id: q.id,
      questionType: "extended",
      text: q.text,
      marks: q.marks,
      explanation: q.explanation,
    },
  };
}

const s1Marks = SECTION_1_MCQ.length; // 1 mark per MCQ
const s2Marks = SECTION_2_SHORT_ANSWER.questions.reduce((sum, q) => sum + q.marks, 0);
const s3Marks = SECTION_3_EXTENDED.questions.reduce((sum, q) => sum + q.marks, 0);
const s4Marks = SECTION_4_SCENARIO.questions.reduce((sum, q) => sum + q.marks, 0);
const totalMarks = s1Marks + s2Marks + s3Marks + s4Marks;

const lessons = [
  {
    id: "unit3-4-exam-mcq",
    title: `Section 1 — Multiple Choice (${s1Marks} marks)`,
    blocks: SECTION_1_MCQ.map(mcqQuestion),
  },
  {
    id: "unit3-4-exam-short-answer",
    title: `Section 2 — Short Answer (${s2Marks} marks)`,
    blocks: [
      { type: "richText", html: SECTION_2_SHORT_ANSWER.intro },
      ...SECTION_2_SHORT_ANSWER.questions.flatMap((q) => [extendedQuestion(q)]),
    ],
  },
  {
    id: "unit3-4-exam-extended",
    title: `Section 3 — Extended Answer (${s3Marks} marks)`,
    blocks: [
      { type: "richText", html: SECTION_3_EXTENDED.scenarioHtml },
      { type: "heading", text: SECTION_3_EXTENDED.tableHeading, level: 3 },
      { type: "table", headers: SECTION_3_EXTENDED.table.headers, rows: SECTION_3_EXTENDED.table.rows },
      ...SECTION_3_EXTENDED.questions.map(extendedQuestion),
    ],
  },
  {
    id: "unit3-4-exam-scenario",
    title: `Section 4 — Scenario (${s4Marks} marks)`,
    blocks: [
      { type: "richText", html: SECTION_4_SCENARIO.scenarioHtml },
      { type: "heading", text: SECTION_4_SCENARIO.requirementsHeading, level: 3 },
      { type: "list", style: "bullet", items: SECTION_4_SCENARIO.requirements },
      ...SECTION_4_SCENARIO.questions.map(extendedQuestion),
    ],
  },
];

const practiceExamTopic = {
  id: TOPIC_ID,
  title: "Unit 3 & 4 Practice Exam",
  description: `Evolving Digital Technologies & Digital Technologies Within a Global Society — ${totalMarks} marks, 2 hours 30 minutes`,
  lessons,
};

// Remove any previous copy of this topic from every unit, then add it to
// Unit 4 (the course's final taught unit) so it reads as "finish Unit 4,
// then sit the exam" — ahead of the reference-only Glossary unit.
for (const unit of data.units) {
  unit.topics = unit.topics.filter((t) => t.id !== TOPIC_ID);
}
const unit4 = data.units.find((u) => u.id === "unit-4-digital-technologies-global-society");
if (!unit4) throw new Error('Could not find unit "unit-4-digital-technologies-global-society".');
unit4.topics.push(practiceExamTopic);

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Done. Practice exam added to Unit 4: ${s1Marks} + ${s2Marks} + ${s3Marks} + ${s4Marks} = ${totalMarks} marks across 4 sections, ${lessons.length} lessons.`
);
