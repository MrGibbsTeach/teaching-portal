"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Interval while a session is actually running. */
export const LIVE_POLL_ACTIVE_MS = 5000;
/** Interval while nothing is running, or while the tab is in the background. */
export const LIVE_POLL_IDLE_MS = 15000;

/**
 * Polls `load` on an interval that adapts to what is happening, instead of a
 * flat 2s. Three things keep the request count down:
 *
 * - a hidden tab makes no requests at all (nobody is reading it), and catches
 *   up the moment it is shown again;
 * - no live session running means idle pace, not active pace;
 * - the base active interval is 5s.
 *
 * This matters because the free Upstash tier allows 500k commands a month. At a
 * flat 2s, one class of 30 for a single double period was enough to spend it.
 */
export function useLivePoll<T>(load: () => Promise<T>, isActive: (data: T) => boolean, resetKey?: string) {
  const [data, setData] = useState<T | null>(null);
  const [offline, setOffline] = useState(false);

  // Hold the newest callbacks so the loop below does not restart every render.
  const loadRef = useRef(load);
  const isActiveRef = useRef(isActive);
  useEffect(() => {
    loadRef.current = load;
    isActiveRef.current = isActive;
  });

  const refresh = useCallback(async (): Promise<T | null> => {
    try {
      const next = await loadRef.current();
      setData(next);
      setOffline(false);
      return next;
    } catch {
      setOffline(true);
      return null;
    }
  }, []);

  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (ms: number) => {
      if (!stop) timer = setTimeout(tick, ms);
    };

    async function tick() {
      if (stop) return;
      // Skip the request entirely for a backgrounded tab; visibilitychange
      // below wakes it immediately, and the idle timer is just a safety net in
      // case that event never arrives.
      if (typeof document !== "undefined" && document.hidden) {
        schedule(LIVE_POLL_IDLE_MS);
        return;
      }
      const next = await refresh();
      if (stop) return;
      const running = next !== null && isActiveRef.current(next);
      schedule(running ? LIVE_POLL_ACTIVE_MS : LIVE_POLL_IDLE_MS);
    }

    function onVisibilityChange() {
      if (stop || document.hidden) return;
      clearTimeout(timer);
      void tick();
    }

    void tick();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh, resetKey]);

  return { data, offline, refresh };
}
