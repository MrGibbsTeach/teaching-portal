"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlockRenderer } from "@/components/course/BlockRenderer";
import type { Block, Lesson } from "@/lib/content/types";

interface Screen {
  sectionTitle?: string;
  block: Block;
}

function groupIntoScreens(blocks: Block[]): Screen[] {
  const screens: Screen[] = [];
  let sectionTitle: string | undefined;

  for (const block of blocks) {
    if (block.type === "heading") {
      sectionTitle = block.text;
      continue;
    }
    if (block.type === "divider") continue;
    screens.push({ sectionTitle, block });
  }

  return screens;
}

export function FoundationsLessonView({
  courseSlug,
  courseTitle,
  lesson,
}: {
  courseSlug: string;
  courseTitle: string;
  lesson: Lesson;
}) {
  const screens = groupIntoScreens(lesson.blocks);
  const [index, setIndex] = useState(0);
  const screen = screens[index];
  const isFirst = index === 0;
  const isLast = index === screens.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/courses/${courseSlug}`}
        className="flex items-center gap-2 text-lg font-bold text-muted-foreground hover:underline"
      >
        <ArrowLeft className="h-5 w-5" />
        {courseTitle}
      </Link>

      <p className="mt-6 text-base font-semibold text-muted-foreground">
        {lesson.title}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {screens.map((_, i) => (
          <span
            key={i}
            className={`h-3 flex-1 rounded-full ${
              i <= index ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex min-h-[40vh] flex-col justify-center rounded-3xl border-2 p-6">
        {screen.sectionTitle && (
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            {screen.sectionTitle}
          </p>
        )}
        <BlockRenderer block={screen.block} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className="flex items-center gap-2 rounded-2xl border-2 px-6 py-4 text-xl font-bold disabled:opacity-30"
        >
          <ArrowLeft className="h-6 w-6" />
          Back
        </button>
        {isLast ? (
          <Link
            href={`/courses/${courseSlug}`}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 text-xl font-bold text-primary-foreground"
          >
            Finish
          </Link>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(screens.length - 1, i + 1))}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 text-xl font-bold text-primary-foreground"
          >
            Next
            <ArrowRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
