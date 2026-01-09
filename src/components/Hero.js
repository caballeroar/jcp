"use client";

import { ArrowRight } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { Button } from "./ui";
import { redirect } from "next/dist/server/api-utils";

export default function Hero() {
  const { dict } = useI18n() || {};

  const accent =
    "text-2xl sm:text-3xl md:text-5xl xl:text-6xl  mb-2 text-[var(--content_brand)] tracking-tight leading-tight";

  const { hero = {} } = dict || {};
  const { before, sustainability, middle, justice, after } = hero;

  // px-8 sm:px-12 md:px-24 lg:px-40 xl:px-64 2xl:px-96

  return (
    <section className="min-h-screen relative flex items-center justify-center px-6 relative z-10">
      <div className="absolute top-[-20%] sm:top-[-30%] md:top-[-40%] lg:top-[-60%] xl:top-[-80%] inset-0 flex items-start justify-center">
        <div className="w-[80%] max-w-5xl aspect-square bg-[var(--content_brand)] rounded-full blur-3xl opacity-15" />
      </div>
      <div className="w-full sm:w-5/6 xl:w-4/6 flex flex-col gap-28 items-center">
        <h1 className="text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-semibold text-[var(--content_dark)] leading-tight text-center tracking-tight">
          {before}
          <span className={accent}>{sustainability}</span>
          {middle}
          <span className={accent}>{justice}</span> {after}
        </h1>
        {/* <Button
          href="/contact"
          theme="light"
          icon={<ArrowRight size={20} weight="bold" />}
        >
          Let’s Make Impact
        </Button> */}
      </div>
    </section>
  );
}
