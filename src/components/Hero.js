"use client";

import { ArrowRight } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { Button } from "./ui";

export default function Hero() {
  const { locale, dict } = useI18n();
  // Safely read hero copy from dictionaries
  const hero = dict?.pages?.home?.hero || {};
  const { before, sustainability, middle, justice, after, cta } = hero;

  const accent =
    "text-2xl sm:text-3xl md:text-5xl xl:text-6xl  mb-2 text-[var(--content_brand)] tracking-tight leading-tight";

  // px-8 sm:px-12 md:px-24 lg:px-40 xl:px-64 2xl:px-96

  return (
    <section className="min-h-screen relative flex items-center justify-center px-6 relative z-10">
      {/* commented code is a red circle */}
      {/* <div className="absolute top-[-20%] sm:top-[-30%] md:top-[-40%] lg:top-[-60%] xl:top-[-80%] inset-0 flex items-start justify-center">
        <div className="w-[80%] max-w-5xl aspect-square bg-[var(--content_brand)] rounded-full blur-3xl opacity-15" />
      </div> */}
      <div className="w-full sm:w-5/6 xl:w-4/6 flex flex-col gap-12 items-center">
        <h1 className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-bold text-[var(--content_dark)] leading-tight text-center tracking-tighter">
          {before}
          <span className={accent}>{sustainability}</span>
          {middle}
          <span className={accent}>{justice}</span> {after}
        </h1>
        <Button
          type="button"
          theme="light"
          icon={<ArrowRight size={20} weight="bold" />}
          href={`/${locale}/contact`}
        >
          {cta}
        </Button>
      </div>
    </section>
  );
}
