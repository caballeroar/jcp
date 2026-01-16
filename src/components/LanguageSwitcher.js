"use client";

import { usePathname, useRouter } from "next/navigation";

const SUPPORTED_LOCALES = ["en", "nl"];

export default function LanguageSwitcher({ currentLocale }) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (nextLocale) => {
    if (!pathname) return;
    const segments = pathname.split("/").filter(Boolean);
    if (!SUPPORTED_LOCALES.includes(segments[0])) return;
    segments[0] = nextLocale;
    router.push("/" + segments.join("/"));
  };

  return (
    <div className="flex gap-2">
      {SUPPORTED_LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => changeLocale(loc)}
          disabled={loc === currentLocale}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
