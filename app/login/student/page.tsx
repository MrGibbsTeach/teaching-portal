import { getClasses } from "@/lib/db";
import { studentLogin } from "@/app/actions/auth";

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; error?: string }>;
}) {
  const { classId, error } = await searchParams;
  const classes = await getClasses();

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Student Login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Select your class and enter your username and passcode.
      </p>

      {classes.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No classes are set up yet. Ask your teacher.
        </div>
      ) : (
        <form action={studentLogin} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="classId" className="block text-sm font-medium mb-1.5">
              Class
            </label>
            <select
              id="classId"
              name="classId"
              defaultValue={classId ?? classes[0]?.id}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1.5">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. alex.johnson"
            />
          </div>

          <div>
            <label htmlFor="passcode" className="block text-sm font-medium mb-1.5">
              Passcode
            </label>
            <input
              id="passcode"
              name="passcode"
              type="text"
              autoComplete="off"
              required
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your passcode"
            />
          </div>

          {error === "creds" && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Username or passcode incorrect. Try again.
            </p>
          )}
          {error === "class" && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Class not found. Please ask your teacher.
            </p>
          )}

          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Log in
          </button>
        </form>
      )}
    </div>
  );
}
