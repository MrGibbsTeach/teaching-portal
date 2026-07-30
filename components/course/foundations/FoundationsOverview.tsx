"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Clock, Lock } from "lucide-react";
import type { Course } from "@/lib/courses";
import type { CourseContent, Topic, Unit } from "@/lib/content/types";
import { unitIcon } from "./unitIcon";

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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
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
          className="mt-8 flex items-center gap-2 rounded-2xl border-2 px-5 py-3 text-lg font-bold hover:bg-accent"
        >
          <ArrowLeft className="h-6 w-6" />
          Back
        </button>
      )}

      {view.step === "units" && (
        <>
          {allowedTopicIds !== undefined && !hasUnlockedContent && (
            <div className="mt-10 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No topics have been unlocked for you yet. Check back after your teacher sets up your class.
            </div>
          )}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {visibleUnits.map((unit) => {
            const Icon = unitIcon(unit.title);
            const locked = unit.status === "coming_soon";
            const tile = (
              <div
                className={`flex h-full items-center gap-4 rounded-3xl border-2 p-6 text-left ${
                  locked
                    ? "opacity-60"
                    : "hover:bg-accent hover:border-primary cursor-pointer"
                }`}
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary">
                  {locked ? (
                    <Lock className="h-8 w-8 text-primary-foreground" />
                  ) : (
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  )}
                </span>
                <span>
                  <span className="block text-xl font-bold">{unit.title}</span>
                  <span className="block text-base text-muted-foreground">
                    {locked ? "Coming soon" : `${unit.topics.length} topics`}
                  </span>
                </span>
              </div>
            );
            return locked ? (
              <div key={unit.id}>{tile}</div>
            ) : (
              <button key={unit.id} onClick={() => setView({ step: "topics", unit })}>
                {tile}
              </button>
            );
          })}
          </div>
        </>
      )}

      {view.step === "topics" && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">{view.unit.title}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {view.unit.topics.map((topic) => {
              const Icon = unitIcon(topic.title);
              return (
                <button
                  key={topic.id}
                  onClick={() => setView({ step: "lessons", unit: view.unit, topic })}
                  className="flex items-center gap-4 rounded-3xl border-2 p-6 text-left hover:bg-accent hover:border-primary"
                >
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </span>
                  <span>
                    <span className="block text-xl font-bold">{topic.title}</span>
                    <span className="block text-base text-muted-foreground">
                      {topic.lessons.length} lessons
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view.step === "lessons" && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">{view.topic.title}</h2>
          <div className="mt-6 space-y-4">
            {view.topic.lessons.map((lesson) => {
              const isComplete = completedLessonIds?.includes(lesson.id) ?? false;
              return (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.slug}/lesson/${lesson.id}`}
                  className="flex items-center justify-between gap-4 rounded-3xl border-2 p-6 hover:bg-accent hover:border-primary"
                >
                  <span className="flex items-center gap-3">
                    {isComplete ? (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : completedLessonIds !== undefined ? (
                      <span className="h-6 w-6 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                    ) : null}
                    <span className={`text-xl font-bold${isComplete ? " text-muted-foreground" : ""}`}>
                      {lesson.title}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-muted-foreground">
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
