"use client";

import { useEffect, useRef, useState } from "react";

import Cases from "./Cases";
import Methodology2 from "./Methodology_2";

export default function MethodologyCasesGroup({ locale }) {
  const groupRef = useRef(null);
  const [bgY, setBgY] = useState(0);
  const baseOffset = 800;
  const imageSrc = "/assets/logo_icon.svg";

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = groupRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setBgY(rect.top * 0.3);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={groupRef} className="relative w-full">
      {/* Shared parallax background across Methodology + Cases */}
      <div className="absolute inset-0 overflow-hidden z-0" aria-hidden>
        <div
          className="absolute left-0 top-0 w-full h-[200%]"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "contain",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            transform: `translateY(${baseOffset + bgY}px)`,
            willChange: "transform",
            opacity: 0.1,
          }}
        />
      </div>
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-background/40 z-10" />

      <div className="relative z-20 flex flex-col gap-16">
        <Methodology2 locale={locale} />
        <Cases locale={locale} externalBg />
      </div>
    </section>
  );
}
