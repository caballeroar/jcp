"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CaretLeft, CaretRight, X } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { Button } from "./ui";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { useViewportWidth } from "../hooks/useViewportWidth";
import { METHODOLOGY } from "../data/methodology";
// import "../app/globals.css";

const CONTACT_ORBITS = [
  {
    transform: "rotate(-59.1622 384.402 405.368)",
    centerX: 294.402,
    centerY: 365.368,
    path: "M 525.66 405.368 A 141.258 302.174 0 1 0 243.144 405.368 A 141.258 302.174 0 1 0 525.66 405.368 Z",
    labelKey: "identify",
    duration: "48s",
    textClass: "font-roboto-mono rotate-60",
  },
  {
    transform: "rotate(54.5895 724.149 335.821)",
    centerX: 724.149,
    centerY: 335.821,
    path: "M 879.569 335.821 A 155.42 360.959 0 1 0 568.729 335.821 A 155.42 360.959 0 1 0 879.569 335.821 Z",
    labelKey: "listen",
    duration: "42s",
    textClass: "font-roboto-mono rotate-[-55deg]",
  },
  {
    transform: "rotate(-123.807 352.906 618.302)",
    centerX: 282.906,
    centerY: 788.302,
    path: "M 500.618 618.302 A 147.712 325.811 0 1 0 205.194 618.302 A 147.712 325.811 0 1 0 500.618 618.302 Z",
    labelKey: "experience",
    duration: "48s",
    textClass: "font-roboto-mono rotate-124",
  },
  {
    transform: "rotate(135 745.172 691.067)",
    centerX: 745.172,
    centerY: 791.067,
    path: "M 886.231 691.067 A 141.059 427.338 0 1 0 604.113 691.067 A 141.059 427.338 0 1 0 886.231 691.067 Z",
    labelKey: "translate",
    duration: "46s",
    textClass: "font-roboto-mono rotate-225",
  },
];

const CONTACT_ELLIPSE_MAP_DESKTOP = [
  { xStart: -600, yStart: -400, xEnd: -260, yEnd: -220 },
  { xStart: 600, yStart: -400, xEnd: 260, yEnd: -220 },
  { xStart: -600, yStart: 400, xEnd: -260, yEnd: 260 },
  { xStart: 600, yStart: 400, xEnd: 260, yEnd: 260 },
];

const CONTACT_ELLIPSE_MAP_TABLET = [
  { xStart: -500, yStart: -320, xEnd: -215, yEnd: -180 },
  { xStart: 500, yStart: -320, xEnd: 215, yEnd: -180 },
  { xStart: -500, yStart: 320, xEnd: -215, yEnd: 220 },
  { xStart: 500, yStart: 320, xEnd: 215, yEnd: 220 },
];

const CONTACT_ELLIPSE_MAP_MOBILE = [
  { xStart: -360, yStart: -240, xEnd: -120, yEnd: -135 },
  { xStart: 360, yStart: -240, xEnd: 120, yEnd: -135 },
  { xStart: -360, yStart: 220, xEnd: -120, yEnd: 90 },
  { xStart: 360, yStart: 220, xEnd: 120, yEnd: 90 },
];

const ORBIT_SCALE = 1.55;
const VIEWBOX_CENTER_X = 574;
const VIEWBOX_CENTER_Y = 546.5;

function OrbitGlyph({ id, orbit, label }) {
  const offsetX = VIEWBOX_CENTER_X - orbit.centerX;
  const offsetY = VIEWBOX_CENTER_Y - orbit.centerY;

  return (
    <g
      transform={`translate(${VIEWBOX_CENTER_X} ${VIEWBOX_CENTER_Y}) scale(${ORBIT_SCALE}) translate(${-VIEWBOX_CENTER_X} ${-VIEWBOX_CENTER_Y})`}
    >
      <g transform={`translate(${offsetX} ${offsetY})`}>
        <g transform={orbit.transform}>
          <path
            id={id}
            d={orbit.path}
            fill="none"
            stroke="var(--content_brand)"
          />
          <g>
            <circle r="4" fill="var(--content_brand)" />
            <text
              x="14"
              y="6"
              fill="var(--content_brand)"
              fontSize="14"
              className={orbit.textClass}
            >
              {label}
            </text>
            <animateMotion
              dur={orbit.duration}
              repeatCount="indefinite"
              rotate="0"
            >
              <mpath xlinkHref={`#${id}`} />
            </animateMotion>
          </g>
        </g>
      </g>
    </g>
  );
}

