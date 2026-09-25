import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LiveStudent } from "@/components/live/LiveStudent";

export const dynamic = "force-dynamic";

export default async function LivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  if (session?.role !== "student") redirect(`/courses/${slug}`);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href={`/courses/${slug}`} className="text-sm text-muted-foreground hover:underline">
        ← My course
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-semibold tracking-tight">Live session</h1>
      <LiveStudent courseHref={`/courses/${slug}`} />
    </div>
  );
}
