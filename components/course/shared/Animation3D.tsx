import type { Animation3DBlock } from "@/lib/content/types";

/**
 * A 3D animation from /public/animations, shown in a frame with its
 * pause-and-check questions underneath. The animation has its own stage
 * buttons, pause and speed controls, so students can jump back to a stage
 * while they answer.
 */
export function Animation3D({ block }: { block: Animation3DBlock }) {
  const embedSrc = `${block.src}${block.src.includes("?") ? "&" : "?"}embed=1`;
  return (
    <figure className="m-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          3D animation · {block.title}
        </p>
        <a
          href={block.src}
          target="_blank"
          rel="noopener"
          className="shrink-0 text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Open full screen
        </a>
      </div>
      <div className="mt-2 aspect-[4/5] w-full overflow-hidden border border-border bg-[#e9ece9] sm:aspect-[4/3]">
        <iframe
          className="h-full w-full"
          src={embedSrc}
          title={block.title}
          loading="lazy"
          allow="fullscreen"
        />
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-sm text-foreground/90">{block.caption}</figcaption>
      )}
      {block.pauseQuestions && block.pauseQuestions.length > 0 && (
        <div className="mt-4 border-l-2 border-primary py-0.5 pl-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pause and check
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Watch it once all the way through. Then tap each stage in the animation and answer its
            question before you open the answer.
          </p>
          <ol className="mt-3 space-y-3">
            {block.pauseQuestions.map((q, i) => (
              <li key={i} className="text-sm">
                <p>
                  <span className="font-semibold">{q.stage}:</span> {q.question}
                </p>
                <details className="mt-1">
                  <summary className="cursor-pointer text-muted-foreground">Show answer</summary>
                  <p className="mt-1 text-foreground/90">{q.answer}</p>
                </details>
              </li>
            ))}
          </ol>
        </div>
      )}
    </figure>
  );
}
