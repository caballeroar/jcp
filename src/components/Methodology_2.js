"use client";

import { useRef } from "react";
import { ArrowRight } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { Button } from "./ui";
import { useScrollProgress } from "../hooks/useScrollProgress";
import EllipseSvg from "./EllipseSvg";
// import "../app/globals.css";

const ELLIPSES = [
  { rotation: -45 },
  { rotation: 45 },
  { rotation: -135 },
  { rotation: 135 },
];

export default function Methodology2() {
  const { locale, dict } = useI18n();
  const sectionRef = useRef(null);

  useScrollProgress(sectionRef, { start: 0.15, end: 0.5 });

  const accent = "font-bold mb-2 text-[var(--content_brand)]";

  return (
    <section
      ref={sectionRef}
      className="methodology relative w-full min-h-screen flex items-center justify-center overflow-visible"
    >
      {ELLIPSES.map((e, i) => (
        <EllipseSvg
          className={"opacity-60 w-[360px]"}
          key={i}
          index={i}
          rotation={e.rotation}
        />
      ))}

      <div className="w-4/6 lg:w-3/6 flex flex-col items-center text-center relative z-10">
        <p className="text-xl md:text-3xl font-semibold">
          {dict?.pages?.home?.methodology?.sentence1}
        </p>

        <p className="mt-8 text-xl md:text-3xl font-semibold">
          {dict?.pages?.home?.methodology?.sentence2}{" "}
          <span className={accent}>
            {dict?.pages?.home?.methodology?.accent1}
          </span>
          ,{" "}
          <span className={accent}>
            {dict?.pages?.home?.methodology?.accent2}
          </span>{" "}
          and{" "}
          <span className={accent}>
            {dict?.pages?.home?.methodology?.accent3}
          </span>
        </p>

        <Button
          theme="dark"
          icon={<ArrowRight size={20} weight="bold" />}
          className="mt-12"
          href={`/${locale}/methodology`}
        >
          {dict?.pages?.home?.methodology?.cta}
        </Button>
      </div>
    </section>
  );
}
