"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import FolderStackSection from "./FolderStackSection";

export default function Cases({
  locale,
  title = "CASES",

  imageSrc = "/assets/logo_icon.svg",
  ctaLabel = "Explore Cases",

  externalBg = false,
}) {
  const pathname = usePathname();
  const firstSeg = pathname?.split("/").filter(Boolean)[0];
  const supportedLocales = ["en", "nl"];
  const detectedLocale = supportedLocales.includes(firstSeg)
    ? firstSeg
    : undefined;
  const effectiveLocale = locale ?? detectedLocale;

  const sectionRef = useRef(null);
  const [bgY, setBgY] = useState(0);
  const baseOffset = -200; // shift image higher near the title

  const accent =
    "text-xl md:text-3xl font-bold mb-2 text-[var(--content_brand)]";

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Parallax factor: adjust 0.2-0.4 for more/less movement
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
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ minHeight: "70vh" }}
    >
      {!externalBg && (
        <>
          <div
            className="absolute inset-0 overflow-hidden z-0 bg-red-200"
            aria-hidden
          >
            <div
              className="absolute left-0 top-0 w-full h-[140%]"
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
          <div className="absolute inset-0 bg-background/40 z-10" />
        </>
      )}
      <div className="relative z-20 mx-auto max-w-5xl px-6 py-16 flex flex-col gap-6">
        <h2 className="text font-monument-extended text-stroke-brand text-5xl md:text-9xl tracking-tight">
          {title}
        </h2>
        <p className="text-xl md:text-3xl text-left text-[var(--content_dark)] max-w-md mt-40">
          Explore our cases to discover what{" "}
          <span className={accent}>human centered</span> impact looks like in
          practice.
        </p>
      </div>
      <div className="pt-16">
        <FolderStackSection locale={effectiveLocale} />
      </div>
    </section>
  );
}
