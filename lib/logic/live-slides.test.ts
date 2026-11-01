import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { getCourseContent } from "@/lib/content";
import { liveSlides, liveSlideHeadings } from "./live";

describe("live slides", () => {
  it("never makes a slide out of a bare heading, in any lesson", () => {
    let lessons = 0;
    for (const slug of [
      "year-11-applied-it-general", "year-12-applied-it-general",
      "year-11-applied-it-atar", "year-12-applied-it-atar",
      "year-11-ait-foundations", "year-12-ait-foundations",
    ]) {
      const content = getCourseContent(slug);
      for (const l of content?.units.flatMap((u) => u.topics).flatMap((t) => t.lessons) ?? []) {
        lessons++;
        const slides = liveSlides(l);
        expect(slides.some((b) => b.type === "heading" || b.type === "divider")).toBe(false);
        expect(liveSlideHeadings(l)).toHaveLength(slides.length);
      }
    }
    expect(lessons).toBeGreaterThan(100);
  });
});
