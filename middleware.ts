import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "s4_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "default-secret-change-me";
const SEPARATOR = "|||";

function decodeSession(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const sepIndex = decoded.indexOf(SEPARATOR);
    if (sepIndex === -1) return false;
    const payloadStr = decoded.slice(0, sepIndex);
    const secret = decoded.slice(sepIndex + SEPARATOR.length);
    if (secret !== SESSION_SECRET) return false;
    const payload = JSON.parse(payloadStr);
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    "/admin/dashboard",
    "/admin/bookings",
    "/admin/testimonials",
    "/admin/videos",
    "/admin/contacts",
    "/admin/export",
  ];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !decodeSession(token)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
