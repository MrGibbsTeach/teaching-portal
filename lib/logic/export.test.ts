import { describe, expect, it } from "vitest";
import {
  buildExportRows,
  csvField,
  EXPORT_HEADERS,
  exportFilename,
  toCsv,
  topicUnlocked,
  unlockedCounts,
} from "./export";
import type { ClassConfig } from "../auth-types";
import type { CourseContent } from "../content/types";

const content: CourseContent = {
  slug: "course-a",
  title: "Course A",
  units: [
    {
      id: "unit3",
      title: "Unit 3",
      status: "available",
      topics: [
        { id: "hardware", title: "Hardware", lessons: [{ id: "h1", title: "H1", blocks: [] }, { id: "h2", title: "H2", blocks: [] }] },
        { id: "networks", title: "Networks", lessons: [{ id: "n1", title: "N1", blocks: [] }] },
      ],
    },
    {
      id: "unit4",
      title: "Unit 4",
      status: "available",
      topics: [
        { id: "hardware", title: "Hardware again", lessons: [{ id: "h3", title: "H3", blocks: [] }] },
      ],
    },
  ],
};

function makeClass(over: Partial<ClassConfig> = {}): ClassConfig {
  return {
    id: "c1",
    name: "12 AIT",
    courseSlug: "course-a",
    topicIds: ["unit3:hardware"],
    students: [
      { username: "jsmith", displayName: "J Smith", passcode: "red-wombat-7" },
      { username: "aklein", displayName: "A Klein", passcode: "blue-emu-3" },
    ],
    createdAt: "2026-02-01T00:00:00.000Z",
    ...over,
  };
}

describe("topicUnlocked", () => {
  it("matches a compound unitId:topicId key", () => {
    expect(topicUnlocked(makeClass(), "unit3", "hardware")).toBe(true);
  });

  it("does not unlock the same bare topic id in another unit", () => {
    // The bug this compound key exists to fix: two units share "hardware".
    expect(topicUnlocked(makeClass(), "unit4", "hardware")).toBe(false);
  });

  it("still accepts a legacy bare topic id, in both units", () => {
    const legacy = makeClass({ topicIds: ["hardware"] });
    expect(topicUnlocked(legacy, "unit3", "hardware")).toBe(true);
    expect(topicUnlocked(legacy, "unit4", "hardware")).toBe(true);
  });
});

describe("unlockedCounts", () => {
  it("counts only lessons in unlocked topics", () => {
    expect(unlockedCounts(makeClass(), content)).toEqual({ topics: 1, lessons: 2 });
  });

  it("counts both units for a legacy bare id", () => {
    expect(unlockedCounts(makeClass({ topicIds: ["hardware"] }), content)).toEqual({
      topics: 2,
      lessons: 3,
    });
  });

  it("returns zero when the course has no content registered", () => {
    expect(unlockedCounts(makeClass(), undefined)).toEqual({ topics: 0, lessons: 0 });
  });
});

describe("buildExportRows", () => {
  const contentFor = (slug: string) => (slug === "course-a" ? content : undefined);

  it("produces one row per student with progress and a percentage", () => {
    const rows = buildExportRows([makeClass()], contentFor, (_c, u) =>
      u === "jsmith" ? ["h1"] : []
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      username: "jsmith",
      lessonsUnlocked: 2,
      lessonsComplete: 1,
      percentComplete: 50,
    });
    expect(rows[1]).toMatchObject({ username: "aklein", lessonsComplete: 0, percentComplete: 0 });
  });

  it("reports 0% rather than dividing by zero when nothing is unlocked", () => {
    const rows = buildExportRows([makeClass({ topicIds: [] })], contentFor, () => []);
    expect(rows[0].percentComplete).toBe(0);
    expect(rows[0].lessonsUnlocked).toBe(0);
  });

  it("covers every class when several are exported", () => {
    const rows = buildExportRows(
      [makeClass(), makeClass({ id: "c2", name: "12 AIT B" })],
      contentFor,
      () => []
    );
    expect(rows).toHaveLength(4);
    expect(new Set(rows.map((r) => r.classId))).toEqual(new Set(["c1", "c2"]));
  });
});

describe("csvField", () => {
  it("doubles embedded quotes", () => {
    expect(csvField('say "hi"')).toBe('"say ""hi"""');
  });

  it("keeps commas and newlines inside the quoted field", () => {
    expect(csvField("Smith, J\nline2")).toBe('"Smith, J\nline2"');
  });

  it("defuses a value Excel would read as a formula", () => {
    expect(csvField("=cmd()")).toBe("\"'=cmd()\"");
    expect(csvField("+1")).toBe("\"'+1\"");
    expect(csvField("-at-risk")).toBe("\"'-at-risk\"");
    expect(csvField("@name")).toBe("\"'@name\"");
  });

  it("leaves an ordinary value alone", () => {
    expect(csvField("J Smith")).toBe('"J Smith"');
    expect(csvField(42)).toBe('"42"');
  });
});

describe("toCsv", () => {
  it("writes the header row then one CRLF-terminated row per student", () => {
    const rows = buildExportRows([makeClass()], () => content, (_c, u) =>
      u === "jsmith" ? ["h1", "h2"] : []
    );
    const csv = toCsv(rows);
    const lines = csv.trimEnd().split("\r\n");

    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe(EXPORT_HEADERS.map((h) => `"${h}"`).join(","));
    expect(lines[1]).toContain('"jsmith"');
    expect(lines[1]).toContain('"h1 h2"');
    expect(lines[1]).toContain('"100"');
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("writes just the header when there are no students", () => {
    expect(toCsv([]).trimEnd().split("\r\n")).toHaveLength(1);
  });
});

describe("exportFilename", () => {
  it("names the all-classes file by date", () => {
    expect(exportFilename(new Date("2026-10-10T05:00:00Z"))).toBe("mrgibbs-progress-2026-10-10.csv");
  });

  it("includes the course slug for a single class", () => {
    expect(exportFilename(new Date("2026-10-10T05:00:00Z"), "course-a")).toBe(
      "mrgibbs-progress-course-a-2026-10-10.csv"
    );
  });
});
