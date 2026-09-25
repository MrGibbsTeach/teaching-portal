import { notFound } from "next/navigation";
import Link from "next/link";
import { getClass } from "@/lib/db";
import { getCourseContent } from "@/lib/content";
import { LiveTeacher, type LessonOption } from "@/components/live/LiveTeacher";

export const dynamic = "force-dynamic";

export default async function LiveTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cls = await getClass(id);
  if (!cls) notFound();
  const content = getCourseContent(cls.courseSlug);

  const lessons: LessonOption[] = content
    ? content.units
        .filter((u) => u.status !== "coming_soon")
        .flatMap((u) =>
          u.topics.flatMap((t) =>
            t.lessons.map((l) => ({ id: l.id, title: l.title, group: `${u.title} · ${t.title}` })),
          ),
        )
    : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href={`/teacher/classes/${cls.id}`} className="text-sm text-muted-foreground hover:underline">
        ← {cls.name}
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-semibold tracking-tight">Live session</h1>
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">This class has no course content to teach live yet.</p>
      ) : (
        <LiveTeacher classId={cls.id} lessons={lessons} />
      )}
    </div>
  );
}
