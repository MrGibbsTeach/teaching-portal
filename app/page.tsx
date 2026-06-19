import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseGroups } from "@/lib/courses";

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
              const card = (
                <Card
                  className={
                    isPlaceholder
                      ? "h-full opacity-60 grayscale"
                      : "h-full transition-colors hover:bg-accent"
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
