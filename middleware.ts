import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION = "admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION)?.value;
  // Basic check: token should exist and have the format "payload.signature"
  if (!token || !token.includes(".")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
