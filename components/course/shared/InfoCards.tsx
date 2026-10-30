import type { InfoCard } from "@/lib/content/types";
import { TONE } from "./cardStyles";

export function InfoCards({
  title,
  intro,
  columns = 2,
  cards,
}: {
  title?: string;
  intro?: string;
  columns?: 1 | 2 | 3;
  cards: InfoCard[];
}) {
  const grid = columns === 3 ? "sm:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "";
  return (
    <section className="mt-5">
      {title && <h3 className="text-base font-semibold tracking-tight">{title}</h3>}
      {intro && <p className="mt-1 text-sm text-muted-foreground">{intro}</p>}
      <div className={`mt-3 grid gap-3 ${grid}`}>
        {cards.map((c, i) => {
          const t = TONE[c.tone ?? "slate"];
          return (
            <div key={i} className={`rounded-2xl border p-4 shadow-sm ${t.box}`}>
              <div className="flex items-center gap-2">
                {c.icon && (
                  <span aria-hidden className="text-xl leading-none">
                    {c.icon}
                  </span>
                )}
                <p className="font-semibold leading-snug">{c.heading}</p>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{c.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
