import { NextRequest, NextResponse } from "next/server";

/**
 * URL scheme:
 *   /            → Bangla home (rewrites to /bn internally)
 *   /about       → Bangla about (rewrites to /bn/about)
 *   /en          → English home (resolved directly)
 *   /en/about    → English about (resolved directly)
 *   /bn          → 301 → /        (legacy /bn paths consolidated to unprefixed)
 *   /bn/about    → 301 → /about
 */

const SUPPORTED = ["en", "bn"] as const;

function pathParts(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const parts = pathParts(pathname);
  const first = parts[0];

  if (first === "bn") {
    const stripped = "/" + parts.slice(1).join("/");
    const url = req.nextUrl.clone();
    url.pathname = stripped === "/" ? "/" : stripped;
    return NextResponse.redirect(url, 301);
  }

  if (first === "en") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/bn" : `/bn${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|favicon\\.png|robots\\.txt|sitemap.*\\.xml|llms\\.txt|install\\.sh|install\\.ps1|images/.*|fonts/.*|static/.*|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
