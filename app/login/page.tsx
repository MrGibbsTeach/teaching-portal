import Link from "next/link";

export default function LoginLandingPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose how you are accessing MrGibbs Teach.
      </p>
      <div className="mt-10 flex flex-col gap-3">
        <Link
          href="/login/teacher"
          className="border border-primary bg-primary px-6 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Teacher login
        </Link>
        <Link
          href="/login/student"
          className="border border-border px-6 py-4 text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          Student login
        </Link>
      </div>
    </div>
  );
}
