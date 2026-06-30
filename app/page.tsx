import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseGroups } from "@/lib/courses";

const COURSE_COLORS: Record<string, string> = {
  "ait-foundations":
    "border-l-4 border-l-teal-500 bg-teal-50/70 hover:bg-teal-50",
  "year-11-applied-it-general":
    "border-l-4 border-l-amber-500 bg-amber-50/70 hover:bg-amber-50",
  "year-12-applied-it-general":
    "border-l-4 border-l-amber-500 bg-amber-50/70 hover:bg-amber-50",
  "year-11-applied-it-atar":
    "border-l-4 border-l-indigo-500 bg-indigo-50/70 hover:bg-indigo-50",
  "year-12-applied-it-atar":
    "border-l-4 border-l-indigo-500 bg-indigo-50/70 hover:bg-indigo-50",
  "year-7-digital-technologies":
    "border-l-4 border-l-rose-400 bg-rose-50/70 hover:bg-rose-50",
  "year-8-digital-technologies":
    "border-l-4 border-l-rose-400 bg-rose-50/70 hover:bg-rose-50",
  "year-9-digital-innovations":
    "border-l-4 border-l-violet-400 bg-violet-50/70 hover:bg-violet-50",
  "year-10-digital-enterprise":
    "border-l-4 border-l-violet-400 bg-violet-50/70 hover:bg-violet-50",
};

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">MrGibbs Teach</h1>
      <p className="mt-2 text-muted-foreground">
        Digital Technologies and Applied Information Technology, Years 7–12.
      </p>

      {courseGroups.map((group) => (
        <section key={group.heading} className="mt-12">
          <h2 className="text-xl font-medium tracking-tight">
            {group.heading}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.courses.map((course) => {
              const isPlaceholder = course.status === "placeholder";
              const activeColor = COURSE_COLORS[course.slug] ?? "hover:bg-accent";
              const card = (
                <Card
                  className={
                    isPlaceholder
                      ? "h-full opacity-60 grayscale"
                      : `h-full transition-colors ${activeColor}`
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle>{course.title}</CardTitle>
                      {isPlaceholder ? (
                        <Badge variant="outline">Coming soon</Badge>
                      ) : (
                        <Badge variant="secondary">{course.yearLevel}</Badge>
                      )}
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
              return isPlaceholder ? (
                <div key={course.slug} className="cursor-default">
                  {card}
                </div>
              ) : (
                <Link key={course.slug} href={`/courses/${course.slug}`}>
                  {card}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
