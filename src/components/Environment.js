"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../lib/I18nContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useViewportWidth } from "../hooks/useViewportWidth";

const INTRO_DURATION_MS = 1400;
const MAX_SCALE = 1.75;
const DELAYS = [0.0, 0.12, 0.24, 0.36];
const END_PROGRESS = 0.85;
const FADE_WINDOW = 0.12;
const PARALLAX_PX = 120;
const BASE_Y = -120;
const DEPTHS = [0.15, 0.25, 0.35, 0.45];
const AUTO_AMP = 40;
const AUTO_FREQ = 0.1;
const TAU = 2 * Math.PI;
const FADE_START_RATIO = 0.55;
const FADE_DURATION_RATIO = 0.35;

// Mobile framing controls for this component:
// - MOBILE_MAX_WIDTH_PX: below this width, we apply a zoomed composition.
// - MOBILE_SVG_SIZE_VMIN: larger SVG size crops outer rings so center + second ring dominate.
// - MOBILE_SVG_OFFSET_Y_PX: vertical nudge to keep "people" visually centered after zoom.
// - DESKTOP_SVG_SIZE_VMIN: baseline framing for >= MOBILE_MAX_WIDTH_PX.
const MOBILE_MAX_WIDTH_PX = 640;
const MOBILE_SVG_SIZE_VMIN = 190;
const MOBILE_SVG_OFFSET_Y_PX = -28;
const DESKTOP_SVG_SIZE_VMIN = 120;
const TABLET_MAX_WIDTH_PX = 1024;

const BASE_RADII = [120, 240, 400, 600];
const RING_ASSIGNMENTS = [
  ...Array(7).fill(1),
  ...Array(7).fill(2),
  ...Array(6).fill(3),
];

const SPIN_STYLE_60 = {
  transformOrigin: "500px 500px",
  transformBox: "view-box",
  animationDuration: "60s",
  animationTimingFunction: "linear",
};

const SPIN_STYLE_120 = {
  transformOrigin: "500px 500px",
  transformBox: "view-box",
  animationDuration: "120s",
  animationTimingFunction: "linear",
};

