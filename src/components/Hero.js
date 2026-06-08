"use client";

import { ArrowRight } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { Button } from "./ui";

export default function Hero() {
  const { locale, dict } = useI18n();
  // Safely read hero copy from dictionaries
  const hero = dict?.pages?.home?.hero || {};
  const { text, accent, cta } = hero;

  // px-8 sm:px-12 md:px-24 lg:px-40 xl:px-64 2xl:px-96

  return (
    <section className="relative z-10 flex min-h-[78svh] items-center justify-center px-4 md:pb-14 md:pt-20 sm:min-h-[82svh] sm:px-6 sm:pb-16 sm:pt-24 md:px-10 md:pb-20 md:pt-28">
      {/* commented code is a red circle */}
      {/* <div className="absolute top-[-20%] sm:top-[-30%] md:top-[-40%] lg:top-[-60%] xl:top-[-80%] inset-0 flex items-start justify-center">
        <div className="w-[80%] max-w-5xl aspect-square bg-[var(--content_brand)] rounded-full blur-3xl opacity-15" />
      </div> */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 sm:gap-10 md:gap-12">
        <h1 className="w-full max-w-[22ch] text-center font-bold text-[var(--content_dark)] leading-[0.98] tracking-[-0.02em] text-[clamp(3rem,7vw,6.2rem)]">
          {text}
          <span className="text-[var(--content_brand)]"> {accent}</span>
        </h1>
        <Button
          type="button"
          theme="light"
          icon={<ArrowRight size={20} weight="bold" />}
          href={`/${locale}/contact`}
          className="w-full justify-center sm:w-auto"
        >
          {cta || "Contact us"}
        </Button>
      </div>
    </section>
  );
}
