"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ContactButton from "./ContactButton";
import AnimatedText from "./AnimatedText";
import BackgroundAnimation from "./BackgroundAnimation";

export default function ClientPage({ initialLocale, initialDict }) {
  const [locale, setLocale] = useState(initialLocale);
  const [dict, setDict] = useState(initialDict);
  const [isLoading, setIsLoading] = useState(false);

  const switchLanguage = async (newLocale) => {
    if (newLocale === locale) return;

    setIsLoading(true);

    try {
      // Dynamically import the dictionary
      const newDict = await import(`../dictionaries/${newLocale}.json`);

      setTimeout(() => {
        setLocale(newLocale);
        setDict(newDict.default);
        setIsLoading(false);

        // Update URL without page reload
        window.history.pushState({}, "", `/${newLocale}`);
      }, 200);
    } catch (error) {
      console.error("Failed to load dictionary:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Background Animation */}
      <BackgroundAnimation locale={locale} />

      {/* Language switcher */}
      <div
        className={`flex gap-4 text-xs w-full px-6 py-3 justify-end transition-opacity duration-200 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        <button
          onClick={() => switchLanguage("en")}
          className={`hover:underline transition-colors ${
            locale === "en" ? "text-primary-950 font-medium" : "text-gray-600"
          }`}
          disabled={isLoading}
        >
          English
        </button>
        <button
          onClick={() => switchLanguage("nl")}
          className={`hover:underline transition-colors ${
            locale === "nl" ? "text-primary-950 font-medium" : "text-gray-600"
          }`}
          disabled={isLoading}
        >
          Nederlands
        </button>
      </div>

      {/* Main content */}
      <main
        className={`flex h-screen flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden transition-opacity duration-300 ${
          isLoading ? "opacity-70" : "opacity-100"
        }`}
      >
        <div className="max-w-sm md:max-w-4xl mx-auto flex flex-col justify-between h-full mt-20 py-8">
          {/* ...existing content structure with dict values... */}
          <div>
            <div className="px-12 md:px-6">
              <h2 className="text-sm md:text-lg font-normal mb-20">
                {dict.title}
              </h2>
              <h1 className="text-xl md:text-4xl font-bold mb-2">
                {dict.subtitle}
              </h1>
            </div>

            <div className="mb-8">
              <AnimatedText
                words={dict.keywords}
                className="text-xl md:text-4xl font-bold"
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
              <p className="text-sm md:text-lg ">{dict.contact}</p>
              <ContactButton>{dict.cta}</ContactButton>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
