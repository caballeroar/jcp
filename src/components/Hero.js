"use client";

import { useI18n } from "../lib/I18nContext";

export default function Hero() {
  const { dict } = useI18n() || {};

  const accent =
    "text-xl sm:text-2xl md:text-4xl font-bold mb-2 text-[var(--content_brand)]  leading-tight";

  const { hero = {} } = dict || {};
  const { before, sustainability, middle, justice, after } = hero;

  // px-8 sm:px-12 md:px-24 lg:px-40 xl:px-64 2xl:px-96

  return (
    <section className="min-h-screen relative flex items-center justify-center px-6 relative z-10">
      <div className="absolute top-[-20%] sm:top-[-30%] md:top-[-40%] lg:top-[-60%] xl:top-[-80%] inset-0 flex items-start justify-center">
        <div className="w-[80%] max-w-5xl aspect-square bg-[var(--content_brand)] rounded-full blur-3xl opacity-15" />
      </div>
      <div className="w-full sm:w-5/6 xl:w-4/6 2xl:w-3/6 px-8 sm:px-12 text-center">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold text-[var(--content_dark)] leading-tight ">
          {before}
          <span className={accent}>{sustainability}</span>
          {middle}
          <span className={accent}>{justice}</span> {after}
        </h1>
      </div>
    </section>
  );
}
