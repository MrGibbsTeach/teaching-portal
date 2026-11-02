"use client";

import type { Block } from "@/lib/content/types";
import { StepPlayer } from "@/components/course/code-track/StepPlayer";

/**
 * The student lesson, for a relief teacher to click through. Nothing is recorded: it is rendered
 * outside LessonShell (so no quiz logging) and the finish handler does nothing (so no
 * localStorage completion tick).
 */
export function ReliefPreviewPlayer({ blocks, lessonId }: { blocks: Block[]; lessonId: string }) {
  return <StepPlayer blocks={blocks} classCode="RELIEF-PREVIEW" lessonId={lessonId} onFinish={() => {}} />;
}
