"use client";

import { useEffect, useRef, useState } from "react";
import type { CodeExerciseBlock } from "@/lib/content/types";
import { buildDocument, runCodeTests, scoreOf, type TestResult } from "@/lib/logic/code-exercise";
import { recordExerciseScore } from "@/app/actions/mastery";

const area =
  "h-64 w-full resize-y rounded-lg border bg-background p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-2 focus-visible:outline-primary";

/**
 * Grok-style split pane: HTML/CSS editor on one side, live preview and autograder on the
 * other. The preview iframe has `sandbox` without `allow-scripts`, so learner code cannot
 * run JavaScript; `allow-same-origin` lets us read the rendered DOM to grade it.
 */
export function CodeExercise({ block, onSolved }: { block: CodeExerciseBlock; onSolved?: () => void }) {
  const [tab, setTab] = useState<"html" | "css">("html");
  const [html, setHtml] = useState(block.starterHtml);
  const [css, setCss] = useState(block.starterCss);
  const [srcDoc, setSrcDoc] = useState(() => buildDocument(block.starterHtml, block.starterCss));
  const [results, setResults] = useState<TestResult[] | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Debounced live preview.
  useEffect(() => {
    const t = setTimeout(() => setSrcDoc(buildDocument(html, css)), 300);
    return () => clearTimeout(t);
  }, [html, css]);


  function check() {
    // Grade exactly what is on screen: render the current code, then read it back.
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    setSrcDoc(buildDocument(html, css));
    requestAnimationFrame(() => {
      const d = frameRef.current?.contentDocument;
      if (!d) return;
      const r = runCodeTests(d, block.tests);
      setResults(r);
      const score = scoreOf(r);
      if (block.skillId) void recordExerciseScore(block.skillId, score);
      if (score === 1) onSolved?.();
    });
  }

  const passedAll = results !== null && results.every((r) => r.passed);

  return (
    <div className="space-y-3 rounded-xl border-2 p-4">
      <p className="font-semibold">{block.title}</p>
      <p className="text-sm">{block.brief}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div role="tablist" className="mb-2 flex gap-1">
            {(["html", "css"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 text-xs font-bold uppercase ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            aria-label={tab === "html" ? "HTML code" : "CSS code"}
            spellCheck={false}
            value={tab === "html" ? html : css}
            onChange={(e) => {
              // Results describe the code that was checked, so clear them on any edit.
              setResults(null);
              if (tab === "html") setHtml(e.target.value);
              else setCss(e.target.value);
            }}
            className={area}
          />
          <p className="mt-1 text-xs text-muted-foreground">Your CSS is linked to the page automatically.</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Preview</p>
          <iframe
            ref={frameRef}
            title="Preview of your page"
            sandbox="allow-same-origin"
            srcDoc={srcDoc}
            className="h-64 w-full rounded-lg border bg-white"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={check}
        className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground"
      >
        Check my work
      </button>

      {results && (
        <ul role="status" className="space-y-1 text-sm">
          {results.map((r, i) => (
            <li key={i} className={r.passed ? "text-emerald-700" : "text-red-700"}>
              {r.passed ? "✅" : "❌"} {r.description}
            </li>
          ))}
          {passedAll && <li className="pt-1 font-semibold">🎉 All checks passed!</li>}
        </ul>
      )}
    </div>
  );
}
