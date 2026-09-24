import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

/**
 * Fast-path gate for /admin.
 *
 * Only checks that a session cookie is PRESENT here — the Edge runtime
 * inlines env at build time, so real HMAC verification deliberately lives
 * in the Node runtime: the (dashboard) layout and every admin API route
 * call verifySessionToken() before rendering or mutating anything.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const hasCookie = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (isLogin && hasCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isLogin && !hasCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
