// Runs the real Spec the Computer page in jsdom and drives it through its
// exposed window.__spec object. The inline Three.js block is stripped before
// parsing: jsdom has no WebGL, and the page already falls back to the plain
// part picker when THREE is missing, which is all this test needs.
import { readFileSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { afterEach, describe, expect, it } from "vitest";

const RAW = readFileSync(
  path.join(process.cwd(), "public", "interactives", "spec-computer.html"),
  "utf8",
);

function htmlWithoutThree(): string {
  const start = RAW.indexOf("<script>/**");
  if (start < 0) return RAW;
  const end = RAW.indexOf("</script>", start);
  return RAW.slice(0, start) + RAW.slice(end + "</script>".length);
}

type Run = {
  build: Record<string, string | null>;
  just: Record<string, string>;
};

type Spec = {
  st: { sid: string; runs: Record<string, Run> };
  SC: Array<{ id: string; ref: Record<string, string | null> }>;
  go: (tab: string) => void;
};

const JI_KEYS = ["cpu", "ram", "gpu", "sto", "trade"];

let dom: JSDOM | null = null;

afterEach(() => {
  dom?.window.close();
  dom = null;
});

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function loadPage() {
  dom = new JSDOM(htmlWithoutThree(), {
    runScripts: "dangerously",
    url: "http://localhost/",
    pretendToBeVisual: true,
  });
  const win = dom.window as unknown as Window & { __spec?: Spec };
  win.scrollTo = () => {}; // jsdom does not implement scrolling
  const done: unknown[] = [];
  win.addEventListener("message", (event) => {
    const data = (event as MessageEvent).data;
    if (data && data.source === "mgt-interactive" && data.type === "done") done.push(data);
  });
  return { win, done };
}

describe("Spec the Computer done signal", () => {
  it("sends done only when every justification box has some text", async () => {
    const { win, done } = loadPage();
    const spec = win.__spec;
    expect(spec).toBeTruthy();
    if (!spec) return;

    // A complete, valid build: the reference build for the first client.
    const scenario = spec.SC[0];
    spec.st.sid = scenario.id;
    const run = spec.st.runs[scenario.id];
    Object.assign(run.build, scenario.ref);

    // Review opens with all five boxes empty: no done.
    spec.go("review");
    await flush();
    expect(done).toHaveLength(0);

    // Four of five written: still no done, even though they are long enough
    // to satisfy the word-based hints. Hints are not marks.
    for (const key of JI_KEYS.slice(0, 4)) run.just[key] = "Enough text for the length hint.";
    spec.go("review");
    await flush();
    expect(done).toHaveLength(0);

    // All five have some text: done is sent once.
    run.just.trade = "x";
    spec.go("review");
    await flush();
    expect(done).toHaveLength(1);

    // Re-rendering does not send it again.
    spec.go("review");
    await flush();
    expect(done).toHaveLength(1);
  });

  it("treats whitespace-only text as empty", async () => {
    const { win, done } = loadPage();
    const spec = win.__spec;
    expect(spec).toBeTruthy();
    if (!spec) return;

    const scenario = spec.SC[0];
    spec.st.sid = scenario.id;
    const run = spec.st.runs[scenario.id];
    Object.assign(run.build, scenario.ref);
    for (const key of JI_KEYS) run.just[key] = "   ";

    spec.go("review");
    await flush();
    expect(done).toHaveLength(0);
  });
});
