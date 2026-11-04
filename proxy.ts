import { NextResponse, type NextRequest } from "next/server";
import { ANIMATED_PREFIX, MODE_COOKIE, MODE_MAX_AGE } from "@/lib/siteMode";

/**
 * Picks which design serves a page (see lib/siteMode.ts).
 * - `site-mode=animated` cookie: /projects is quietly served from /animated/projects.
 * - otherwise: the classic pages at the normal URLs (the default).
 * - someone opening an /animated/... URL directly is sent to the clean URL, in animated mode.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ANIMATED_PREFIX || pathname.startsWith(`${ANIMATED_PREFIX}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(ANIMATED_PREFIX.length) || "/";
    const res = NextResponse.redirect(url);
    res.cookies.set(MODE_COOKIE, "animated", { path: "/", maxAge: MODE_MAX_AGE, sameSite: "lax" });
    return res;
  }

  if (request.cookies.get(MODE_COOKIE)?.value === "animated") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? ANIMATED_PREFIX : `${ANIMATED_PREFIX}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: not API routes, Next internals, or files (anything with a dot: images, icons, docs)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
