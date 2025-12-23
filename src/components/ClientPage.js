"use client";

import { useState } from "react";
import Image from "next/image";

import AnimatedText from "./AnimatedText";
import BackgroundAnimation from "./BackgroundAnimation";
import Hero from "./Hero";

// Import dictionaries statically
import enDict from "../dictionaries/en.json";
import nlDict from "../dictionaries/nl.json";
import { Menu } from "./ui";

const dictionaries = {
  en: enDict,
  nl: nlDict,
};

export default function ClientPage({ initialLocale, initialDict }) {
  const [locale, setLocale] = useState(initialLocale);
  const [dict, setDict] = useState(initialDict);
  const [isLoading, setIsLoading] = useState(false);

  const switchLanguage = (newLocale) => {
    if (newLocale === locale) return;

    setIsLoading(true);

    setTimeout(() => {
      setLocale(newLocale);
      setDict(dictionaries[newLocale]);
      setIsLoading(false);

      // Update URL without page reload
      window.history.pushState({}, "", `/${newLocale}/`);
    }, 200);
  };

  return (
    <>
      <Menu
        locale={locale}
        onLocaleToggle={switchLanguage}
        localeDisabled={isLoading}
      />

      <main
        className={` text-center px-4 md:px-6 bg-background transition-opacity duration-300 ${
          isLoading ? "opacity-70" : "opacity-100"
        }`}
      >
        <div>
          <Hero />
        </div>
        <div className="min-h-screen">
          <BackgroundAnimation locale={locale} />
        </div>
        <div>
          <div className="min-h-screen flex items-center justify-center px-6 bg-white" />
        </div>
        <div>
          <Hero />
        </div>
      </main>
    </>
  );
}
