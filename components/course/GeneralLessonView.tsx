import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { GeneralQuizBlock } from "@/components/course/GeneralQuizBlock";
import type { Block } from "@/lib/content/types";

function RenderBlock({ block }: { block: Block }) {
  if (block.type === "quizQuestion") {
    return <GeneralQuizBlock question={block.question} />;
  }
  return <BlockRenderer block={block} />;
}

export function GeneralLessonView({
  courseSlug,
  courseTitle,
  unitTitle,
  topicTitle,
  lessonTitle,
  estimatedMinutes,
  blocks,
  nextLesson,
}: {
  courseSlug: string;
  courseTitle: string;
  unitTitle: string;
  topicTitle: string;
  lessonTitle: string;
  estimatedMinutes?: number;
  blocks: Block[];
  nextLesson?: { lessonId: string; lessonTitle: string } | null;
}) {
  const quizCount = blocks.filter(b => b.type === "quizQuestion").length;
  const taskCount = blocks.filter(b => b.type === "task" || b.type === "scenarioChallenge").length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {courseTitle}
      </Link>

      <p className="mt-4 text-sm text-muted-foreground">
        {unitTitle} / {topicTitle}
      </p>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{lessonTitle}</h1>
        {estimatedMinutes && (
          <Badge variant="secondary">{estimatedMinutes} min</Badge>
        )}
        {quizCount > 0 && (
          <Badge variant="outline">{quizCount} quiz{quizCount !== 1 ? "zes" : ""}</Badge>
        )}
        {taskCount > 0 && (
          <Badge variant="outline">{taskCount} task{taskCount !== 1 ? "s" : ""}</Badge>
        )}
      </div>

      <div className="mt-8 space-y-1">
        {blocks.map((block, i) => (
          <RenderBlock key={i} block={block} />
        ))}
      </div>

      {nextLesson && (
        <div className="mt-10 flex items-center justify-between border-t pt-6">
          <span className="text-sm text-muted-foreground">Up next</span>
          <Link
            href={`/courses/${courseSlug}/lesson/${nextLesson.lessonId}`}
            className="flex items-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-5 py-3 font-semibold text-primary hover:bg-primary/10"
          >
            {nextLesson.lessonTitle} →
          </Link>
        </div>
      )}
    </div>
  );
}
