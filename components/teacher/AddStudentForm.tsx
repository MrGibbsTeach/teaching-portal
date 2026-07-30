"use client";

import { useState } from "react";

const COLORS = ["red","blue","green","gold","pink","grey","teal","lime","navy","rose"];
const ANIMALS = ["cat","dog","fox","bird","duck","owl","wolf","bear","bee","fish","frog","lion","deer","hawk"];

function generatePasscode() {
  const c = COLORS[Math.floor(Math.random() * COLORS.length)];
  const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const n = Math.floor(Math.random() * 90) + 10;
  return `${c}${a}${n}`;
}

export function AddStudentForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [passcode, setPasscode] = useState("");

  return (
    <form action={action} className="mt-4 flex flex-wrap gap-2 items-end">
      <div>
        <label className="block text-xs font-medium mb-1 text-muted-foreground">
          Full name
        </label>
        <input
          name="displayName"
          type="text"
          required
          placeholder="Alex Johnson"
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-muted-foreground">
          Passcode
        </label>
        <div className="flex gap-1.5">
          <input
            name="passcode"
            type="text"
            required
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="dog42"
            className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary w-28"
          />
          <button
            type="button"
            title="Generate random passcode"
            onClick={() => setPasscode(generatePasscode())}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            🎲
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Add Student
      </button>
    </form>
  );
}
