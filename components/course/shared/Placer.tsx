"use client";

import { useState } from "react";

/**
 * Place devices on a plan. The plan is authored SVG; the learner picks the location for each
 * device from labelled spots (A, B, C...) and gets instant feedback with the reason.
 * Tap-based, so it works on any device without drag and drop.
 */
export function Placer({
  title,
  instruction,
  planSvg,
  alt,
  spots,
  devices,
}: {
  title?: string;
  instruction?: string;
  planSvg: string;
  alt: string;
  spots: { id: string; label: string }[];
  devices: { name: string; correctSpot: string; why: string }[];
}) {
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const right = devices.filter((d, i) => placed[i] === d.correctSpot).length;
  const allDone = devices.every((d, i) => placed[i] === d.correctSpot);

  return (
    <section className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{title ?? "Place the devices"}</h3>
        <span className="text-xs font-medium text-muted-foreground">
          {right}/{devices.length} placed correctly
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {instruction ?? "Choose the best spot on the plan for each device."}
      </p>
      <div
        role="img"
        aria-label={alt}
        className="mt-3 overflow-hidden rounded-xl border bg-background [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: planSvg }}
      />
      <ul className="mt-2 grid gap-x-4 text-xs text-muted-foreground sm:grid-cols-2">
        {spots.map((s) => (
          <li key={s.id}>
            <span className="font-bold text-foreground">{s.id}</span> {s.label}
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-3">
        {devices.map((d, i) => {
          const choice = placed[i];
          const correct = choice === d.correctSpot;
          return (
            <div key={i} className="rounded-xl border bg-background p-3">
              <p className="text-sm font-semibold">{d.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {spots.map((s) => {
                  const picked = choice === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={correct}
                      onClick={() => setPlaced((p) => ({ ...p, [i]: s.id }))}
                      aria-pressed={picked}
                      className={`h-9 w-9 rounded-full border text-sm font-bold transition-colors ${
                        picked && correct
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : picked
                            ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                            : "hover:bg-accent/40"
                      }`}
                    >
                      {s.id}
                    </button>
                  );
                })}
              </div>
              {choice && (
                <p className="mt-2 text-sm" role="status">
                  {correct ? (
                    <>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">Good placement. </span>
                      {d.why}
                    </>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-300">Not the best spot. Think about coverage and where the connection enters the house.</span>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {allDone && (
        <p className="mt-3 rounded-xl bg-primary/5 p-3 text-sm font-semibold" role="status">
          Every device placed with a reason. Now write it up as annotations on your own plan.
        </p>
      )}
    </section>
  );
}
