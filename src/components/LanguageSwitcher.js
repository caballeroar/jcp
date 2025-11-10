"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function LanguageSwitcher({ currentLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLanguageChange = async (newLocale) => {
    if (newLocale === currentLocale || isTransitioning) return;

    setIsTransitioning(true);

    // Add a small delay to make the transition smoother
    setTimeout(() => {
      const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
      router.push(newPath);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div
      className={`flex gap-4 text-xs w-full px-6 py-3 justify-end transition-opacity duration-300 ${
        isTransitioning ? "opacity-50" : "opacity-100"
      }`}
    >
      <button
        onClick={() => handleLanguageChange("en")}
        className={`hover:underline transition-colors ${
          currentLocale === "en"
            ? "text-primary-950 font-medium"
            : "text-gray-600"
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange("nl")}
        className={`hover:underline transition-colors ${
          currentLocale === "nl"
            ? "text-primary-950 font-medium"
            : "text-gray-600"
        }`}
      >
        Nederlands
      </button>
    </div>
  );
}
