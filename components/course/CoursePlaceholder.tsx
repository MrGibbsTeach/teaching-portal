import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/courses";

export function CoursePlaceholder({ course }: { course: Course }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Badge variant="secondary">{course.yearLevel}</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {course.title}
      </h1>
      <p className="mt-3 text-muted-foreground">{course.description}</p>
      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Content coming soon.
      </div>
    </div>
  );
}
