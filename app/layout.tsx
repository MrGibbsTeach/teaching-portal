import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MrGibbs Teach",
  description: "Year 7–12 Digital Technologies and Applied IT courses.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-background">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4 text-sm">
              {session ? (
                <>
                  <span className="text-muted-foreground">
                    {session.role === "teacher"
                      ? "Teacher"
                      : session.displayName ?? session.username}
                  </span>
                  {session.role === "student" && session.courseSlug && (
                    <Link
                      href={`/courses/${session.courseSlug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      My Course
                    </Link>
                  )}
                  {session.role === "teacher" && (
                    <Link
                      href="/teacher"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <form action={logout}>
                    <button
                      type="submit"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-muted-foreground">
            MrGibbs Teach — Digital Technologies & Applied IT, Years 7–12.
          </div>
        </footer>
      </body>
    </html>
  );
}
