"use client";
import { useState, useTransition } from "react";
import { toggleLessonComplete } from "@/app/actions/progress";

interface Props {
  lessonId: string;
  courseSlug: string;
  initialCompleted: boolean;
}

export function LessonCompleteButton({ lessonId, courseSlug, initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const next = !completed;
    setCompleted(next);
    startTransition(async () => {
      await toggleLessonComplete(lessonId, courseSlug, completed);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-4">
      <div className="flex items-center justify-end border-t pt-6">
        <button
          onClick={handleClick}
          disabled={pending}
          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            completed
              ? "bg-green-600 text-white hover:bg-green-700"
              : "border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {completed ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Mark as complete
            </>
          )}
        </button>
      </div>
    </div>
  );
}
