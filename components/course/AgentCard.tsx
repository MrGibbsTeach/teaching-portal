"use client";

import Image from "next/image";
import { useState } from "react";
import type { Agent } from "@/lib/agents";

export function AgentCard({ agent }: { agent: Agent }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-y border-border py-4">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden">
          <Image
            src={agent.photo}
            alt={agent.name}
            fill
            className="object-cover object-top"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h3 className="font-medium">{agent.name}</h3>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {agent.title}, {agent.company}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-foreground/80">{agent.bio}</p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1.5 text-xs font-medium text-primary hover:underline"
          >
            {expanded ? "Show less" : "Full profile"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 pl-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Study pathway
            </p>
            <p className="mt-1 text-sm text-foreground/80">{agent.studyPathway}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What I love
            </p>
            <p className="mt-1 text-sm italic text-foreground/80">&ldquo;{agent.love}&rdquo;</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              The hard part
            </p>
            <p className="mt-1 text-sm italic text-foreground/80">&ldquo;{agent.hardPart}&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
}