const SPIN_STYLE_240 = {
  transformOrigin: "500px 500px",
  transformBox: "view-box",
  animationDuration: "240s",
  animationTimingFunction: "linear",
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const round3 = (n) => Math.round(n * 1000) / 1000;
const easeOutCubic = (t) => 1 - Math.pow(1 - clamp01(t), 3);

const easeInOutCubic = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

const toRingScale = (progress, delay) => {
  const rpRaw = (progress - delay) / Math.max(0.0001, END_PROGRESS - delay);
  const rp = easeOutCubic(clamp01(rpRaw));
  return 1 + rp * (MAX_SCALE - 1);
};

const buildWordLayout = (words) => {
  return words.map((word, i) => {
    const ringIndex = RING_ASSIGNMENTS[i % RING_ASSIGNMENTS.length];
    const baseR = BASE_RADII[ringIndex];
    const angleRad = ((i * 137.5) % 360) * (Math.PI / 180);
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const phase = (i * 47.3) % (2 * Math.PI);
    const amp = 14 + (i % 4);
    const speed = i % 5 === 0 ? 1.25 : 1.0;
    const autoPhase = (i * 13.37) % (2 * Math.PI);
    const autoSpeed = 0.8 + (i % 4) * 0.15;

    return {
      word,
      ringIndex,
      baseR,
      cos,
      sin,
      phase,
      amp,
      speed,
      autoPhase,
      autoSpeed,
    };
  });
};

export default function Environment({ locale }) {
  const i18n = useI18n();
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewportWidth = useViewportWidth();

  const [scrollRatio, setScrollRatio] = useState(0);
  const [introProgressRaw, setIntroProgressRaw] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // PERF + Safari compatibility: older WebKit uses addListener/removeListener
    // on MediaQueryList and can throw if addEventListener is used directly.
    const media = window.matchMedia("(hover: none) and (pointer: coarse)");
    const onChange = () => setIsCoarsePointer(media.matches);

    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const isMobileDevice =
    viewportWidth > 0 && viewportWidth < MOBILE_MAX_WIDTH_PX;
  const isTabletDevice =
    viewportWidth >= MOBILE_MAX_WIDTH_PX &&
    viewportWidth <= TABLET_MAX_WIDTH_PX;

  // PERF: touch devices get a slightly larger state-change threshold to reduce
  // scroll-driven rerenders while preserving the same visual progression.
  const scrollUpdateThreshold = isCoarsePointer ? 0.003 : 0.001;

  useEffect(() => {
    let rafId = null;

    const onScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = window.pageYOffset || doc.scrollTop || 0;
        const viewport = window.innerHeight || 1;
        const ratio = clamp01(scrollTop / viewport);

        setScrollRatio((prev) =>
          Math.abs(prev - ratio) < scrollUpdateThreshold ? prev : ratio,
        );

        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollUpdateThreshold]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId = null;
    const start =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    const step = (now) => {
      const current = typeof performance !== "undefined" ? now : Date.now();
      const elapsed = current - start;
      const t = clamp01(elapsed / INTRO_DURATION_MS);
      setIntroProgressRaw(easeOutCubic(t));

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const effectiveLocale = i18n?.locale || locale || "en";
  const innerLabel =
    i18n?.dict?.environment?.innerLabel ??
    (effectiveLocale === "nl" ? "mensen" : "people");

  const allWords = useMemo(() => {
    const dictWords = i18n?.dict?.pages?.home?.environment?.words;
    return Array.isArray(dictWords) ? dictWords : [];
  }, [i18n?.dict?.pages?.home?.environment?.words]);

  const wordLayout = useMemo(() => buildWordLayout(allWords), [allWords]);

  const scrollProgress = 1 - scrollRatio;
  const introProgress = prefersReducedMotion ? 1 : introProgressRaw;
  const progress = Math.min(introProgress, scrollProgress);

  const scalesRounded = useMemo(
    () => DELAYS.map((d) => round3(toRingScale(progress, d))),
    [progress],
  );

  const opacities = useMemo(
    () => DELAYS.map((d) => clamp01((progress - d) / FADE_WINDOW)),
    [progress],
  );

  const offsetsY = useMemo(
    () => DELAYS.map((_, i) => BASE_Y + DEPTHS[i] * PARALLAX_PX * progress),
    [progress],
  );

  const offsetsYRounded = useMemo(
    () => offsetsY.map((v) => round3(v)),
    [offsetsY],
  );

  const autoAmp = viewportWidth > 1200 && !isCoarsePointer ? AUTO_AMP : 26;
  const isMobileFrame = isMobileDevice;
  const svgSizeVmin = isMobileFrame
    ? MOBILE_SVG_SIZE_VMIN
    : DESKTOP_SVG_SIZE_VMIN;
  const svgOffsetYPx = isMobileFrame ? MOBILE_SVG_OFFSET_Y_PX : 0;

  // Progressive enhancement strategy:
  // - Desktop: full ambient floating
  // - Tablet: medium ambient floating (fewer/slower moving words)
  // - Mobile/touch small screens: ambient floating off (keep intro + scroll)
  const ambientTier = useMemo(() => {
    if (!mounted || prefersReducedMotion) return "off";
    if (isMobileDevice) return "off";
    if (isTabletDevice || isCoarsePointer) return "medium";
    return "full";
  }, [
    mounted,
    prefersReducedMotion,
    isMobileDevice,
    isTabletDevice,
    isCoarsePointer,
  ]);

  const globalOpacity = mounted
    ? 1 - clamp01((scrollRatio - FADE_START_RATIO) / FADE_DURATION_RATIO)
    : 1;

  // PERF: Precompute render-ready word data so render stays mostly a cheap map.
  const positionedWords = useMemo(() => {
    return wordLayout.map(
      (
        {
          word,
          ringIndex,
          baseR,
          cos,
          sin,
          phase,
          amp,
          speed,
          autoPhase,
          autoSpeed,
        },
        i,
      ) => {
        const delta = amp * Math.sin(progress * Math.PI * speed + phase);
        const minR = ringIndex === 1 ? 200 : ringIndex === 2 ? 380 : 460;
        const r = Math.max(baseR + delta, minR);
        const x = 500 + r * cos;
        const y = 500 + r * sin + offsetsY[ringIndex];
        const appear = easeInOutCubic(
          clamp01((progress - DELAYS[ringIndex]) / (FADE_WINDOW * 0.9)),
        );

        // PERF: autonomous motion is handed to SVG animateTransform (no React timer rerenders).
        const tierAmp = ambientTier === "full" ? autoAmp : autoAmp * 0.55;
        const autoDx = round3(cos * tierAmp);
        const autoDy = round3(sin * tierAmp);
        const basePeriodSec = 1 / (AUTO_FREQ * autoSpeed);
        const autoPeriodSec = round3(
          ambientTier === "full" ? basePeriodSec : basePeriodSec * 1.35,
        );
        const autoBeginSec = round3(
          -(autoPhase / (TAU * AUTO_FREQ * autoSpeed)),
        );

        const shouldAnimateAmbient =
          ambientTier === "full"
            ? true
            : ambientTier === "medium"
              ? i % 2 === 0
              : false;

        return {
          key: `${word}-${i}`,
          word,
          x: round3(x),
          y: round3(y),
          appear,
          autoDx,
          autoDy,
          autoPeriodSec,
          autoBeginSec,
          shouldAnimateAmbient,
        };
      },
    );
  }, [wordLayout, progress, offsetsY, autoAmp, ambientTier]);

  const containerStyle = useMemo(
    () => ({
      opacity: globalOpacity,
      background: "var(--background)",
      zIndex: 5,
    }),
    [globalOpacity],
  );

  const svgStyle = useMemo(
    () => ({
      overflow: "visible",
      transform: `translateY(${svgOffsetYPx}px)`,
    }),
    [svgOffsetYPx],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 flex flex-col items-center justify-center sm:top-[10%]"
      style={containerStyle}
    >
      <div className="inset-0 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            width={`${svgSizeVmin}vmin`}
            height={`${svgSizeVmin}vmin`}
            viewBox="-200 -200 1400 1400"
            style={svgStyle}
          >
            <g
              transform={`translate(0 ${offsetsYRounded[0]})`}
              opacity={easeInOutCubic(opacities[0])}
            >
              <g
                transform={`translate(500 500) scale(${scalesRounded[0]}) translate(-500 -500)`}
              >
                <circle
                  cx="500"
                  cy="500"
                  r="120"
                  fill="none"
                  stroke="var(--content_brand)"
                  strokeWidth="1.6"
                />
              </g>
            </g>

            <g
              transform={`translate(0 ${offsetsYRounded[1]})`}
              opacity={easeInOutCubic(opacities[1])}
            >
              <g className="animate-spin-slow" style={SPIN_STYLE_60}>
                <g
                  transform={`translate(500 500) scale(${scalesRounded[1]}) translate(-500 -500)`}
                >
                  <circle
                    cx="500"
                    cy="500"
                    r="240"
                    fill="none"
                    stroke="var(--content_brand)"
                    strokeWidth="1.6"
                    strokeDasharray="8 4"
                    strokeOpacity="0.8"
                  />
                </g>
              </g>
            </g>

            <g
              transform={`translate(0 ${offsetsYRounded[2]})`}
              opacity={easeInOutCubic(opacities[2])}
            >
              <g className="animate-spin-slow" style={SPIN_STYLE_120}>
                <g
                  transform={`translate(500 500) scale(${scalesRounded[2]}) translate(-500 -500)`}
                >
                  <circle
                    cx="500"
                    cy="500"
                    r="320"
                    fill="none"
                    stroke="var(--content_brand)"
                    strokeWidth="1.3"
                    strokeDasharray="6 4"
                    strokeOpacity="0.6"
                  />
                </g>
              </g>
            </g>

            <g
              transform={`translate(0 ${offsetsYRounded[3]})`}
              opacity={easeInOutCubic(opacities[3])}
            >
              <g className="animate-spin-slow" style={SPIN_STYLE_240}>
                <g
                  transform={`translate(500 500) scale(${scalesRounded[3]}) translate(-500 -500)`}
                >
                  <circle
                    cx="500"
                    cy="500"
                    r="400"
                    fill="none"
                    stroke="var(--content_brand)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    strokeOpacity="0.4"
                  />
                </g>
              </g>
            </g>

            <g
              transform={`translate(0 ${offsetsYRounded[0]})`}
              opacity={easeInOutCubic(opacities[0])}
            >
              <text
                x={500}
                y={500}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-roboto-mono"
                style={{
                  fill: "var(--content_brand)",
                  letterSpacing: "normal",
                  fontFamily: "var(--font-roboto-mono)",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
                fontSize={28}
              >
                {innerLabel}
              </text>
            </g>

            {positionedWords.map((item) => (
              <text
                key={item.key}
                x={item.x}
                y={item.y}
                textAnchor="middle"
                className="font-roboto-mono font-medium"
                style={{
                  fill: "var(--content_dark)",
                  letterSpacing: "normal",
                  opacity: item.appear,
                  fontFamily: "var(--font-roboto-mono)",
                  textTransform: "capitalize",
                }}
                fontSize={20}
              >
                {item.word}
                {item.shouldAnimateAmbient && (
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values={`${-item.autoDx} ${-item.autoDy}; ${item.autoDx} ${item.autoDy}; ${-item.autoDx} ${-item.autoDy}`}
                    dur={`${item.autoPeriodSec}s`}
                    begin={`${item.autoBeginSec}s`}
                    repeatCount="indefinite"
                  />
                )}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
