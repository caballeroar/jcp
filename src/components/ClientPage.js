"use client";

import { useState } from "react";

import Environment from "./Environment";
import Hero from "./Hero";

// Import dictionaries statically
import enDict from "../dictionaries/en.json";
import nlDict from "../dictionaries/nl.json";
import { Menu } from "./ui";
import MethodologyCasesGroup from "./MethodologyCasesGroup";
import Testimonials from "./Testimonials";

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
        className={` text-center  bg-background transition-opacity duration-300 ${
          isLoading ? "opacity-70" : "opacity-100"
        }`}
      >
        <div>
          <Hero />
        </div>
        <div className="min-h-screen">
          <Environment locale={locale} />
        </div>
        <div>
          <MethodologyCasesGroup locale={locale} />
        </div>
        <div>
          <Testimonials />
        </div>
        <div>
          <Hero />
        </div>
      </main>
    </>
  );
}
