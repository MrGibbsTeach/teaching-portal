import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Static assets, images, public files — always pass through
  if (
    path.startsWith("/_next") ||
    path.startsWith("/agents") ||
    path.startsWith("/api") ||
    path === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("mg_session")?.value;
  const session = token ? await decrypt(token) : null;

  // Teacher routes: require teacher session
  if (path.startsWith("/teacher")) {
    if (session?.role !== "teacher") {
      return NextResponse.redirect(new URL("/login/teacher", req.url));
    }
    return NextResponse.next();
  }

  // Course routes: require any valid session
  if (path.startsWith("/courses")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Already logged in → redirect away from login pages
  if (session && path.startsWith("/login")) {
    const dest = session.role === "teacher" ? "/teacher" : `/courses/${session.courseSlug}`;
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|agents/).*)"],
};
