"use client";

import { useTransition } from "react";
import type { Block } from "@/lib/content/types";
import { StepPlayer } from "@/components/course/code-track/StepPlayer";
import { toggleLessonComplete } from "@/app/actions/progress";

/** ATAR keeps its existing account + Redis progress, so the Content/Activities step
 *  player writes completion there via the existing server action instead of the
 *  no-login track's localStorage (redesign-plan.md build sequence item 4, 28 Oct 2026). */
export function ATARStepPlayer({
  blocks,
  lessonId,
  courseSlug,
  initialCompleted,
}: {
  blocks: Block[];
  lessonId: string;
  courseSlug: string;
  initialCompleted: boolean;
}) {
  const [, startTransition] = useTransition();

  function onFinish() {
    if (initialCompleted) return; // already recorded; nothing to toggle
    startTransition(() => {
      void toggleLessonComplete(lessonId, courseSlug, false);
    });
  }

  return <StepPlayer blocks={blocks} classCode={courseSlug} lessonId={lessonId} onFinish={onFinish} />;
}
