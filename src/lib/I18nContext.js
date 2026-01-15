"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SUPPORTED_LOCALES = ["en", "nl"];
const DEFAULT_LOCALE = "en";

const I18nContext = createContext(null);

function getLocaleFromPathname(pathname) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return SUPPORTED_LOCALES.includes(firstSegment)
    ? firstSegment
    : DEFAULT_LOCALE;
}

export function I18nProvider({ value, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  // ✅ Locale is derived from URL
  const locale = useMemo(() => getLocaleFromPathname(pathname), [pathname]);

  // Dict comes from server (safe, static)
  const dict = value?.dict ?? null;

  // ✅ Replace only the locale segment, keep rest of path
  const setLocale = useCallback(
    (nextLocale) => {
      if (!nextLocale || nextLocale === locale) return;

      const parts = pathname.split("/").filter(Boolean);

      if (SUPPORTED_LOCALES.includes(parts[0])) {
        parts[0] = nextLocale;
      } else {
        parts.unshift(nextLocale);
      }

      const nextPath = `/${parts.join("/")}`;
      const query = search?.toString() ? `?${search.toString()}` : "";
      const hash = typeof window !== "undefined" ? window.location.hash : "";

      router.replace(`${nextPath}${query}${hash}`, { scroll: false });
    },
    [pathname, search, locale, router]
  );

  const valueMemo = useMemo(
    () => ({ locale, dict, setLocale }),
    [locale, dict, setLocale]
  );

  return (
    <I18nContext.Provider value={valueMemo}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
