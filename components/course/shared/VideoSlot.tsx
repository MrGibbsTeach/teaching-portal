/** A real embed when a YouTube ID is set; otherwise a clearly marked placeholder with the brief. */
export function VideoSlot({
  title,
  youtubeId,
  brief,
  minutes,
  watchFor,
}: {
  title: string;
  youtubeId?: string;
  brief: string;
  minutes?: number;
  watchFor?: string[];
}) {
  return (
    <section className="mt-5 overflow-hidden rounded-2xl border bg-card shadow-sm">
      {youtubeId ? (
        <div className="aspect-video w-full bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
            title={title}
            loading="lazy"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative flex aspect-video w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-center text-white">
          <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-2xl">
            ▶
          </span>
          <p className="mt-3 text-sm font-semibold">{title}</p>
          <p className="mt-1 max-w-md text-xs text-white/70">Video coming soon{minutes ? ` · about ${minutes} min` : ""}</p>
        </div>
      )}
      <div className="p-4 text-sm">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {youtubeId ? "Watch" : "Video placeholder"}
        </p>
        <p className="mt-1 font-semibold">{title}</p>
        <p className="mt-1 text-foreground/85">{brief}</p>
        {watchFor && watchFor.length > 0 && (
          <>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Watch for</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-foreground/85">
              {watchFor.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
