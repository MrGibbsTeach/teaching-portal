import { describe, expect, it } from "vitest";
import { BarChart3, BookOpen, Palette, Shield } from "lucide-react";
import { iconForTopic } from "./topic-icon";

describe("iconForTopic", () => {
  it("matches a project-management topic", () => {
    expect(iconForTopic("Project Management Fundamentals")).toBe(BarChart3);
  });

  it("matches a design-concepts topic", () => {
    expect(iconForTopic("Design Concepts: Elements and Principles")).toBe(Palette);
  });

  it("matches a security topic", () => {
    expect(iconForTopic("Online Safety and Threats")).toBe(Shield);
  });

  it("falls back to a generic icon for an unmatched title", () => {
    expect(iconForTopic("Introduction to AIT")).toBe(BookOpen);
  });
});
