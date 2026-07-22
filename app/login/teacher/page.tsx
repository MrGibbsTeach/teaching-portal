import { teacherLogin } from "@/app/actions/auth";

export default async function TeacherLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Teacher Login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the teacher access code.
      </p>

      <form action={teacherLogin} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Access code
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Incorrect access code. Please try again.
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
