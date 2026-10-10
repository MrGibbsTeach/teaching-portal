"use client";

import { useState } from "react";

type Hotspot = { id: string; label: string; x: number; y: number };

export function HotspotActivity({
  svgContent,
  hotspots,
  onSolved,
}: {
  svgContent: string;
  hotspots: Hotspot[];
  onSolved?: () => void;
}) {
  const [found, setFound] = useState<string[]>([]);
  const [lastLabel, setLastLabel] = useState("");
  const solved = hotspots.length > 0 && found.length === hotspots.length;

  function reveal(hotspot: Hotspot) {
    if (found.includes(hotspot.id)) return;

    const next = [...found, hotspot.id];
    setFound(next);
    setLastLabel(hotspot.label);
    if (next.length === hotspots.length) onSolved?.();
  }

  return (
    <div className="space-y-3">
      <div className="relative w-full overflow-hidden rounded-xl">
        <div
          className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        {hotspots.map((hotspot, index) => {
          const isFound = found.includes(hotspot.id);
          return (
            <button
              key={hotspot.id}
              type="button"
              aria-label={
                isFound
                  ? `Hotspot ${index + 1}: ${hotspot.label}`
                  : `Identify hotspot ${index + 1}`
              }
              aria-pressed={isFound}
              disabled={isFound}
              onClick={() => reveal(hotspot)}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background text-base font-bold shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-12 sm:w-12 ${
                isFound
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              {isFound ? "✓" : index + 1}
            </button>
          );
        })}
      </div>
      <p role="status" aria-live="polite" className="text-sm font-medium">
        {solved
          ? "Excellent! You found every spot."
          : `Found ${found.length} of ${hotspots.length}.${lastLabel ? ` ${lastLabel}` : ""}`}
      </p>
    </div>
  );
}