export default function Methodology2() {
  const { dict } = useI18n();
  const viewportWidth = useViewportWidth();
  const methodology = dict?.pages?.home?.methodology || {};
  const { sentence1, accent, sentence2, sentence3, cta } = methodology;
  const sectionRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionStage, setTransitionStage] = useState("idle");
  const [slideDirection, setSlideDirection] = useState(1);

  const methodologyItems = useMemo(() => METHODOLOGY, []);
  const activeItem = methodologyItems[activeIndex] ?? methodologyItems[0];

  const contactEllipseMap = useMemo(() => {
    if (viewportWidth > 0 && viewportWidth < 640) {
      return CONTACT_ELLIPSE_MAP_MOBILE;
    }

    if (viewportWidth > 0 && viewportWidth < 1024) {
      return CONTACT_ELLIPSE_MAP_TABLET;
    }

    return CONTACT_ELLIPSE_MAP_DESKTOP;
  }, [viewportWidth]);

  useScrollProgress(sectionRef, { start: 0.12, end: 0.42 });

  const accentStyle = "font-bold text-[var(--content_brand)]";

  const goToIndex = useCallback(
    (index, directionHint = 1) => {
      const total = methodologyItems.length;
      if (!total || transitionStage !== "idle") return;

      const nextIndex = (index + total) % total;
      if (nextIndex === activeIndex) return;

      setSlideDirection(directionHint >= 0 ? 1 : -1);
      setTransitionStage("out");

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setActiveIndex(nextIndex);
        setTransitionStage("in");

        transitionTimeoutRef.current = setTimeout(() => {
          setTransitionStage("idle");
        }, 220);
      }, 160);
    },
    [activeIndex, methodologyItems.length, transitionStage],
  );

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }

      if (event.key === "ArrowRight") {
        goToIndex(activeIndex + 1, 1);
      }

      if (event.key === "ArrowLeft") {
        goToIndex(activeIndex - 1, -1);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, goToIndex, isModalOpen]);

  const motionClass =
    transitionStage === "out"
      ? slideDirection > 0
        ? "opacity-0 -translate-x-8"
        : "opacity-0 translate-x-8"
      : "opacity-100 translate-x-0";

  return (
    <section
      ref={sectionRef}
      className="methodology relative w-full min-h-[80svh] xl:min-h-screen flex items-center justify-center overflow-visible"
    >
      {CONTACT_ORBITS.map((orbit, index) => {
        const coords =
          contactEllipseMap[index] ?? CONTACT_ELLIPSE_MAP_DESKTOP[index];
        const id = `methodologyContactPath${index + 1}`;
        const label = dict?.pages?.home?.contact?.[orbit.labelKey] ?? "";
        return (
          <svg
            key={id}
            className="ellipse opacity-70 w-[360px] sm:w-[520px] md:w-[680px] lg:w-[780px] overflow-visible"
            data-index={index}
            viewBox="0 0 1148 1093"
            aria-hidden
            style={{
              "--x-start": `${coords.xStart}px`,
              "--y-start": `${coords.yStart}px`,
              "--x-end": `${coords.xEnd}px`,
              "--y-end": `${coords.yEnd}px`,
            }}
          >
            <OrbitGlyph id={id} orbit={orbit} label={label} />
          </svg>
        );
      })}

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-4 text-center sm:gap-8 sm:px-6 md:px-10">
        <div className="rounded-full bg-white/80 px-4 py-2 sm:px-6">
          <p className="text-[clamp(0.9rem,3.8vw,1.5rem)] font-normal tracking-tight leading-tight">
            {sentence3}
          </p>
        </div>
        <p className="mt-2 max-w-[24ch] text-[clamp(1.35rem,7vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.02em]">
          {sentence1}
          <span className={accentStyle}>{accent}</span>
          {sentence2}
        </p>

        <Button
          theme="dark"
          icon={<ArrowRight size={20} weight="bold" />}
          className="mt-6 w-full justify-center sm:mt-10 sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          {cta}
        </Button>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
            aria-hidden
          />

          <div
            className="relative h-screen w-screen overflow-hidden bg-[var(--background)] text-[var(--content_dark)]"
            role="dialog"
            aria-modal="true"
            aria-label="Methodology details"
          >
            <div className="pointer-events-none absolute -top-40 -left-28 h-96 w-96 rounded-full bg-[var(--content_brand)]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[var(--content_brand)]/15 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
              <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 md:px-10 md:py-6">
                <div>
                  <p className="font-roboto-mono text-xs uppercase tracking-[0.2em] text-[var(--content_brand)]">
                    Methodology
                  </p>
                  <h2 className="mt-1 text-[clamp(1.35rem,4.6vw,2.25rem)] font-bold tracking-tight">
                    {activeItem?.name}
                  </h2>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white/70 transition hover:bg-white"
                  aria-label="Close methodology modal"
                >
                  <X size={20} weight="bold" />
                </button>
              </header>

              <div className="border-b border-black/10 px-4 py-3 lg:hidden">
                <div className="flex gap-2 overflow-x-auto">
                  {methodologyItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={`mobile-${item.slug}`}
                        onClick={() =>
                          goToIndex(index, index >= activeIndex ? 1 : -1)
                        }
                        className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                          isActive
                            ? "border-[var(--content_brand)] bg-[var(--content_brand)] text-white"
                            : "border-black/15 bg-white/80"
                        }`}
                      >
                        {index + 1}. {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]">
                <aside className="hidden overflow-y-auto border-r border-black/10 bg-white/35 p-6 lg:block">
                  <div className="space-y-3">
                    {methodologyItems.map((item, index) => {
                      const isActive = index === activeIndex;

                      return (
                        <button
                          key={item.slug}
                          onClick={() =>
                            goToIndex(index, index >= activeIndex ? 1 : -1)
                          }
                          className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                            isActive
                              ? "border-[var(--content_brand)] bg-[var(--content_brand)] text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                              : "border-black/10 bg-white/80 hover:border-black/20"
                          }`}
                        >
                          <p className="font-roboto-mono text-[11px] uppercase tracking-[0.16em] opacity-75">
                            Step {index + 1}
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {item.name}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed opacity-85">
                            {item.service}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                <main className="overflow-y-auto px-5 py-6 md:px-10 md:py-10">
                  <div className="mx-auto w-full max-w-4xl">
                    <div
                      className={`rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-300 md:p-8 ${motionClass}`}
                    >
                      <p className="font-roboto-mono text-xs uppercase tracking-[0.2em] text-[var(--content_brand)]">
                        {activeItem?.service}
                      </p>

                      <p className="mt-4 text-[clamp(1rem,2.8vw,1.25rem)] leading-relaxed md:mt-5">
                        {activeItem?.coreDescription}
                      </p>

                      <p className="mt-4 text-[clamp(0.9rem,2.2vw,1.05rem)] leading-relaxed opacity-85 md:mt-5">
                        {activeItem?.expandedDescription}
                      </p>

                      <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3">
                        {(activeItem?.benefits ?? []).map((benefit, index) => (
                          <article
                            key={benefit}
                            className={`rounded-2xl border border-black/10 bg-[var(--background)]/80 p-4 transition-all duration-300 ${
                              transitionStage === "out"
                                ? "translate-y-3 opacity-0"
                                : "translate-y-0 opacity-100"
                            }`}
                            style={{ transitionDelay: `${120 + index * 75}ms` }}
                          >
                            <p className="text-[clamp(0.85rem,2vw,1rem)] leading-relaxed">
                              {benefit}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          onClick={() => goToIndex(activeIndex - 1, -1)}
                          className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-white"
                        >
                          <CaretLeft size={16} weight="bold" />
                          Previous
                        </button>
                        <button
                          onClick={() => goToIndex(activeIndex + 1, 1)}
                          className="inline-flex items-center gap-2 rounded-full bg-[var(--content_brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          Next
                          <CaretRight size={16} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
