"use client";

import { useState, useTransition } from "react";

/** One assessment task: set the proposed due date and whether students see it. */
export function AssessmentRow({
  no,
  name,
  type,
  weight,
  planned,
  tbc,
  covers,
  initialVisible,
  initialDate,
  onSave,
}: {
  no: number;
  name: string;
  type: string;
  weight: number;
  planned: string;
  tbc?: boolean;
  covers: string;
  initialVisible: boolean;
  initialDate: string;
  onSave: (visible: boolean, dueDate: string) => Promise<void>;
}) {
  const [visible, setVisible] = useState(initialVisible);
  const [date, setDate] = useState(initialDate);
  const [saved, setSaved] = useState(true);
  const [isPending, startTransition] = useTransition();
  const dirty = !saved;

  function save(nextVisible = visible, nextDate = date) {
    startTransition(async () => {
      await onSave(nextVisible, nextDate);
      setSaved(true);
    });
  }

  return (
    <div className={`rounded-xl border p-4 ${visible ? "border-primary" : "border-border"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold">
            <span className="mr-2 font-mono text-xs text-muted-foreground">Task {no}</span>
            {name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {type} · {weight}% · planned {planned}
            {tbc ? " · date set by the Authority" : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{covers}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Proposed date
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setSaved(false); }}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => { setVisible(e.target.checked); setSaved(false); }}
              className="h-4 w-4 accent-primary"
            />
            Show to students
          </label>
          <button
            type="button"
            disabled={isPending || !dirty}
            onClick={() => save()}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isPending ? "Saving..." : dirty ? "Save" : "Saved"}
          </button>
        </div>
      </div>
    </div>
  );
}
