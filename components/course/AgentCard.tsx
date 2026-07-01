"use client";

import Image from "next/image";
import { useState } from "react";
import type { Agent } from "@/lib/agents";

const ACCENT: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  amber:  { border: "border-amber-400",  bg: "bg-amber-50",  text: "text-amber-800",  badge: "bg-amber-400 text-white" },
  blue:   { border: "border-blue-400",   bg: "bg-blue-50",   text: "text-blue-800",   badge: "bg-blue-500 text-white" },
  green:  { border: "border-emerald-400",bg: "bg-emerald-50",text: "text-emerald-800",badge: "bg-emerald-500 text-white" },
  violet: { border: "border-violet-400", bg: "bg-violet-50", text: "text-violet-800", badge: "bg-violet-500 text-white" },
  orange: { border: "border-orange-400", bg: "bg-orange-50", text: "text-orange-800", badge: "bg-orange-500 text-white" },
};

export function AgentCard({ agent }: { agent: Agent }) {
  const [expanded, setExpanded] = useState(false);
  const c = ACCENT[agent.accentColor] ?? ACCENT.amber;

  return (
    <div className={`rounded-2xl border-2 ${c.border} ${c.bg} overflow-hidden`}>
      <div className="flex items-start gap-4 p-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-md">
          <Image
            src={agent.photo}
            alt={agent.name}
            fill
            className="object-cover object-top"
            sizes="80px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-bold ${c.text}`}>{agent.name}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.badge}`}>
              {agent.title}
            </span>
          </div>
          <p className={`text-sm font-medium ${c.text} opacity-70`}>{agent.company}</p>
          <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">{agent.bio}</p>
          <button
            onClick={() => setExpanded(v => !v)}
            className={`mt-2 text-xs font-semibold ${c.text} hover:underline`}
          >
            {expanded ? "Show less ▲" : "Full profile ▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className={`border-t ${c.border} px-5 pb-5 pt-4 space-y-3`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60`}>Study Pathway</p>
            <p className="mt-1 text-sm text-foreground/80">{agent.studyPathway}</p>
          </div>
          <div className={`rounded-xl border ${c.border} p-3`}>
            <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60`}>❤️ What I Love</p>
            <p className="mt-1 text-sm italic text-foreground/80">"{agent.love}"</p>
          </div>
          <div className={`rounded-xl border ${c.border} p-3`}>
            <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60`}>⚡ The Hard Part</p>
            <p className="mt-1 text-sm italic text-foreground/80">"{agent.hardPart}"</p>
          </div>
        </div>
      )}
    </div>
  );
}
