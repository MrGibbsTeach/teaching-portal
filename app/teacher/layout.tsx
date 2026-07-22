import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Link href="/teacher" className="font-semibold text-primary hover:underline">
              Teacher Dashboard
            </Link>
            <Link href="/teacher/classes/new" className="text-muted-foreground hover:text-foreground">
              + New Class
            </Link>
          </div>
          <form action={logout}>
            <button type="submit" className="text-muted-foreground hover:text-foreground">
              Log out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
