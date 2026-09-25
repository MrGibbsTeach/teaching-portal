import type { Course } from "@/lib/courses";
import { TierTheme } from "@/components/course/shared/TierTheme";

export function CoursePlaceholder({ course }: { course: Course }) {
  return (
    <TierTheme tier={course.tier}>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          {course.yearLevel}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {course.title}
        </h1>
        <p className="mt-3 max-w-prose text-muted-foreground">{course.description}</p>
        <div className="mt-10 border-t border-b border-dashed border-border py-10 text-center text-muted-foreground">
          Content coming soon.
        </div>
      </div>
    </TierTheme>
  );
}
