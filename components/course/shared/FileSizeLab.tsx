"use client";

import { useState } from "react";

type Format = "jpeg" | "png";

/** Rough bytes per pixel. These are teaching estimates, not exact encoder output. */
function bytesPerPixel(format: Format, quality: number): number {
  if (format === "png") return 2.2;
  const q = quality / 100;
  return 0.04 + 0.4 * q * q;
}
function fmt(bytes: number): string {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}

/**
 * Crop, resize, pick a format and quality, and watch the estimated file size and download time
 * change. Built so students see WHY optimising matters, with no real image needed.
 */
export function FileSizeLab({
  title,
  instruction,
  width,
  height,
  useCase = "website",
}: {
  title?: string;
  instruction?: string;
  width: number;
  height: number;
  useCase?: string;
}) {
  const [keep, setKeep] = useState(100); // % of the image kept by cropping
  const [outW, setOutW] = useState(width);
  const [format, setFormat] = useState<Format>("jpeg");
  const [quality, setQuality] = useState(90);

  const croppedW = Math.round((width * keep) / 100);
  const croppedH = Math.round((height * keep) / 100);
  const finalW = Math.min(outW, croppedW);
  const finalH = Math.round((finalW / croppedW) * croppedH);
  const bytes = finalW * finalH * bytesPerPixel(format, quality);
  const baseline = width * height * bytesPerPixel("jpeg", 90);
  const seconds = (bytes * 8) / (20 * 1e6); // 20 Mbps mobile connection
  const good = bytes <= 500_000 && finalW >= 800;
  const tooBig = bytes > 500_000;
  const tooSmall = finalW < 800;

  return (
    <section className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
      <h3 className="text-base font-semibold tracking-tight">{title ?? "File size lab"}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {instruction ??
          `A ${width} x ${height} photo is going on a ${useCase}. Crop it, resize it and choose a format until it is small but still sharp.`}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-semibold">Crop: keep {keep}% of the photo</span>
          <input type="range" min={40} max={100} value={keep} onChange={(e) => setKeep(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-sm">
          <span className="font-semibold">Resize: {finalW} px wide</span>
          <input type="range" min={200} max={width} step={50} value={outW} onChange={(e) => setOutW(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <div className="text-sm">
          <span className="font-semibold">Format</span>
          <div className="mt-1 flex gap-2">
            {(["jpeg", "png"] as Format[]).map((f) => (
              <button key={f} type="button" onClick={() => setFormat(f)} aria-pressed={format === f}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${format === f ? "border-primary bg-primary/10 text-primary" : "bg-background hover:bg-accent/40"}`}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <label className={`text-sm ${format === "png" ? "opacity-40" : ""}`}>
          <span className="font-semibold">JPEG quality: {quality}%</span>
          <input type="range" min={20} max={100} step={5} value={quality} disabled={format === "png"} onChange={(e) => setQuality(Number(e.target.value))} className="mt-1 w-full" />
        </label>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs text-muted-foreground">Dimensions</p><p className="text-sm font-semibold">{finalW} x {finalH}</p></div>
        <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs text-muted-foreground">Estimated size</p><p className="text-lg font-semibold">{fmt(bytes)}</p></div>
        <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs text-muted-foreground">Phone download</p><p className="text-sm font-semibold">{seconds < 0.1 ? "under 0.1 s" : `${seconds.toFixed(1)} s`}</p></div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {bytes < baseline ? `${Math.round(baseline / bytes)}x smaller` : "No smaller"} than the untouched original (about {fmt(baseline)}). Sizes are estimates for teaching.
      </p>
      <p className={`mt-3 rounded-xl p-3 text-sm font-semibold ${good ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100" : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"}`} role="status">
        {good
          ? `Good for a ${useCase}: small enough to load fast and still wide enough to look sharp.`
          : tooBig
            ? `Too big for a ${useCase} (over about 500 KB). Reduce the pixel dimensions, crop, or lower the quality.`
            : tooSmall
              ? "Now too small: under 800 px wide the image will look blurry on a modern screen."
              : "Adjust the controls."}
      </p>
    </section>
  );
}
