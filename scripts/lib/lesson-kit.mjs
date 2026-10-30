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
  type: "infoCards", columns: 1,
  cards: [{ icon: "📂", heading: `Scenario: ${title}`, text: `${text} Answer the questions below using this scenario.`, tone: "amber" }],
});
export const recap = (cards) => ({ type: "infoCards", columns: 1, cards });
export const video = (title, minutes, brief, watchFor) => ({ type: "videoSlot", title, minutes, brief, watchFor });
export const reducedMotion = "@media (prefers-reduced-motion: reduce){*{animation:none!important}}";
export const pick = (lesson, pred) => lesson.blocks.find(pred);
export const extended = (l) => l.blocks.filter((b) => b.type === "quizQuestion" && b.question.questionType === "extended");
export const keyTerms = (l) => pick(l, (b) => b.type === "keyTerms");
export const hook = (l) => l.blocks[0];
export const last = (l) => l.blocks[l.blocks.length - 1];
