"use client";

import { useState } from "react";
import Image from "next/image";
import ContactButton from "./ContactButton";
import AnimatedText from "./AnimatedText";
import BackgroundAnimation from "./BackgroundAnimation";

// Import dictionaries statically
import enDict from "../dictionaries/en.json";
import nlDict from "../dictionaries/nl.json";
import { Switch } from "./ui";

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
      <BackgroundAnimation locale={locale} />

      <div
        className={`flex gap-4 text-xs w-full px-6 py-3 justify-end transition-opacity duration-200 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        <button
          onClick={() => switchLanguage("en")}
          className={`hover:underline transition-colors ${
            locale === "en"
              ? "text-foreground font-medium"
              : "text-foreground/60"
          }`}
          disabled={isLoading}
        >
          English
        </button>
        <button
          onClick={() => switchLanguage("nl")}
          className={`hover:underline transition-colors ${
            locale === "nl"
              ? "text-foreground font-medium"
              : "text-foreground/60"
          }`}
          disabled={isLoading}
        >
          Nederlands
        </button>
      </div>

      <main
        className={`flex h-screen flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden bg-background transition-opacity duration-300 ${
          isLoading ? "opacity-70" : "opacity-100"
        }`}
      >
        <div className="max-w-sm md:max-w-4xl mx-auto flex flex-col justify-between h-full mt-20 py-8">
          <div>
            <div className="px-12 md:px-6">
              <h2 className="text-sm md:text-md font-normal mb-20 text-foreground/70">
                {dict.title}
              </h2>
              <h1 className="text-xl md:text-4xl font-bold mb-2 text-foreground">
                {dict.subtitle}
              </h1>
            </div>

            <div className="mb-8">
              <AnimatedText
                words={dict.keywords}
                className="text-xl md:text-4xl font-bold text-foreground"
                duration={2500}
              />
            </div>
          </div>

          <div className="mb-20">
            <div className="mb-8">
              <Image
                src="/Full_Logo.png"
                alt="Just Common People"
                width={200}
                height={100}
                className="mx-auto"
                priority
              />
            </div>

            <div className="mb-8 flex flex-col gap-4 items-center justify-center">
              <p className="text-foreground/70">{dict.contact}</p>
              <Switch
                checked={locale === "nl"}
                disabled={isLoading}
                onChange={(checked) => switchLanguage(checked ? "nl" : "en")}
              />
              <ContactButton>{dict.cta}</ContactButton>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
