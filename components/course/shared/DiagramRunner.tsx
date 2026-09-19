"use client";

import { useState } from "react";
import type { InteractiveDiagramBlock } from "@/lib/content/types";
import { checkDiagram, type DiagramState } from "@/lib/logic/diagram-check";
import { shuffleUnsolved } from "@/lib/logic/activity-check";

interface ToggleDef {
  id: string;
  label: string;
  onLabel?: string;
  offLabel?: string;
}
interface SliderDef {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

/**
 * Renders an interactiveDiagram block. The learner adjusts the diagram until it
 * matches the goal state; the status strip "breaks" (red) while wrong and
 * "resolves" (green) when right, so feedback is visual rather than text-heavy.
 */
export function DiagramRunner({
  block,
  onSolved,
}: {
  block: InteractiveDiagramBlock;
  onSolved?: () => void;
}) {
  const { kind, config, goalState } = block;
  const [state, setState] = useState<DiagramState>(() => initialState(block));
  const [solved, setSolved] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const result = checkDiagram(kind, config, goalState, state);

  function update(next: DiagramState) {
    if (solved) return;
    setState(next);
    // Continuous kinds (toggle/slider) resolve as soon as they are right.
    if (kind === "toggle-state" || kind === "slider") {
      if (checkDiagram(kind, config, goalState, next).solved) finish();
    }
  }

  function finish() {
    setSolved(true);
    onSolved?.();
  }

  function check() {
    setAttempted(true);
    if (result.solved) finish();
  }

  const tone = solved
    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
    : attempted || kind === "toggle-state" || kind === "slider"
      ? "border-red-400 bg-red-50 text-red-900"
      : "border-muted bg-muted/40";

  return (
    <div className="space-y-4">
      {block.title && <p className="text-lg font-semibold">{block.title}</p>}
      {block.instruction && <p className="text-sm">{block.instruction}</p>}

      <div className={`rounded-xl border-2 p-4 transition-colors ${tone}`}>
        {kind === "toggle-state" && (
          <Toggles defs={(config.toggles as ToggleDef[]) ?? []} state={state} onChange={update} disabled={solved} />
        )}
        {kind === "slider" && (
          <Sliders defs={(config.sliders as SliderDef[]) ?? []} state={state} onChange={update} disabled={solved} />
        )}
        {kind === "drag-arrange" && (
          <Arrange state={state} onChange={update} disabled={solved} wrong={attempted ? result.wrong : []} />
        )}
        {kind === "connect" && (
          <Connect
            left={(config.left as string[]) ?? []}
            right={(config.right as string[]) ?? []}
            state={state}
            onChange={update}
            disabled={solved}
          />
        )}
      </div>

      {(kind === "drag-arrange" || kind === "connect") && !solved && (
        <button
          type="button"
          onClick={check}
          className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground"
        >
          Check
        </button>
      )}

      <p role="status" className="text-sm font-medium">
        {solved
          ? `✅ Working! ${block.explanation ?? ""}`
          : attempted
            ? "Still broken. Adjust it and try again."
            : ""}
      </p>
    </div>
  );
}

/** Starting state: everything wrong on purpose so the diagram starts "broken". */
function initialState(block: InteractiveDiagramBlock): DiagramState {
  const { kind, config, goalState } = block;
  if (kind === "toggle-state") {
    const s: DiagramState = {};
    for (const [id, want] of Object.entries(goalState)) s[id] = !want;
    return s;
  }
  if (kind === "slider") {
    const defs = (config.sliders as SliderDef[]) ?? [];
    const s: DiagramState = {};
    for (const d of defs) {
      const goal = Number(goalState[d.id]);
      s[d.id] = goal - d.min > d.max - goal ? d.min : d.max;
    }
    return s;
  }
  if (kind === "drag-arrange") {
    const items = ((goalState.order as string[]) ?? []).slice();
    return { order: shuffleUnsolved(items, items.length + 11) };
  }
  return { links: [] as [string, string][] };
}

function Toggles({
  defs,
  state,
  onChange,
  disabled,
}: {
  defs: ToggleDef[];
  state: DiagramState;
  onChange: (s: DiagramState) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {defs.map((d) => {
        const on = state[d.id] === true;
        return (
          <button
            key={d.id}
            type="button"
            role="switch"
            aria-checked={on}
            disabled={disabled}
            onClick={() => onChange({ ...state, [d.id]: !on })}
            className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-left text-foreground"
          >
            <span className="font-medium">{d.label}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${on ? "bg-emerald-600 text-white" : "bg-zinc-300 text-zinc-800"}`}>
              {on ? (d.onLabel ?? "ON") : (d.offLabel ?? "OFF")}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Sliders({
  defs,
  state,
  onChange,
  disabled,
}: {
  defs: SliderDef[];
  state: DiagramState;
  onChange: (s: DiagramState) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-4">
      {defs.map((d) => (
        <label key={d.id} className="block text-foreground">
          <span className="flex justify-between text-sm font-medium">
            <span>{d.label}</span>
            <span>
              {String(state[d.id] ?? d.min)}
              {d.unit ?? ""}
            </span>
          </span>
          <input
            type="range"
            min={d.min}
            max={d.max}
            step={d.step ?? 1}
            value={Number(state[d.id] ?? d.min)}
            disabled={disabled}
            onChange={(e) => onChange({ ...state, [d.id]: Number(e.target.value) })}
            className="mt-1 w-full"
          />
        </label>
      ))}
    </div>
  );
}

function Arrange({
  state,
  onChange,
  disabled,
  wrong,
}: {
  state: DiagramState;
  onChange: (s: DiagramState) => void;
  disabled: boolean;
  wrong: string[];
}) {
  const order = (state.order as string[]) ?? [];
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (disabled || j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    onChange({ order: next });
  }
  return (
    <ol className="space-y-2 text-foreground">
      {order.map((item, i) => (
        <li
          key={item}
          className={`flex items-center gap-2 rounded-lg border bg-card p-2 ${wrong.includes(String(i)) ? "border-red-500" : ""}`}
        >
          <span className="w-6 text-center text-sm font-bold">{i + 1}</span>
          <span className="flex-1 text-sm">{item}</span>
          <button type="button" aria-label={`Move “${item}” up`} disabled={disabled || i === 0} onClick={() => move(i, -1)} className="rounded border px-2 py-1 disabled:opacity-30">↑</button>
          <button type="button" aria-label={`Move “${item}” down`} disabled={disabled || i === order.length - 1} onClick={() => move(i, 1)} className="rounded border px-2 py-1 disabled:opacity-30">↓</button>
        </li>
      ))}
    </ol>
  );
}

function Connect({
  left,
  right,
  state,
  onChange,
  disabled,
}: {
  left: string[];
  right: string[];
  state: DiagramState;
  onChange: (s: DiagramState) => void;
  disabled: boolean;
}) {
  const links = (state.links as [string, string][]) ?? [];
  const [picked, setPicked] = useState<string | null>(null);

  function pickRight(r: string) {
    if (disabled || !picked) return;
    const exists = links.some(([l, x]) => l === picked && x === r);
    onChange({
      links: exists ? links.filter(([l, x]) => !(l === picked && x === r)) : [...links, [picked, r]],
    });
    setPicked(null);
  }

  return (
    <div className="grid grid-cols-2 gap-6 text-foreground">
      <div className="space-y-2">
        {left.map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={picked === l}
            disabled={disabled}
            onClick={() => setPicked(picked === l ? null : l)}
            className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${picked === l ? "border-primary bg-primary/10" : "bg-card"}`}
          >
            {l}
            <span className="block text-xs text-muted-foreground">
              {links.filter(([a]) => a === l).map(([, b]) => `→ ${b}`).join(", ")}
            </span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {right.map((r) => (
          <button
            key={r}
            type="button"
            disabled={disabled || !picked}
            onClick={() => pickRight(r)}
            className="block w-full rounded-lg border bg-card px-3 py-2 text-left text-sm disabled:opacity-70"
          >
            {r}
          </button>
        ))}
      </div>
      <p className="col-span-2 text-xs text-muted-foreground">
        Tap an item on the left, then tap what it connects to. Tap the same pair again to undo.
      </p>
    </div>
  );
}
