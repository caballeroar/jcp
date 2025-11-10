import { NextResponse } from "next/server";

const locales = ["en", "nl"];
const defaultLocale = "en";

export default function proxy(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and special Next.js files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/images") ||
    pathname.includes(".") // This catches files like .txt, .otf, .jpg, etc.
  ) {
    return NextResponse.next();
  }

  // Check if pathname is missing a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect to default locale
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
