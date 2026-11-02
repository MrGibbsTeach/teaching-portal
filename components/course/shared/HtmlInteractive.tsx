"use client";

import { useEffect, useRef, useState } from "react";
import { useStepDone } from "./StepDone";

/**
 * Embeds a self-contained interactive page from /public/interactives. The page runs in a sandboxed
 * iframe (scripts only, no same-origin access), keeps everything the student types in the browser,
 * and talks to the lesson through postMessage:
 *   { source: "mgt-interactive", type: "height", value }  resize the frame to fit
 *   { source: "mgt-interactive", type: "done" }           unlock the step's Next button
 *   { source: "mgt-interactive", type: "top" }            scroll the frame into view
 * Use this for interactives that serve more than one tier: pass `tier` and the page switches its
 * wording, accent and default tab itself.
 */
export function HtmlInteractive({
  title,
  src,
  tier,
  instruction,
  minHeight = 720,
}: {
  title: string;
  src: string;
  tier?: "general" | "atar" | "foundations";
  instruction?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);
  const [done, setDone] = useState(false);
  useStepDone(done);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== ref.current?.contentWindow) return;
      const d = e.data as { source?: string; type?: string; value?: unknown } | null;
      if (!d || d.source !== "mgt-interactive") return;
      if (d.type === "height" && typeof d.value === "number") setHeight(Math.max(minHeight, Math.min(6000, Math.ceil(d.value))));
      else if (d.type === "done") setDone(true);
      else if (d.type === "top") ref.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [minHeight]);

  const url = `${src}${src.includes("?") ? "&" : "?"}tier=${tier ?? "atar"}&embed=1`;
  return (
    <section className="mt-5">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {instruction && <p className="mt-1 text-sm text-muted-foreground">{instruction}</p>}
      <iframe
        ref={ref}
        title={title}
        src={url}
        sandbox="allow-scripts"
        loading="lazy"
        className="mt-3 w-full rounded-2xl border bg-white"
        style={{ height }}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Your annotations stay in this browser and are not saved or sent anywhere.{" "}
        <a className="font-semibold text-primary underline" href={url} target="_blank" rel="noreferrer">
          Open full screen
        </a>
      </p>
    </section>
  );
}
