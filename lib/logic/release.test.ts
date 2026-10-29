import { describe, expect, it } from "vitest";
import {
  closeRevision,
  isVisibleToStudents,
  makeToday,
  openForRevision,
  pullBack,
  release,
  todayLessonId,
  type Releases,
} from "./release";

describe("release", () => {
  it("releases a lesson without making it today's lesson", () => {
    const r = release({}, "l1");
    expect(r.l1.status).toBe("released");
    expect(todayLessonId(r)).toBeUndefined();
  });

  it("makeToday sets one lesson as today and demotes the previous one", () => {
    let r: Releases = release({}, "l1");
    r = makeToday(r, "l1");
    expect(todayLessonId(r)).toBe("l1");

    r = release(r, "l2");
    r = makeToday(r, "l2");
    expect(todayLessonId(r)).toBe("l2");
    expect(r.l1.status).toBe("released"); // demoted, not pulled back
  });

  it("pulling back today's lesson removes it from Today and from student view", () => {
    let r: Releases = makeToday(release({}, "l1"), "l1");
    r = pullBack(r, "l1");
    expect(todayLessonId(r)).toBeUndefined();
    expect(isVisibleToStudents(r, "l1")).toBe(false);
  });

  it("re-releasing a pulled-back lesson can make it today's lesson again", () => {
    let r: Releases = pullBack(makeToday(release({}, "l1"), "l1"), "l1");
    r = makeToday(release(r, "l1"), "l1");
    expect(todayLessonId(r)).toBe("l1");
  });

  it("open for revision makes a lesson visible without touching today's lesson", () => {
    let r: Releases = makeToday(release({}, "today-lesson"), "today-lesson");
    r = openForRevision(r, "old-lesson");
    expect(todayLessonId(r)).toBe("today-lesson");
    expect(isVisibleToStudents(r, "old-lesson")).toBe(true);
    expect(r["old-lesson"].status).toBe("revision");

    r = closeRevision(r, "old-lesson");
    expect(isVisibleToStudents(r, "old-lesson")).toBe(false);
  });

  it("a lesson with no release record is not visible to students", () => {
    expect(isVisibleToStudents({}, "never-released")).toBe(false);
  });
});
