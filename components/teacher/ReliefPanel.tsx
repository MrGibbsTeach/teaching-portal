import { createReliefLink, revokeReliefLink } from "@/app/actions/classes";
import type { ReliefLink } from "@/lib/auth-types";
import type { Unit } from "@/lib/content/types";
import { CopyLinkButton } from "./CopyLinkButton";

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00+08:00`).toLocaleDateString("en-AU", {
    weekday: "short", day: "numeric", month: "short", timeZone: "Australia/Perth",
  });
}

/** Teacher-side control for leaving a relief lesson: pick the lessons and the day, get a link to paste into SEQTA. */
export function ReliefPanel({
  classId,
  units,
  defaultStartId,
  links,
  canRelease,
  titleById,
  defaultDate,
}: {
  classId: string;
  units: Unit[];
  defaultStartId?: string;
  links: ReliefLink[];
  canRelease: boolean;
  titleById: Record<string, string>;
  defaultDate: string;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Relief lesson</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Make a read-only link for a relief teacher: a one-minute summary of the lesson, the steps students work
        through, the answers, and a preview of what students see. Paste it into SEQTA. No login, and it stops working
        the day after.
      </p>

      <form action={createReliefLink.bind(null, classId)} className="mt-4 grid gap-4 rounded-2xl border border-border p-5 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          Starting lesson
          <select
            name="startLessonId"
            defaultValue={defaultStartId}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {units.flatMap((u) =>
              u.topics.map((t) => (
                <optgroup key={t.id} label={`${u.title}: ${t.title}`}>
                  {t.lessons.map((l) => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </optgroup>
              )),
            )}
          </select>
        </label>
        <label className="text-sm font-medium">
          Day of the relief
          <input
            type="date"
            name="date"
            required
            defaultValue={defaultDate}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium">
          Number of lessons
          <select name="count" defaultValue="1" className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Summary for the relief teacher (optional)
          <textarea
            name="summary"
            rows={3}
            maxLength={1200}
            placeholder="Leave blank to show just the lesson summary. Behaviour and logistics notes belong in SEQTA."
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        {canRelease && (
          <label className="flex items-start gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="release" className="mt-1" />
            <span>
              Release these lessons to students now (the first becomes Today&apos;s lesson). Leave off if you would
              rather release them yourself nearer the day.
            </span>
          </label>
        )}
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Create relief link
          </button>
        </div>
      </form>

      {links.length > 0 && (
        <ul className="mt-4 space-y-3">
          {links.map((l) => (
            <li key={l.token} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{formatDate(l.date)}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {l.lessonIds.map((id) => titleById[id] ?? id).join(", ")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a href={`/relief/${l.token}`} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                  Open
                </a>
                <CopyLinkButton path={`/relief/${l.token}`} />
                <form action={revokeReliefLink.bind(null, classId, l.token)}>
                  <button type="submit" className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
