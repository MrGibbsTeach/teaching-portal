"use client";

import { useState } from "react";

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}${path}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy this link", `${window.location.origin}${path}`);
        }
      }}
      className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
