import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isClientRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if ((isAdminRoute || isClientRoute) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Full role check happens server-side in the page/layout via getCurrentUser()
  // since middleware can't call Firebase Admin (Edge runtime limitation).
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};