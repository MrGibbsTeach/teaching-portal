import { describe, expect, it } from "vitest";
import { generateClassCode, isReservedCode, normalizeClassCode } from "./class-code";

describe("generateClassCode", () => {
  it("generates a 6-character code with no look-alike characters", () => {
    for (let i = 0; i < 200; i++) {
      const code = generateClassCode();
      expect(code).toHaveLength(6);
      expect(code).not.toMatch(/[01OIL]/);
    }
  });
});

describe("normalizeClassCode", () => {
  it("uppercases, trims and strips anything that isn't a letter or digit", () => {
    expect(normalizeClassCode(" k7m2-qx ")).toBe("K7M2QX");
  });
});

describe("isReservedCode", () => {
  it("flags reserved route names regardless of case", () => {
    expect(isReservedCode("Teacher")).toBe(true);
    expect(isReservedCode("LOGIN")).toBe(true);
    expect(isReservedCode("K7M2QX")).toBe(false);
  });
});
