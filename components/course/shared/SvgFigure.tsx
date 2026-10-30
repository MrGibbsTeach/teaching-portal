/**
 * Authored, trusted SVG from our own lesson JSON (never user input), so it is rendered inline.
 * Inline lets the SVG's own <style> drive small looping animations. Animations are switched off
 * for people who ask for reduced motion.
 */
export function SvgFigure({
  title,
  caption,
  alt,
  svg,
}: {
  title?: string;
  caption?: string;
  alt: string;
  svg: string;
}) {
  return (
    <figure className="mt-5 rounded-2xl border bg-card p-4 shadow-sm">
      {title && <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{title}</p>}
      <div
        role="img"
        aria-label={alt}
        className="mt-2 [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && <figcaption className="mt-2 text-sm text-foreground/85">{caption}</figcaption>}
    </figure>
  );
}
