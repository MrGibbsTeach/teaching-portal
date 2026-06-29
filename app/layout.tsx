import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Logo } from "@/components/brand/Logo";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-background">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Logo />
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
