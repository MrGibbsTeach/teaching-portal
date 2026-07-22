import Link from "next/link";

export default function LoginLandingPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose how you are accessing MrGibbs Teach.
      </p>
      <div className="mt-10 flex flex-col gap-3">
        <Link
          href="/login/teacher"
          className="rounded-xl border-2 border-primary bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Teacher Login
        </Link>
        <Link
          href="/login/student"
          className="rounded-xl border-2 border-border px-6 py-4 text-sm font-semibold hover:bg-accent transition-colors"
        >
          Student Login
        </Link>
      </div>
    </div>
  );
}
