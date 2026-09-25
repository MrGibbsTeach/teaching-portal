import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="font-heading text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 text-muted-foreground">
        This page doesn&rsquo;t exist or you don&rsquo;t have access to it.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Go home
      </Link>
    </div>
  );
}
