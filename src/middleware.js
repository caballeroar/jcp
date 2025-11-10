import { NextResponse } from "next/server";

const locales = ["en", "nl"];
const defaultLocale = "en";

export function middleware(request) {
  const { pathname } = request.nextUrl;

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
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images).*)"],
};
