import type { Block, QuizQuestion } from "@/lib/content/types";

function QuizQuestionView({ question }: { question: QuizQuestion }) {
  return (
    <div className="mt-3 border-y border-border py-3">
      <p className="font-medium">{question.text}</p>
      {question.options && (
        <ul className="mt-2 space-y-1 text-sm">
          {question.options.map((opt, i) => (
            <li
              key={i}
              className={i === question.correctIndex ? "font-semibold text-primary" : "text-foreground/90"}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
      {question.pairs && (
        <dl className="mt-2 space-y-1 text-sm">
          {question.pairs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <dt className="font-semibold">{p.term}</dt>
              <dd className="text-muted-foreground">— {p.definition}</dd>
            </div>
          ))}
        </dl>
      )}
      {question.questionType === "true_false" && (
        <p className="mt-2 text-sm font-semibold text-primary">
          Answer: {question.correctAnswer ? "True" : "False"}
        </p>
      )}
      {question.marks && (
        <p className="mt-2 text-xs text-muted-foreground">{question.marks} marks</p>
      )}
      {question.explanation && (
        <details className="mt-2 text-sm">
          <summary className="cursor-pointer text-muted-foreground">
            {question.questionType === "extended" ? "Model answer" : "Explanation"}
          </summary>
          <p className="mt-1 whitespace-pre-line text-foreground/90">{question.explanation}</p>
        </details>
      )}
    </div>
  );
}

const CALLOUT_LABELS: Record<string, string> = {
  hook: "Why it matters",
  video: "Watch",
  success: "Nice work",
  ticket: "Ticket",
  sandbox: "Try it",
  "pr-review": "Code review",
  "senior-wisdom": "From a senior dev",
};

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const level = Math.min(Math.max(block.level ?? 2, 2), 4);
      if (level === 2) {
        return (
          <h2 className="mt-8 font-heading text-xl font-semibold tracking-tight">
            {block.text}
          </h2>
        );
      }
      const Tag = (`h${level}` as unknown) as "h3";
      return (
        <Tag className="mt-6 text-base font-semibold tracking-tight">{block.text}</Tag>
      );
    }
    case "paragraph":
      return <p className="mt-3 leading-relaxed text-foreground/90">{block.text}</p>;
    case "richText":
      return (
        <div className="mt-3">
          {block.heading && <h3 className="font-semibold">{block.heading}</h3>}
          <div
            className="prose prose-sm mt-1 max-w-none"
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        </div>
      );
    case "list":
      return block.style === "numbered" ? (
        <ol className="mt-3 list-decimal space-y-1 pl-6 marker:text-muted-foreground">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="mt-3 list-disc space-y-1 pl-6 marker:text-muted-foreground">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="border-b border-foreground/30 p-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-border p-2 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "keyTerm":
      return (
        <p className="mt-3 border-y border-border py-2">
          <span className="font-medium">{block.term}</span>
          <span className="text-muted-foreground"> — {block.definition}</span>
        </p>
      );
    case "keyTerms":
      return (
        <dl className="mt-3 divide-y divide-border border-y border-border">
          {block.items.map((it, i) => (
            <div key={i} className="flex flex-wrap gap-x-2 py-2">
              <dt className="font-medium">{it.term}</dt>
              <dd className="text-muted-foreground">— {it.definition}</dd>
            </div>
          ))}
        </dl>
      );
    case "callout": {
      const v = block.variant;
      const label = block.heading ?? CALLOUT_LABELS[v ?? ""] ?? null;
      const isVoice = v === "senior-wisdom";
      return (
        <div className="mt-4 border-l-2 border-primary py-0.5 pl-4">
          {label && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {label}
            </p>
          )}
          <p className={`mt-1 text-foreground/90 ${isVoice ? "italic" : ""}`}>{block.text}</p>
        </div>
      );
    }
    case "divider":
      return <hr className="my-8 border-border" />;
    case "video":
      return (
        <div className="mt-3">
          <div className="aspect-video w-full overflow-hidden border border-border">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${block.youtubeId}`}
              title={block.title ?? "video"}
              allowFullScreen
            />
          </div>
          {block.caption && (
            <p className="mt-1 text-xs text-muted-foreground">{block.caption}</p>
          )}
        </div>
      );
    case "grid":
      return (
        <div className="mt-3">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          <div className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {block.items.map((it, i) => (
              <div key={i} className="border-t border-border pt-2">
                {it.photo && (
                  <img
                    src={it.photo}
                    alt={it.label}
                    className="mb-2 h-36 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <p className="font-medium">
                  {it.icon ? `${it.icon} ` : ""}
                  {it.label}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{it.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="mt-3">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          <div className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {block.items.map((it, i) => (
              <div key={i} className="border-t border-border pt-2">
                <p className="font-medium">{it.label}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-muted-foreground/60">
                  {it.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    case "softwareExamples":
      return (
        <div className="mt-3">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          <dl className="mt-3 divide-y divide-border border-y border-border">
            {block.apps.map((a, i) => (
              <div key={i} className="py-2.5">
                <div className="flex items-baseline gap-2">
                  <dt className="font-medium">{a.name}</dt>
                  {a.licence && (
                    <span className="text-xs text-muted-foreground">({a.licence})</span>
                  )}
                </div>
                <dd className="mt-0.5 text-sm text-muted-foreground">{a.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "formulaBreakdown":
      return (
        <div className="mt-3 border-l-2 border-border py-0.5 pl-4">
          <p className="font-mono font-semibold">{block.functionName ?? block.title}</p>
          <dl className="mt-2 space-y-1 text-sm">
            {block.args.map((a, i) => (
              <div key={i}>
                <dt className="font-mono font-semibold">{a.name}</dt>
                <dd className="text-muted-foreground">{a.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "formulaBuilder":
      return (
        <div className="mt-3 border-l-2 border-border py-0.5 pl-4">
          {block.title && <p className="font-semibold">{block.title}</p>}
          {block.instruction && <p className="mt-1 text-sm">{block.instruction}</p>}
          {block.context && (
            <p className="mt-1 text-sm text-muted-foreground">{block.context}</p>
          )}
          <p className="mt-2 bg-muted px-2 py-1.5 font-mono text-sm">{block.template}</p>
        </div>
      );
    case "scenarioChallenge":
      return (
        <div className="mt-4">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          {block.scenario && <p className="mt-1 text-sm text-foreground/90">{block.scenario}</p>}
          <ol className="mt-3 divide-y divide-border border-y border-border">
            {block.questions.map((q, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                <span>{q.question}</span>
                {q.marks && (
                  <span className="shrink-0 text-xs text-muted-foreground">{q.marks} marks</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      );
    case "spotTheThreat":
      return (
        <div className="mt-4">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          {block.instruction && <p className="mt-1 text-sm text-foreground/90">{block.instruction}</p>}
          <div className="mt-3 divide-y divide-border border-y border-border">
            {block.emails.map((e, i) => (
              <details key={i} className="py-2.5 text-sm">
                <summary className="cursor-pointer font-medium">
                  {e.subject} — from {e.from}
                </summary>
                <p className="mt-2 whitespace-pre-line text-muted-foreground">{e.body}</p>
                <p className={`mt-2 font-semibold ${e.isPhishing ? "text-destructive" : "text-primary"}`}>
                  {e.isPhishing ? "Phishing" : "Legitimate"}
                </p>
                {e.redFlags && (
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {e.redFlags.map((f, j) => (
                      <li key={j}>
                        <span className="font-medium">{f.element}:</span> {f.detail}
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
          </div>
        </div>
      );
    case "codePreview":
      return (
        <div className="mt-3">
          {block.title && <p className="font-semibold">{block.title}</p>}
          <pre className="mt-1 overflow-x-auto bg-muted p-3 text-xs">
            <code>{block.defaultCode}</code>
          </pre>
          {block.challenge && <p className="mt-1 text-sm">{block.challenge}</p>}
        </div>
      );
    case "task":
      return (
        <div className="mt-4 border-l-2 border-foreground/25 py-0.5 pl-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Task{block.software ? ` · ${block.software}` : ""}
          </p>
          <p className="mt-1 font-semibold">{block.title}</p>
          {block.intro && <p className="mt-1 text-sm text-foreground/90">{block.intro}</p>}
          <ol className="mt-2 list-decimal space-y-1 pl-6 text-sm marker:text-muted-foreground">
            {block.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      );
    case "quizQuestion":
      return <QuizQuestionView question={block.question} />;
    case "activity":
      return (
        <div className="mt-4 border-l-2 border-foreground/25 py-0.5 pl-4">
          {block.title && <p className="font-semibold">{block.title}</p>}
          {block.instruction && <p className="mt-1 text-sm text-foreground/90">{block.instruction}</p>}
          {block.pairs && (
            <dl className="mt-2 space-y-1 text-sm">
              {block.pairs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <dt className="font-semibold">{p.term}</dt>
                  <dd className="text-muted-foreground">— {p.definition}</dd>
                </div>
              ))}
            </dl>
          )}
          {block.orderedItems && (
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-sm marker:text-muted-foreground">
              {block.orderedItems.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          )}
          {block.categories && (
            <div className="mt-2 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {block.categories.map((c, i) => (
                <div key={i}>
                  <p className="font-semibold">{c.label}</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-muted-foreground/60">
                    {c.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {block.answer && (
            <p className="mt-2 text-sm">
              Answer: <span className="font-mono">{block.answer}</span>
            </p>
          )}
          {block.explanation && (
            <p className="mt-1 text-sm text-muted-foreground">{block.explanation}</p>
          )}
        </div>
      );
    default:
      return null;
  }
}
