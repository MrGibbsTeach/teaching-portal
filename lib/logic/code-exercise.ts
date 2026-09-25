import type { CodeTest } from "@/lib/content/types";

/**
 * Combine the learner's HTML and CSS into one document. The CSS is injected at the end of
 * <head> (or wrapped around the markup if there is no head), so students only write the CSS file.
 */
export function buildDocument(html: string, css: string): string {
  const style = `<style>\n${css}\n</style>`;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${style}\n</head>`);
  if (/<html[\s>]/i.test(html)) return html.replace(/<html[^>]*>/i, (m) => `${m}<head>${style}</head>`);
  return `<!DOCTYPE html><html><head>${style}</head><body>${html}</body></html>`;
}

export interface TestResult {
  description: string;
  passed: boolean;
}

function safeQueryAll(doc: Document, selector: string): Element[] {
  try {
    return Array.from(doc.querySelectorAll(selector));
  } catch {
    return []; // invalid selector in the authored test: fail rather than crash
  }
}

/** Compare a computed style to what the browser would compute for the expected value. */
function styleMatches(doc: Document, el: Element, property: string, expected: string): boolean {
  const view = doc.defaultView;
  if (!view) return false;
  const actual = view.getComputedStyle(el).getPropertyValue(property);
  // Attach a probe with the expected value so the browser normalises it exactly like the
  // learner's element (e.g. `red` and `#f00` both compute to `rgb(255, 0, 0)`).
  const host = doc.body ?? doc.documentElement;
  const probe = doc.createElement("div");
  probe.style.setProperty(property, expected);
  host.appendChild(probe);
  const normalised = view.getComputedStyle(probe).getPropertyValue(property);
  host.removeChild(probe);
  return actual.trim().toLowerCase() === (normalised || expected).trim().toLowerCase();
}

export function runCodeTests(doc: Document, tests: readonly CodeTest[]): TestResult[] {
  return tests.map((t) => {
    const els = safeQueryAll(doc, t.selector);
    let passed = false;
    switch (t.type) {
      case "exists":
        passed = els.length > 0;
        break;
      case "count":
        passed = els.length >= t.min;
        break;
      case "text":
        passed = els.some((e) => (e.textContent ?? "").toLowerCase().includes(t.contains.toLowerCase()));
        break;
      case "attr":
        passed = els.some((e) => {
          const v = e.getAttribute(t.name);
          return v !== null && (t.contains === undefined || v.toLowerCase().includes(t.contains.toLowerCase()));
        });
        break;
      case "style":
        passed = els.length > 0 && els.every((e) => styleMatches(doc, e, t.property, t.value));
        break;
    }
    return { description: t.description, passed };
  });
}

export function scoreOf(results: readonly TestResult[]): number {
  return results.length === 0 ? 0 : results.filter((r) => r.passed).length / results.length;
}
