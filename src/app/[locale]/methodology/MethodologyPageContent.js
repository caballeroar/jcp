"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "phosphor-react";
import Button from "../../../components/ui/Button";
import EllipseSvg from "../../../components/ui/EllipseSvg";
import Header from "@/components/ui/Header";

const ELLIPSES = [
  {
    rotation: -45,
    coords: { xStart: -900, yStart: -520, xEnd: -320, yEnd: -220 },
  },
  {
    rotation: 45,
    coords: { xStart: 900, yStart: -520, xEnd: 320, yEnd: -220 },
  },
  {
    rotation: -135,
    coords: { xStart: -900, yStart: 520, xEnd: -320, yEnd: 400 },
  },
  { rotation: 135, coords: { xStart: 900, yStart: 520, xEnd: 320, yEnd: 400 } },
];

const ENTRANCE_DURATION = 1500;
const ENTRANCE_DELAY = 100;

const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const easeOutBackSlowTail = (t) => {
  const base = easeOutBack(t);
  if (t <= 0.6) return base;
  const slowZone = (t - 0.6) / 0.4;
  const damped = 1 - Math.pow(1 - t, 4);
  const blend = 0.5 + 0.5 * slowZone;
  return base - (base - damped) * blend;
};

export default function MethodologyPageContent({ copy, locale, ctaLabel }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf;
    const start = performance.now();
    const delayEnd = start + ENTRANCE_DELAY;

    const animateIn = (now) => {
      if (now < delayEnd) {
        section.style.setProperty("--scroll-progress", "0");
        section.style.setProperty("--scroll-progress-offset", "0");
        section.style.opacity = "0";
        raf = requestAnimationFrame(animateIn);
        return;
      }
      const t = Math.min(1, (now - delayEnd) / ENTRANCE_DURATION);
      const eased = easeOutBackSlowTail(t);
      const opacity = Math.min(1, Math.max(0, eased));
      section.style.setProperty("--scroll-progress", eased.toFixed(4));
      section.style.setProperty("--scroll-progress-offset", "0");
      section.style.opacity = opacity.toFixed(3);
      if (t < 1) {
        raf = requestAnimationFrame(animateIn);
      }
    };

    raf = requestAnimationFrame(animateIn);
    return () => raf && cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="methodology relative w-full min-h-screen flex items-center justify-center overflow-visible px-6 py-24 mt-[-10%]"
      style={{
        "--scroll-progress": 0,
        "--scroll-progress-offset": 0,
        opacity: 0,
      }}
    >
      {ELLIPSES.map((ellipse, index) => (
        <EllipseSvg
          key={index}
          index={index}
          rotation={ellipse.rotation}
          className="opacity-30 w-[440px]"
          coords={ellipse.coords}
        />
      ))}

      <div className="w-full mx-auto text-center space-y-6 relative z-10 mt-[14%]">
        <Header title={copy?.heading || "Methodology"} level="h2" />
        {copy?.sentence1 && (
          <p className="text-2xl md:text-3xl font-semibold text-[var(--content_dark)]">
            {copy.sentence1}
          </p>
        )}
        {copy?.sentence2 && (
          <p className="text-lg md:text-2xl text-[var(--content_dark)]/80">
            {copy.sentence2}
          </p>
        )}
        {ctaLabel && (
          <Button
            theme="dark"
            icon={<ArrowRight size={20} weight="bold" />}
            className="mt-10"
            href={`/${locale}/contact`}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
