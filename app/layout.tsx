import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
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
      className={`${publicSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-background">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <Logo />
            <nav className="flex items-center gap-5 text-[0.8rem] tracking-wide text-muted-foreground">
              {session ? (
                <>
                  <span>
                    {session.role === "teacher"
                      ? "Teacher"
                      : session.displayName ?? session.username}
                  </span>
                  {session.role === "student" && session.courseSlug && (
                    <Link
                      href={`/courses/${session.courseSlug}`}
                      className="hover:text-foreground transition-colors"
                    >
                      My course
                    </Link>
                  )}
                  {session.role === "teacher" && (
                    <Link
                      href="/teacher"
                      className="hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <form action={logout}>
                    <button
                      type="submit"
                      className="hover:text-foreground transition-colors"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Log in
                </Link>
              )}
            </nav>
          </div>
          <div className="mx-auto max-w-5xl border-t border-border/70" />
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-border/70">
          <div className="mx-auto max-w-5xl px-6 py-8 text-[0.8rem] text-muted-foreground">
            MrGibbs Teach — Digital Technologies &amp; Applied IT, Years 7–12.
          </div>
        </footer>
      </body>
    </html>
  );
}
