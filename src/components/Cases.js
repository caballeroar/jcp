"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import FolderStackSection from "./FolderStackSection";
import FolderIcon from "./ui/Folder";
import { ArrowRight } from "phosphor-react";

export default function Cases({
  locale,
  href,
  imageSrc = "/assets/logo_icon.svg",

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
  const [scrollY, setScrollY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const baseOffset = -200; // shift image higher near the title

  const targetHref =
    href || (effectiveLocale ? `/${effectiveLocale}/cases` : "/cases");

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
        setScrollY(rect.top);
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

  // Track viewport width for responsive folder sizing and positioning
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setViewportWidth(window.innerWidth);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Responsive folder width: 100% at 375px, 50% at 1440px
  const minViewport = 375;
  const maxViewport = 1440;
  const minFraction = 0.5; // 50%
  const maxFraction = 1; // 100%
  const vw = viewportWidth || minViewport;
  const clampedVw = Math.min(Math.max(vw, minViewport), maxViewport);
  const t = (clampedVw - minViewport) / (maxViewport - minViewport);
  const widthFraction = maxFraction - t * (maxFraction - minFraction);
  const folderWidth = `${widthFraction * 100}%`;

  // Desktop horizontal positions for each folder
  const desktopLeftPositions = [10, 45, 15, 35];

  // Responsive horizontal positioning
  const centerLeftPercent = (1 - widthFraction) * 50; // centers the folder

  const computeLeftPercent = (index) => {
    const vwCurrent = viewportWidth || minViewport;

    // Small screens: keep fully centered
    if (vwCurrent <= 640) {
      return centerLeftPercent;
    }

    // Large screens: reach full desktop positions
    if (vwCurrent >= 1280) {
      return desktopLeftPositions[index] ?? centerLeftPercent;
    }

    // In between 640 and 1280: interpolate
    const tPos = (vwCurrent - 640) / (1280 - 640);
    const desktopTarget = desktopLeftPositions[index] ?? centerLeftPercent;
    return centerLeftPercent + tPos * (desktopTarget - centerLeftPercent);
  };

  return (
    <section ref={sectionRef} className="relative w-full pt-80 mb-[-20%]">
      {/* {!externalBg && (
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
      )} */}
      <div className="relative z-20 mx-auto max-w-5xl overflow-hidden px-6 py-16 flex flex-col items-center gap-6">
        <h2 className="text font-monument-extended text-stroke-brand text-8xl md:text-9xl tracking-tight">
          CASES
        </h2>
        <div className="flex justify-start w-full">
          <p className="text-xl md:text-3xl text-left text-[var(--content_dark)] max-w-md mt-20 md:mt-40">
            Explore our cases to discover what{" "}
            <span className={accent}>human centered</span> impact looks like in
            practice.
          </p>
        </div>
      </div>
      <div className="md:pt-16">
        {/* <FolderStackSection locale={effectiveLocale} /> */}

        <div
          style={{
            width: folderWidth,
            marginLeft: `${computeLeftPercent(0)}%`,
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          <FolderIcon />
        </div>
        <div
          style={{
            width: folderWidth,
            marginLeft: `${computeLeftPercent(1)}%`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <FolderIcon />
        </div>
        <div
          style={{
            width: folderWidth,
            marginLeft: `${computeLeftPercent(2)}%`,
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        >
          <FolderIcon />
        </div>
        <div
          style={{
            width: folderWidth,
            marginLeft: `${computeLeftPercent(3)}%`,
            transform: `translateY(${scrollY * 0.25}px)`,
          }}
        >
          <FolderIcon />
        </div>
        <div
          className="w-full flex justify-center mx-auto mt-100"
          style={{
            transform: `translateY(${scrollY * 0.46}px)`,
          }}
        >
          <Button href={targetHref} icon={<ArrowRight />}>
            Explore Cases
          </Button>
        </div>
      </div>
    </section>
  );
}
