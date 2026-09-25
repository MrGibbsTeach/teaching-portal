import Link from "next/link";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import { GeneralQuizBlock } from "@/components/course/GeneralQuizBlock";
import { AgentCard } from "@/components/course/AgentCard";
import { getAgentForTopic } from "@/lib/agents";
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
  topicId,
  lessonTitle,
  estimatedMinutes,
  blocks,
  nextLesson,
}: {
  courseSlug: string;
  courseTitle: string;
  unitTitle: string;
  topicTitle: string;
  topicId: string;
  lessonTitle: string;
  estimatedMinutes?: number;
  blocks: Block[];
  nextLesson?: { lessonId: string; lessonTitle: string } | null;
}) {
  const quizCount = blocks.filter(b => b.type === "quizQuestion").length;
  const taskCount = blocks.filter(b => b.type === "task" || b.type === "scenarioChallenge").length;
  const agent = getAgentForTopic(topicId);

  const meta = [
    estimatedMinutes ? `${estimatedMinutes} min` : null,
    quizCount > 0 ? `${quizCount} quiz${quizCount !== 1 ? "zes" : ""}` : null,
    taskCount > 0 ? `${taskCount} task${taskCount !== 1 ? "s" : ""}` : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        ← {courseTitle}
      </Link>

      <p className="mt-6 text-sm text-muted-foreground">
        {unitTitle} / {topicTitle}
      </p>

      <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
        {lessonTitle}
      </h1>
      {meta.length > 0 && (
        <p className="mt-1.5 text-sm text-muted-foreground">{meta.join(" · ")}</p>
      )}

      {agent && (
        <div className="mt-6">
          <AgentCard agent={agent} />
        </div>
      )}

      <div className="mt-8">
        {blocks.map((block, i) => (
          <RenderBlock key={i} block={block} />
        ))}
      </div>

      {nextLesson && (
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <span className="text-sm text-muted-foreground">Up next</span>
          <Link
            href={`/courses/${courseSlug}/lesson/${nextLesson.lessonId}`}
            className="flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            {nextLesson.lessonTitle} →
          </Link>
        </div>
      )}
    </div>
  );
}
