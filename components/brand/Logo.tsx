import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className ?? ""}`.trim()}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M4 7L12 3L20 7L12 11L4 7Z"
            fill="var(--primary-foreground)"
          />
          <path
            d="M7 9.5V15C7 15 9 17 12 17C15 17 17 15 17 15V9.5"
            stroke="var(--primary-foreground)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 7V13"
            stroke="var(--primary-foreground)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-tight">
          MrGibbs<span className="font-medium text-muted-foreground"> Teach</span>
        </span>
      </span>
    </Link>
  );
}
