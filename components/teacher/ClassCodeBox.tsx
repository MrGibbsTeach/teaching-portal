"use client";

import { useState } from "react";

export function ClassCodeBox({ code, origin }: { code: string; origin: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const link = `${origin}/${code}`;

  async function copy(value: string, which: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard API unavailable; the text is still selectable.
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Class code</p>
        <p className="font-mono text-2xl font-bold tracking-widest">{code}</p>
      </div>
      <button
        type="button"
        onClick={() => copy(code, "code")}
        className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
      >
        {copied === "code" ? "Copied!" : "Copy code"}
      </button>
      <button
        type="button"
        onClick={() => copy(link, "link")}
        className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
      >
        {copied === "link" ? "Copied!" : "Copy link"}
      </button>
      <p className="w-full text-xs text-muted-foreground">
        No login. Students go to <span className="font-mono">{link}</span>.
      </p>
    </div>
  );
}
