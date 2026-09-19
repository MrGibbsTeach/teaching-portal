export interface CheckpointLike {
  atSeconds: number;
}

/**
 * The checkpoint that currently blocks playback: the earliest unanswered one
 * whose time has been reached. Returns its index, or -1 if playback is free.
 */
export function blockingCheckpoint(
  checkpoints: readonly CheckpointLike[],
  answered: ReadonlySet<number>,
  currentTime: number,
): number {
  let best = -1;
  checkpoints.forEach((c, i) => {
    if (answered.has(i) || c.atSeconds > currentTime) return;
    if (best === -1 || c.atSeconds < checkpoints[best].atSeconds) best = i;
  });
  return best;
}

/**
 * Furthest point the learner may seek to: the time of the earliest unanswered
 * checkpoint, or Infinity if all are answered. Stops skipping past a checkpoint.
 */
export function maxSeekTime(
  checkpoints: readonly CheckpointLike[],
  answered: ReadonlySet<number>,
): number {
  const pending = checkpoints.filter((_, i) => !answered.has(i)).map((c) => c.atSeconds);
  return pending.length === 0 ? Infinity : Math.min(...pending);
}
