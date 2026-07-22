"use client";

export default function ClassError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-16 space-y-4">
      <h1 className="text-xl font-semibold text-destructive">Something went wrong</h1>
      <p className="font-mono text-sm bg-muted p-4 rounded-lg break-all">{error.message}</p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">Digest: {error.digest}</p>
      )}
    </div>
  );
}
