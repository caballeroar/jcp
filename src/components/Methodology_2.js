"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui";
import { ArrowRight } from "phosphor-react";

export default function Methodology2({ locale }) {
  const accent = "font-bold mb-2 text-[var(--content_brand)]";

  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Simple scroll progress just for this section
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // 0 when section top is at bottom of viewport,
      // 1 when the section is fully in view (section bottom reaches viewport top).
      const start = vh;
      const end = -rect.height;
      const raw = (start - rect.top) / (start - end || 1);
      const p = Math.max(0, Math.min(1, raw));
      setProgress(p);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const lerp = (a, b, t) => a + (b - a) * t;
  // Ease-out to make ellipses slow down as they approach center
  const easeOut = (t) => 1 - Math.pow(1 - t, 5);
  const t = easeOut(progress);

  // Motion: each ellipse starts off in its corner and moves toward
  // a symmetric 2x2 grid around the center of the section.
  const START_X = 600;
  const START_Y = 400;
  const END_X = 240;
  const END_Y = 240;

  const tlDx = lerp(-START_X, -END_X, t);
  const tlDy = lerp(-START_Y, -END_Y, t);
  const trDx = lerp(START_X, END_X, t);
  const trDy = lerp(-START_Y, -END_Y, t);
  const blDx = lerp(-START_X, -END_X, t);
  const blDy = lerp(START_Y, END_Y, t);
  const brDx = lerp(START_X, END_X, t);
  const brDy = lerp(START_Y, END_Y, t);

  const textRaw = (t - 0.6) / 0.3;
  const textProgress = Math.max(0, Math.min(1, textRaw));
  const textOpacity = textProgress;
  const textTranslateY = 20 * (1 - textProgress);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen m-auto flex items-center justify-center overflow-visible"
    >
      {/* Four identical ellipses, each centered then offset by scroll-based dx/dy */}

      <EllipseSvg dx={tlDx} dy={tlDy} rotation={-45} />
      <EllipseSvg dx={trDx} dy={trDy} rotation={45} />
      <EllipseSvg dx={blDx} dy={blDy} rotation={-135} />
      <EllipseSvg dx={brDx} dy={brDy} rotation={135} />

      <div
        className="w-4/6 lg:w-3/6 2xl:w-2/6 flex flex-col justify-center items-center text-[var(--content_dark)] "
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
          transition: "opacity 0.2s linear, transform 0.2s linear",
        }}
      >
        <p className="text-lg sm:text-xl md:text-3xl xl:text-4xl font-semibold  leading-tight text-center tracking-tight">
          Every challenge revolves around people.
        </p>
        <p
          className="mt-8
         text-lg sm:text-xl md:text-3xl xl:text-4xl font-semibold  leading-tight text-center tracking-tight"
        >
          We help you strengthen <span className={accent}>understanding</span>,
          <span className={accent}> trust</span> and
          <span className={accent}> collaboration</span>.
        </p>

        <Button
          theme="dark"
          icon={<ArrowRight size={20} weight="bold" />}
          className="mt-8"
        >
          Methodology
        </Button>
      </div>
    </section>
  );
}

function EllipseSvg({ dx, dy, rotation }) {
  return (
    <svg
      className="absolute top-1/2 left-1/2 w-[360px] h-auto overflow-visible pointer-events-none"
      style={{
        transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
      }}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="200"
        cy="200"
        rx="140"
        ry="320"
        transform={`rotate(${rotation} 200 200)`}
        stroke="#DF4D20"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
    </svg>
  );
}
