"use client";

import { useState, type ReactNode } from "react";

export interface ClassTab {
  id: string;
  label: string;
  content: ReactNode;
}

/** Simple tabs for the teacher class page. Every panel stays mounted, so a tab keeps its place when you switch. */
export function ClassTabs({ tabs }: { tabs: ClassTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  if (tabs.length === 0) return null;
  if (tabs.length === 1) return <div className="mt-4">{tabs[0].content}</div>;
  return (
    <div className="mt-6">
      <div role="tablist" aria-label="Lessons, term plan and assessments" className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={`-mb-px border-b-[3px] px-4 py-2.5 text-sm font-semibold transition-colors ${
              active === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          className="pt-4"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
