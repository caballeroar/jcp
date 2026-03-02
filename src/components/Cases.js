"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import FolderIcon from "./ui/Folder/Folder";
import { ArrowRight } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { getCaseImages } from "../data/cases";
import { useCaseModal } from "../hooks/useCaseModal";
import CasesModal from "./CasesModal";
import Header from "./ui/Header";

export default function Cases({ href }) {
  const { locale, dict } = useI18n();
  const sectionRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const casesCopy = dict?.pages?.home?.cases ?? {};
  const {
    heading = "CASES",
    sentence1 = "Explore our cases to discover what ",
    sentence2 = "impact looks like in practice.",
    accent: accentText = "human centered",
    folders = [],
    cta: exploreCta = "Explore cases",
  } = casesCopy;

  const defaultCta = casesCopy.defaultCta ?? "View case";

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

  const caseEntries = folders.map((entry, idx) => ({
    slug: entry?.slug || `case-${idx + 1}`,
    client: entry?.client ?? "",
    sentence: entry?.sentence ?? "",
    logo: entry?.logo ?? null,
    cta: entry?.cta,
    images: getCaseImages(entry?.slug || `case-${idx + 1}`),
  }));
  const {
    expandedIndex,
    activeCase,
    isOpen,
    totalCases,
    openCase,
    closeCase,
    cycleCase,
  } = useCaseModal(caseEntries);

  const folderParallax = [0.1, 0.3, 0.4, 0.25];
  const accent =
    "text-xl md:text-3xl font-bold mb-2 text-[var(--content_brand)]";

  return (
    <section ref={sectionRef} className="relative w-full pt-80 mb-[-28%]">
      <div className="relative z-20 mx-auto max-w-5xl overflow-hidden px-6 py-16 flex flex-col items-center gap-6">
        <Header title={heading} level="h2" />
        <div className="flex justify-start w-full">
          <p className="text-xl md:text-3xl text-left text-[var(--content_dark)] max-w-md mt-20 md:mt-40">
            {sentence1} <span className={accent}>{accentText}</span> {sentence2}
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
                willChange: "transform",
              }}
            >
              <FolderIcon
                logo={caseData.logo}
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
          <Button href={`/${locale}/cases`} icon={<ArrowRight />}>
            {exploreCta}
          </Button>
        </div>
      </div>
      {isOpen && (
        <CasesModal
          isOpen={isOpen}
          activeCase={activeCase}
          expandedIndex={expandedIndex}
          totalCases={totalCases}
          cases={caseEntries}
          onClose={closeCase}
          onPrev={() => cycleCase(-1)}
          onNext={() => cycleCase(1)}
          onSelectCase={openCase}
          locale={locale}
        />
      )}
    </section>
  );
}
