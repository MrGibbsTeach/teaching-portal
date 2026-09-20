import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getClass } from "@/lib/db";
import { FOUNDATIONS_SLUGS, FOUNDATIONS_Y11_SLUG } from "@/lib/logic/foundations-migration";

export const dynamic = "force-dynamic";

/**
 * Legacy URL from before Foundations was split into Year 11 and Year 12.
 * Old sessions and bookmarks land here; send students to their class's course.
 */
export default async function LegacyFoundationsPage() {
  const session = await getSession();
  if (session?.role === "student" && session.classId) {
    const cls = await getClass(session.classId);
    if (cls && FOUNDATIONS_SLUGS.includes(cls.courseSlug)) redirect(`/courses/${cls.courseSlug}`);
  }
  redirect(`/courses/${FOUNDATIONS_Y11_SLUG}`);
}
