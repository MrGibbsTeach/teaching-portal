"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Clock, Lock, Check } from "lucide-react";
import type { Course } from "@/lib/courses";
import type { CourseContent, Topic, Unit } from "@/lib/content/types";

type View =
  | { step: "units" }
  | { step: "topics"; unit: Unit }
  | { step: "lessons"; unit: Unit; topic: Topic };

export function FoundationsOverview({
  course,
  content,
  allowedTopicIds,
  completedLessonIds,
}: {
  course: Course;
  content: CourseContent;
  allowedTopicIds?: string[];
  completedLessonIds?: string[];
}) {
  // Filter units/topics for student access control
  const visibleUnits = allowedTopicIds
    ? content.units
        .map((u) => ({
          ...u,
          topics: u.status === "coming_soon"
            ? u.topics
            : u.topics.filter(
                (t) =>
                  // New compound format: "unitId:topicId"
                  allowedTopicIds.includes(`${u.id}:${t.id}`) ||
                  // Legacy format: bare "topicId" (kept for backward-compat)
                  allowedTopicIds.includes(t.id)
              ),
        }))
        .filter((u) => u.status === "coming_soon" || u.topics.length > 0)
    : content.units;

  const hasUnlockedContent = visibleUnits.some((u) => u.status !== "coming_soon");

  const [view, setView] = useState<View>({ step: "units" });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">{course.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{course.description}</p>

      {view.step !== "units" && (
        <button
          onClick={() =>
            setView(
              view.step === "lessons"
                ? { step: "topics", unit: view.unit }
                : { step: "units" }
            )
          }
          className="mt-8 flex items-center gap-2 border-b-2 border-foreground pb-1 text-lg font-bold"
        >
          <ArrowLeft className="h-6 w-6" />
          Back
        </button>
      )}

      {view.step === "units" && (
        <>
          {allowedTopicIds !== undefined && !hasUnlockedContent && (
            <div className="mt-10 border-t border-b border-dashed border-border py-10 text-center text-muted-foreground">
              No topics have been unlocked for you yet. Check back after your teacher sets up your class.
            </div>
          )}
          <div className="mt-8 border-t-2 border-foreground">
            {visibleUnits.map((unit) => {
              const locked = unit.status === "coming_soon";
              const row = (
                <div
                  className={`flex items-center justify-between gap-4 border-b-2 border-foreground py-6 text-left ${
                    locked ? "opacity-50" : "hover:bg-accent/50"
                  }`}
                >
                  <span className="text-xl font-bold">{unit.title}</span>
                  <span className="flex shrink-0 items-center gap-2 text-base text-muted-foreground">
                    {locked ? (
                      <>
                        <Lock className="h-5 w-5" />
                        Coming soon
                      </>
                    ) : (
                      <>
                        {unit.topics.length} topics
                        <ChevronRight className="h-6 w-6" />
                      </>
                    )}
                  </span>
                </div>
              );
              return locked ? (
                <div key={unit.id}>{row}</div>
              ) : (
                <button
                  key={unit.id}
                  className="block w-full"
                  onClick={() => setView({ step: "topics", unit })}
                >
                  {row}
                </button>
              );
            })}
          </div>
        </>
      )}

      {view.step === "topics" && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">{view.unit.title}</h2>
          <div className="mt-4 border-t-2 border-foreground">
            {view.unit.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setView({ step: "lessons", unit: view.unit, topic })}
                className="flex w-full items-center justify-between gap-4 border-b-2 border-foreground py-6 text-left hover:bg-accent/50"
              >
                <span className="text-xl font-bold">{topic.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-base text-muted-foreground">
                  {topic.lessons.length} lessons
                  <ChevronRight className="h-6 w-6" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {view.step === "lessons" && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">{view.topic.title}</h2>
          <div className="mt-4 border-t-2 border-foreground">
            {view.topic.lessons.map((lesson) => {
              const isComplete = completedLessonIds?.includes(lesson.id) ?? false;
              return (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.slug}/lesson/${lesson.id}`}
                  className="flex items-center justify-between gap-4 border-b-2 border-foreground py-6 hover:bg-accent/50"
                >
                  <span className="flex items-center gap-3">
                    {isComplete && <Check className="h-6 w-6 shrink-0 text-primary" />}
                    <span className={`text-xl font-bold ${isComplete ? "text-muted-foreground" : ""}`}>
                      {lesson.title}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-muted-foreground">
                    {lesson.estimatedMinutes && (
                      <span className="flex items-center gap-1.5 text-base">
                        <Clock className="h-5 w-5" />
                        {lesson.estimatedMinutes} min
                      </span>
                    )}
                    <ChevronRight className="h-6 w-6" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
