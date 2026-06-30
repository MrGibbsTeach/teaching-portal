import type { Block, QuizQuestion } from "@/lib/content/types";
import { Badge } from "@/components/ui/badge";

function QuizQuestionView({ question }: { question: QuizQuestion }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium">{question.text}</p>
      {question.options && (
        <ul className="mt-2 space-y-1 text-sm">
          {question.options.map((opt, i) => (
            <li
              key={i}
              className={i === question.correctIndex ? "font-semibold text-emerald-700" : ""}
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
        <p className="mt-2 text-sm font-semibold text-emerald-700">
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
          <p className="mt-1 whitespace-pre-line">{question.explanation}</p>
        </details>
      )}
    </div>
  );
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const Tag = (`h${Math.min(Math.max(block.level ?? 2, 2), 4)}` as unknown) as "h2";
      return <Tag className="mt-6 text-xl font-semibold tracking-tight">{block.text}</Tag>;
    }
    case "paragraph":
      return <p className="mt-3 leading-relaxed text-foreground/90">{block.text}</p>;
    case "richText":
      return (
        <div className="mt-3">
          {block.heading && <h3 className="font-semibold">{block.heading}</h3>}
          <div
            className="prose prose-sm max-w-none mt-1"
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        </div>
      );
    case "list":
      return block.style === "numbered" ? (
        <ol className="mt-3 list-decimal space-y-1 pl-6">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="mt-3 list-disc space-y-1 pl-6">
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
                  <th key={i} className="border-b p-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border-b p-2 align-top">
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
        <div className="mt-3 rounded-lg border-l-4 border-primary bg-muted/40 p-3">
          <span className="font-semibold">{block.term}</span>
          <span className="text-muted-foreground"> — {block.definition}</span>
        </div>
      );
    case "keyTerms":
      return (
        <dl className="mt-3 space-y-2">
          {block.items.map((it, i) => (
            <div key={i} className="rounded-lg border-l-4 border-primary bg-muted/40 p-3">
              <dt className="font-semibold">{it.term}</dt>
              <dd className="text-muted-foreground">{it.definition}</dd>
            </div>
          ))}
        </dl>
      );
    case "callout": {
      const v = block.variant;
      const cls =
        v === "hook"
          ? "mt-3 rounded-2xl border-2 border-primary bg-primary/8 p-5"
          : v === "video"
            ? "mt-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5"
            : v === "success"
              ? "mt-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5"
              : "mt-3 rounded-lg border bg-accent/50 p-4";
      return (
        <div className={cls}>
          {block.heading && (
            <p className={`font-bold ${v === "hook" ? "text-primary" : v === "video" ? "text-amber-700" : v === "success" ? "text-emerald-700" : ""}`}>
              {block.heading}
            </p>
          )}
          <p className="mt-1 text-foreground/90">{block.text}</p>
        </div>
      );
    }
    case "divider":
      return <hr className="my-6" />;
    case "video":
      return (
        <div className="mt-3">
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
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
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {block.items.map((it, i) => (
              <div key={i} className="rounded-lg border p-3">
                <p className="font-medium">
                  {it.icon ? `${it.icon} ` : ""}
                  {it.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="mt-3">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {block.items.map((it, i) => (
              <div key={i} className="rounded-lg border p-3">
                <p className="font-medium">{it.label}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
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
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {block.apps.map((a, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{a.name}</p>
                  {a.licence && <Badge variant="secondary">{a.licence}</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "formulaBreakdown":
      return (
        <div className="mt-3 rounded-lg border p-4">
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
        <div className="mt-3 rounded-lg border p-4">
          {block.title && <p className="font-semibold">{block.title}</p>}
          {block.instruction && <p className="mt-1 text-sm">{block.instruction}</p>}
          {block.context && (
            <p className="mt-1 text-sm text-muted-foreground">{block.context}</p>
          )}
          <p className="mt-2 rounded bg-muted p-2 font-mono text-sm">{block.template}</p>
        </div>
      );
    case "scenarioChallenge":
      return (
        <div className="mt-3">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          {block.scenario && <p className="mt-1 text-sm">{block.scenario}</p>}
          <div className="mt-2 space-y-2">
            {block.questions.map((q, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <p>{q.question}</p>
                {q.marks && (
                  <p className="mt-1 text-xs text-muted-foreground">{q.marks} marks</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case "spotTheThreat":
      return (
        <div className="mt-3">
          {block.title && <h3 className="font-semibold">{block.title}</h3>}
          {block.instruction && <p className="mt-1 text-sm">{block.instruction}</p>}
          <div className="mt-2 space-y-2">
            {block.emails.map((e, i) => (
              <details key={i} className="rounded-lg border p-3 text-sm">
                <summary className="cursor-pointer font-medium">
                  {e.subject} — from {e.from}
                </summary>
                <p className="mt-1 whitespace-pre-line text-muted-foreground">{e.body}</p>
                <p className="mt-1 font-semibold">
                  {e.isPhishing ? "⚠️ Phishing" : "✅ Legitimate"}
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
          <pre className="mt-1 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
            <code>{block.defaultCode}</code>
          </pre>
          {block.challenge && <p className="mt-1 text-sm">{block.challenge}</p>}
        </div>
      );
    case "task":
      return (
        <div className="mt-3 rounded-lg border bg-accent/30 p-4">
          <p className="font-semibold">{block.title}</p>
          {block.software && (
            <p className="text-xs text-muted-foreground">Software: {block.software}</p>
          )}
          {block.intro && <p className="mt-1 text-sm">{block.intro}</p>}
          <ol className="mt-2 list-decimal space-y-1 pl-6 text-sm">
            {block.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      );
    case "quizQuestion":
      return (
        <div className="mt-3">
          <QuizQuestionView question={block.question} />
        </div>
      );
    case "activity":
      return (
        <div className="mt-3 rounded-lg border p-4">
          {block.title && <p className="font-medium">{block.title}</p>}
          {block.instruction && <p className="mt-1 text-sm">{block.instruction}</p>}
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
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-sm">
              {block.orderedItems.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          )}
          {block.categories && (
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {block.categories.map((c, i) => (
                <div key={i}>
                  <p className="font-semibold">{c.label}</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
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
