import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline gap-2 font-heading ${className ?? ""}`.trim()}
    >
      <span className="text-[1.375rem] font-semibold tracking-tight text-foreground">
        MrGibbs
      </span>
      <span className="text-[1.375rem] font-normal italic text-primary">
        Teach
      </span>
    </Link>
  );
}
