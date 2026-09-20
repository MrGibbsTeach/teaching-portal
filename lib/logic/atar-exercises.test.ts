// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import atar from "@/lib/content/data/year-11-applied-it-atar.json";
import type { CodeExerciseBlock, CourseContent } from "@/lib/content/types";
import { buildDocument, runCodeTests } from "./code-exercise";

const exercises = (atar as unknown as CourseContent).units
  .flatMap((u) => u.topics)
  .flatMap((t) => t.lessons)
  .flatMap((l) => l.blocks)
  .filter((b): b is CodeExerciseBlock => b.type === "codeExercise");

const run = (html: string, css: string, ex: CodeExerciseBlock) =>
  runCodeTests(new JSDOM(buildDocument(html, css)).window.document, ex.tests);

// Reference solutions written independently of the tests' own wording.
const SOLUTIONS: Record<string, { html: (h: string) => string; css: (c: string) => string }> = {
  "Practice: build and style a page": {
    html: (h) => h.replace("</body>", "<p>CSS defines the style.</p><ul><li>a</li><li>b</li><li>c</li></ul></body>"),
    css: (c) => c.replace("#3730a3", "#be185d"),
  },
  "Practice: style the card": {
    html: (h) => h,
    css: (c) =>
      c
        .replace("2px solid #e5e7eb", "2px solid #6366f1")
        // jsdom does not expand the `border-radius` shorthand into longhands in computed styles
        // (browsers do), so the reference solution also sets the longhand the check reads.
        .replace("border-radius: 12px", "border-radius: 20px; border-top-left-radius: 20px")
        .replace("background: #ede9fe", "background: #fef3c7")
        .replace("color: #5b21b6", "color: #92400e"),
  },
};

describe("ATAR code exercises", () => {
  it("has the exercises in the web authoring lesson", () => {
    expect(exercises.map((e) => e.title)).toEqual(Object.keys(SOLUTIONS));
  });

  for (const ex of exercises) {
    it(`"${ex.title}": starter fails every check that needs a change`, () => {
      const results = run(ex.starterHtml, ex.starterCss, ex);
      expect(results.every((r) => r.passed)).toBe(false);
    });
    it(`"${ex.title}": reference solution passes every check`, () => {
      const sol = SOLUTIONS[ex.title];
      const results = run(sol.html(ex.starterHtml), sol.css(ex.starterCss), ex);
      expect(results.filter((r) => !r.passed).map((r) => r.description)).toEqual([]);
    });
  }
});
