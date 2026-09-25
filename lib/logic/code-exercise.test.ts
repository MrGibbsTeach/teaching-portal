// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { buildDocument, runCodeTests, scoreOf } from "./code-exercise";

function render(html: string, css: string): Document {
  // A JSDOM window, like a real iframe document, has a defaultView for getComputedStyle.
  return new JSDOM(buildDocument(html, css)).window.document;
}

describe("buildDocument", () => {
  it("injects css before </head>", () => {
    const d = buildDocument("<html><head><title>x</title></head><body></body></html>", "p{color:red}");
    expect(d.indexOf("<style>")).toBeLessThan(d.indexOf("</head>"));
  });
  it("adds a head when the html has none, and wraps bare markup", () => {
    expect(buildDocument("<html><body></body></html>", "a{}")).toContain("<head><style>");
    expect(buildDocument("<h1>Hi</h1>", "a{}")).toMatch(/<body><h1>Hi<\/h1><\/body>/);
  });
});

describe("runCodeTests", () => {
  const html = `<!DOCTYPE html><html><head><title>Cafe</title></head><body>
    <h1 id="t">Sam's Cafe</h1><a href="menu.html">Menu</a><ul><li>Tea</li><li>Coffee</li></ul></body></html>`;
  const css = "h1{color:red} li{margin-left:10px}";
  const doc = render(html, css);

  it("checks existence, counts, text and attributes", () => {
    const r = runCodeTests(doc, [
      { type: "exists", selector: "h1", description: "h1" },
      { type: "count", selector: "li", min: 2, description: "two items" },
      { type: "count", selector: "li", min: 3, description: "three items" },
      { type: "text", selector: "h1", contains: "cafe", description: "title text" },
      { type: "attr", selector: "a", name: "href", contains: "menu", description: "link" },
    ]);
    expect(r.map((x) => x.passed)).toEqual([true, true, false, true, true]);
    expect(scoreOf(r)).toBeCloseTo(0.8);
  });

  it("checks computed styles, normalising colours", () => {
    const r = runCodeTests(doc, [
      { type: "style", selector: "h1", property: "color", value: "red", description: "red" },
      { type: "style", selector: "h1", property: "color", value: "#ff0000", description: "hex red" },
      { type: "style", selector: "h1", property: "color", value: "blue", description: "blue" },
    ]);
    expect(r.map((x) => x.passed)).toEqual([true, true, false]);
  });

  it("fails (does not throw) on invalid selectors, and scores empty as 0", () => {
    expect(runCodeTests(doc, [{ type: "exists", selector: "!!", description: "bad" }])[0].passed).toBe(false);
    expect(scoreOf([])).toBe(0);
  });
});
