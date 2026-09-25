import Link from "next/link";
import { courseGroups } from "@/lib/courses";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-primary">
        Course index
      </p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        MrGibbs Teach
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted-foreground">
        Digital Technologies and Applied Information Technology, Years 7–12.
      </p>

      {courseGroups.map((group) => (
        <section key={group.heading} className="mt-14 first:mt-16">
          <h2 className="font-heading text-xl italic text-primary">
            {group.heading}
          </h2>
          <div className="mt-3 border-t border-border">
            {group.courses.map((course) => {
              const isPlaceholder = course.status === "placeholder";
              const row = (
                <div
                  className={`group grid grid-cols-[5.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-border py-5 sm:grid-cols-[7rem_1fr_auto] ${
                    isPlaceholder ? "" : "transition-colors hover:bg-accent/40"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      isPlaceholder ? "text-muted-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {course.yearLevel}
                  </span>
                  <span className="col-start-2 row-start-1">
                    <span
                      className={`text-lg font-medium tracking-tight ${
                        isPlaceholder ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {course.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {isPlaceholder ? "Coming soon" : course.description}
                    </span>
                  </span>
                  {!isPlaceholder && (
                    <span
                      aria-hidden
                      className="col-start-3 row-start-1 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    >
                      →
                    </span>
                  )}
                </div>
              );
              return isPlaceholder ? (
                <div key={course.slug} className="cursor-default">
                  {row}
                </div>
              ) : (
                <Link key={course.slug} href={`/courses/${course.slug}`}>
                  {row}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
