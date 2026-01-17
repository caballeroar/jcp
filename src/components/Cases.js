"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import FolderStackSection from "./FolderStackSection";
import FolderIcon from "./ui/Folder/Folder";
import { ArrowRight } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { getCaseImages } from "../data/cases";

export default function Cases({
  locale,
  href,
  imageSrc = "/assets/logo_icon.svg",
  externalBg = false,
}) {
  const { locale: contextLocale, dict } = useI18n();
  const pathname = usePathname();
  const firstSeg = pathname?.split("/").filter(Boolean)[0];
  const supportedLocales = ["en", "nl"];
  const detectedLocale = supportedLocales.includes(firstSeg)
    ? firstSeg
    : undefined;
  const effectiveLocale = locale ?? detectedLocale ?? contextLocale;

  const sectionRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const baseOffset = -200; // shift image higher near the title

  const accent =
    "text-xl md:text-3xl font-bold mb-2 text-[var(--content_brand)]";

  const outlinedHeading =
    "text font-monument-extended text-stroke-brand text-8xl md:text-9xl tracking-tight";

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--cases-scroll", `${rect.top}px`);
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

  const targetHref =
    href || (effectiveLocale ? `/${effectiveLocale}/cases` : "/cases");

  const casesCopy = dict?.pages?.home?.cases ?? {};
  const caseEntries = (casesCopy.folders ?? []).map((entry, idx) => ({
    slug: entry?.slug || `case-${idx + 1}`,
    client: entry?.client ?? "",
    sentence: entry?.sentence ?? "",
    cta: entry?.cta,
    images: getCaseImages(entry?.slug || `case-${idx + 1}`),
  }));
  const totalCases = caseEntries.length;
  const defaultCta = casesCopy.cta ?? "View case";
  const hasCases = totalCases > 0;
  const activeCase =
    expandedIndex !== null && expandedIndex < totalCases
      ? caseEntries[expandedIndex]
      : null;
  const isModalOpen = Boolean(activeCase);

  const openCase = (index) => {
    if (!caseEntries[index]) return;
    setExpandedIndex(index);
  };
  const closeCase = () => setExpandedIndex(null);
  const cycleCase = (delta) => {
    if (!hasCases || expandedIndex === null) return;
    setExpandedIndex((expandedIndex + delta + totalCases) % totalCases);
  };

  useEffect(() => {
    if (!isModalOpen || typeof document === "undefined") return;
    const { style } = document.body;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [isModalOpen]);

  const folderParallax = [0.1, 0.3, 0.4, 0.25];
  const expandedWidth = "min(640px, 90vw)";

  return (
    <section ref={sectionRef} className="relative w-full pt-80 mb-[-28%]">
      <div className="relative z-20 mx-auto max-w-5xl overflow-hidden px-6 py-16 flex flex-col items-center gap-6">
        <h2 className={outlinedHeading}>CASES</h2>
        <div className="flex justify-start w-full">
          <p className="text-xl md:text-3xl text-left text-[var(--content_dark)] max-w-md mt-20 md:mt-40">
            Explore our cases to discover what{" "}
            <span className={accent}>human centered</span> impact looks like in
            practice.
          </p>
        </div>
      </div>
      <div className="md:pt-16">
        {folderParallax.map((multiplier, index) => {
          const caseData = caseEntries[index];
          if (!caseData) return null;
          return (
            <div
              key={caseData.slug}
              style={{
                position: "relative",
                width: folderWidth,
                marginLeft: `${computeLeftPercent(index)}%`,
                transform: `translateY(calc(var(--cases-scroll, 0px) * ${multiplier}))`,
                transition: "transform 0.4s ease",
              }}
            >
              <FolderIcon
                title={caseData.client}
                description={caseData.sentence}
                images={caseData.images}
                cta={caseData.cta ?? defaultCta}
                onExpand={() => openCase(index)}
              />
            </div>
          );
        })}
        <div
          className="w-full flex justify-center mx-auto mt-100"
          style={{
            transform: "translateY(calc(var(--cases-scroll, 0px) * 0.46))",
          }}
        >
          <Button href={targetHref} icon={<ArrowRight />}>
            Explore Cases
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-[var(--background)]/95 backdrop-blur-lg">
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10 text-[var(--content_dark)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => cycleCase(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--content_brand)]"
              >
                Prev
              </button>
              <p className="font-roboto-mono text-sm text-[var(--grey)]">
                {expandedIndex + 1} / {totalCases}
              </p>
              <button
                type="button"
                onClick={() => cycleCase(1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--content_brand)]"
              >
                Next
              </button>
            </div>

            <article className="rounded-3xl h-[50vh] border border-[var(--surface)]/10 bg-[var(--bg_box_neutral)] p-8 shadow-2xl">
              <h3 className="text-3xl font-semibold">{activeCase.client}</h3>
              <p className="mt-4 text-lg leading-relaxed">
                {activeCase.sentence}
              </p>
            </article>

            <div className="grid gap-4 md:grid-cols-2">
              {caseEntries.map((entry, idx) => (
                <button
                  key={`${entry.client}-${idx}`}
                  type="button"
                  onClick={() => openCase(idx)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    idx === expandedIndex
                      ? "border-[var(--content_brand)] bg-[var(--content_brand)]/5"
                      : "border-[var(--surface)]/10"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    {entry.client}
                  </p>
                  <p className="mt-2 text-sm text-[var(--grey)] line-clamp-2">
                    {entry.sentence}
                  </p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={closeCase}
              className="self-center rounded-full border border-[var(--surface)]/20 px-8 py-3 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
