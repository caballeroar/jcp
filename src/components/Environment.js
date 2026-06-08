"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

// Scroll performance tuning constants (single source of truth):
// - Threshold: minimum ratio delta required before redraw.
// - Quantization: snapping step for scroll ratio to smooth kinetic scrolling.
// - Min frame ms: upper bound on redraw frequency during scroll.
const SCROLL_THRESHOLD_DESKTOP = 0.001;
const SCROLL_THRESHOLD_TOUCH = 0.003;
const SCROLL_THRESHOLD_SAFARI_TOUCH = 0.0045;

const SCROLL_QUANTIZATION_DESKTOP = 0;
const SCROLL_QUANTIZATION_TOUCH = 0.0015;
const SCROLL_QUANTIZATION_SAFARI_TOUCH = 0.0025;

const SCROLL_MIN_FRAME_MS_DESKTOP = 0;
const SCROLL_MIN_FRAME_MS_TOUCH = 16;
const SCROLL_MIN_FRAME_MS_SAFARI_TOUCH = 20;

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

const getFrameValues = (progress) => {
  const scales = DELAYS.map((d) => round3(toRingScale(progress, d)));
  const opacities = DELAYS.map((d) =>
    easeInOutCubic(clamp01((progress - d) / FADE_WINDOW)),
  );
  const offsetsY = DELAYS.map(
    (_, i) => BASE_Y + DEPTHS[i] * PARALLAX_PX * progress,
  );
  const offsetsYRounded = offsetsY.map(round3);

  return {
    scales,
    opacities,
    offsetsY,
    offsetsYRounded,
  };
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

  const [mounted, setMounted] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const rootRef = useRef(null);
  const ringTranslateRefs = useRef([]);
  const ringScaleRefs = useRef([]);
  const labelGroupRef = useRef(null);
  const wordRefs = useRef([]);

  const scrollRatioRef = useRef(0);
  const introProgressRef = useRef(0);
  const drawRafRef = useRef(null);
  const scrollRafRef = useRef(null);
  const introRafRef = useRef(null);
  const lastScrollDrawTsRef = useRef(0);

  const prevFrameRef = useRef({
    opacity: null,
    ringOffsets: [null, null, null, null],
    ringScales: [null, null, null, null],
    ringOpacities: [null, null, null, null],
    words: [],
  });

  const requestDrawRef = useRef(() => {});

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

  const isSafariTouch = useMemo(() => {
    if (typeof window === "undefined") return false;

    // iPadOS can report desktop-like UA; include MacIntel + touchpoints.
    const ua = window.navigator.userAgent;
    const isAppleTouchDevice =
      /iPhone|iPad|iPod/i.test(ua) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);
    const isWebKit = /AppleWebKit/i.test(ua);
    const isAltIOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);

    return isAppleTouchDevice && isWebKit && !isAltIOSBrowser;
  }, []);

  const isMobileDevice =
    viewportWidth > 0 && viewportWidth < MOBILE_MAX_WIDTH_PX;
  const isTabletDevice =
    viewportWidth >= MOBILE_MAX_WIDTH_PX &&
    viewportWidth <= TABLET_MAX_WIDTH_PX;

  // Scroll-tuning knobs:
  // - threshold: minimum ratio delta needed before we redraw.
  // - quantization: snap ratio to tiny steps to smooth Safari kinetic scrolling.
  // - min frame ms: caps draw frequency only on touch-heavy paths.
  const scrollUpdateThreshold = isSafariTouch
    ? SCROLL_THRESHOLD_SAFARI_TOUCH
    : isCoarsePointer
      ? SCROLL_THRESHOLD_TOUCH
      : SCROLL_THRESHOLD_DESKTOP;
  const scrollQuantizationStep = isSafariTouch
    ? SCROLL_QUANTIZATION_SAFARI_TOUCH
    : isCoarsePointer
      ? SCROLL_QUANTIZATION_TOUCH
      : SCROLL_QUANTIZATION_DESKTOP;
  const minScrollFrameMs = isSafariTouch
    ? SCROLL_MIN_FRAME_MS_SAFARI_TOUCH
    : isCoarsePointer
      ? SCROLL_MIN_FRAME_MS_TOUCH
      : SCROLL_MIN_FRAME_MS_DESKTOP;

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

  const autoAmp = viewportWidth > 1200 && !isCoarsePointer ? AUTO_AMP : 26;
  const isMobileFrame = isMobileDevice;
  const svgSizeVmin = isMobileFrame
    ? MOBILE_SVG_SIZE_VMIN
    : DESKTOP_SVG_SIZE_VMIN;
  const svgOffsetYPx = isMobileFrame ? MOBILE_SVG_OFFSET_Y_PX : 0;

  // Motion strategy:
  // - Reduced motion or pre-mount: ambient motion off
  // - Otherwise: full ambient motion across all device sizes
  const ambientTier = useMemo(() => {
    if (!mounted || prefersReducedMotion) return "off";
    return "full";
  }, [mounted, prefersReducedMotion]);

  // PERF: Word constants are precomputed once and reused by the scroll RAF.
  const wordRuntime = useMemo(() => {
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
        const minR = ringIndex === 1 ? 200 : ringIndex === 2 ? 380 : 460;

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
              ? true
              : false;

        return {
          word,
          ringIndex,
          baseR,
          cos,
          sin,
          phase,
          amp,
          speed,
          minR,
          autoDx,
          autoDy,
          autoPeriodSec,
          autoBeginSec,
          shouldAnimateAmbient,
          key: `${word}-${i}`,
        };
      },
    );
  }, [wordLayout, autoAmp, ambientTier]);

  useEffect(() => {
    // Keep refs arrays aligned with rendered word nodes.
    wordRefs.current = wordRefs.current.slice(0, wordRuntime.length);
    prevFrameRef.current.words = prevFrameRef.current.words.slice(
      0,
      wordRuntime.length,
    );
  }, [wordRuntime.length]);

  const initialFrame = useMemo(() => getFrameValues(0), []);

  const initialWords = useMemo(() => {
    return wordRuntime.map((item) => {
      const delta = item.amp * Math.sin(item.phase);
      const r = Math.max(item.baseR + delta, item.minR);
      return {
        x: round3(500 + r * item.cos),
        y: round3(500 + r * item.sin + BASE_Y),
        opacity: 0,
      };
    });
  }, [wordRuntime]);

  const containerStyle = useMemo(
    () => ({
      opacity: 1,
      background: "var(--background)",
      zIndex: 5,
    }),
    [],
  );

  const svgStyle = useMemo(
    () => ({
      overflow: "visible",
      transform: `translateY(${svgOffsetYPx}px)`,
    }),
    [svgOffsetYPx],
  );

  useEffect(() => {
    const applyFrame = () => {
      const introProgress = prefersReducedMotion ? 1 : introProgressRef.current;
      const scrollProgress = 1 - scrollRatioRef.current;
      const progress = Math.min(introProgress, scrollProgress);

      const { scales, opacities, offsetsY, offsetsYRounded } =
        getFrameValues(progress);

      for (let i = 0; i < 4; i += 1) {
        const groupNode = ringTranslateRefs.current[i];
        const scaleNode = ringScaleRefs.current[i];

        const offset = offsetsYRounded[i];
        if (groupNode && prevFrameRef.current.ringOffsets[i] !== offset) {
          groupNode.setAttribute("transform", `translate(0 ${offset})`);
          prevFrameRef.current.ringOffsets[i] = offset;
        }

        const opacity = round3(opacities[i]);
        if (groupNode && prevFrameRef.current.ringOpacities[i] !== opacity) {
          groupNode.setAttribute("opacity", `${opacity}`);
          prevFrameRef.current.ringOpacities[i] = opacity;
        }

        const scale = scales[i];
        if (scaleNode && prevFrameRef.current.ringScales[i] !== scale) {
          scaleNode.setAttribute(
            "transform",
            `translate(500 500) scale(${scale}) translate(-500 -500)`,
          );
          prevFrameRef.current.ringScales[i] = scale;
        }
      }

      if (labelGroupRef.current) {
        labelGroupRef.current.setAttribute(
          "transform",
          `translate(0 ${offsetsYRounded[0]})`,
        );
        labelGroupRef.current.setAttribute(
          "opacity",
          `${round3(opacities[0])}`,
        );
      }

      const overlayOpacity = mounted
        ? 1 -
          clamp01(
            (scrollRatioRef.current - FADE_START_RATIO) / FADE_DURATION_RATIO,
          )
        : 1;

      if (
        rootRef.current &&
        prevFrameRef.current.opacity !== round3(overlayOpacity)
      ) {
        rootRef.current.style.opacity = `${round3(overlayOpacity)}`;
        prevFrameRef.current.opacity = round3(overlayOpacity);
      }

      for (let i = 0; i < wordRuntime.length; i += 1) {
        const item = wordRuntime[i];
        const textNode = wordRefs.current[i];
        if (!textNode) continue;

        const delta =
          item.amp * Math.sin(progress * Math.PI * item.speed + item.phase);
        const r = Math.max(item.baseR + delta, item.minR);
        const x = round3(500 + r * item.cos);
        const y = round3(500 + r * item.sin + offsetsY[item.ringIndex]);
        const appear = round3(
          easeInOutCubic(
            clamp01((progress - DELAYS[item.ringIndex]) / (FADE_WINDOW * 0.9)),
          ),
        );

        const prevWord = prevFrameRef.current.words[i] || {};

        if (prevWord.x !== x) {
          textNode.setAttribute("x", `${x}`);
        }
        if (prevWord.y !== y) {
          textNode.setAttribute("y", `${y}`);
        }
        if (prevWord.opacity !== appear) {
          textNode.setAttribute("opacity", `${appear}`);
        }

        prevFrameRef.current.words[i] = {
          x,
          y,
          opacity: appear,
        };
      }
    };

    const requestDraw = () => {
      if (drawRafRef.current) return;
      drawRafRef.current = requestAnimationFrame(() => {
        drawRafRef.current = null;
        applyFrame();
      });
    };

    requestDrawRef.current = requestDraw;
    requestDraw();

    return () => {
      if (drawRafRef.current) {
        cancelAnimationFrame(drawRafRef.current);
        drawRafRef.current = null;
      }
    };
  }, [wordRuntime, prefersReducedMotion, mounted]);

  useEffect(() => {
    const onScroll = () => {
      if (scrollRafRef.current) return;

      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;

        const now =
          typeof performance !== "undefined" ? performance.now() : Date.now();
        if (
          minScrollFrameMs > 0 &&
          now - lastScrollDrawTsRef.current < minScrollFrameMs
        ) {
          return;
        }

        const doc = document.documentElement;
        const scrollTop = window.pageYOffset || doc.scrollTop || 0;
        const viewport = window.innerHeight || 1;
        const rawRatio = clamp01(scrollTop / viewport);
        const ratio =
          scrollQuantizationStep > 0
            ? clamp01(
                Math.round(rawRatio / scrollQuantizationStep) *
                  scrollQuantizationStep,
              )
            : rawRatio;

        if (Math.abs(scrollRatioRef.current - ratio) < scrollUpdateThreshold) {
          return;
        }

        scrollRatioRef.current = ratio;
        lastScrollDrawTsRef.current = now;
        requestDrawRef.current();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [scrollUpdateThreshold, scrollQuantizationStep, minScrollFrameMs]);

  useEffect(() => {
    if (prefersReducedMotion) {
      introProgressRef.current = 1;
      requestDrawRef.current();
      return;
    }

    introProgressRef.current = 0;
    const start =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    const step = (now) => {
      const current = typeof performance !== "undefined" ? now : Date.now();
      const elapsed = current - start;
      const t = clamp01(elapsed / INTRO_DURATION_MS);

      introProgressRef.current = easeOutCubic(t);
      requestDrawRef.current();

      if (t < 1) {
        introRafRef.current = requestAnimationFrame(step);
      }
    };

    introRafRef.current = requestAnimationFrame(step);

    return () => {
      if (introRafRef.current) {
        cancelAnimationFrame(introRafRef.current);
        introRafRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
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
              ref={(node) => {
                ringTranslateRefs.current[0] = node;
              }}
              transform={`translate(0 ${initialFrame.offsetsYRounded[0]})`}
              opacity={initialFrame.opacities[0]}
            >
              <g
                ref={(node) => {
                  ringScaleRefs.current[0] = node;
                }}
                transform={`translate(500 500) scale(${initialFrame.scales[0]}) translate(-500 -500)`}
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
              ref={(node) => {
                ringTranslateRefs.current[1] = node;
              }}
              transform={`translate(0 ${initialFrame.offsetsYRounded[1]})`}
              opacity={initialFrame.opacities[1]}
            >
              <g className="animate-spin-slow" style={SPIN_STYLE_60}>
                <g
                  ref={(node) => {
                    ringScaleRefs.current[1] = node;
                  }}
                  transform={`translate(500 500) scale(${initialFrame.scales[1]}) translate(-500 -500)`}
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
              ref={(node) => {
                ringTranslateRefs.current[2] = node;
              }}
              transform={`translate(0 ${initialFrame.offsetsYRounded[2]})`}
              opacity={initialFrame.opacities[2]}
            >
              <g className="animate-spin-slow" style={SPIN_STYLE_120}>
                <g
                  ref={(node) => {
                    ringScaleRefs.current[2] = node;
                  }}
                  transform={`translate(500 500) scale(${initialFrame.scales[2]}) translate(-500 -500)`}
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
              ref={(node) => {
                ringTranslateRefs.current[3] = node;
              }}
              transform={`translate(0 ${initialFrame.offsetsYRounded[3]})`}
              opacity={initialFrame.opacities[3]}
            >
              <g className="animate-spin-slow" style={SPIN_STYLE_240}>
                <g
                  ref={(node) => {
                    ringScaleRefs.current[3] = node;
                  }}
                  transform={`translate(500 500) scale(${initialFrame.scales[3]}) translate(-500 -500)`}
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
              ref={labelGroupRef}
              transform={`translate(0 ${initialFrame.offsetsYRounded[0]})`}
              opacity={initialFrame.opacities[0]}
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

            {wordRuntime.map((item, index) => (
              <text
                key={item.key}
                ref={(node) => {
                  wordRefs.current[index] = node;
                }}
                x={initialWords[index]?.x ?? 500}
                y={initialWords[index]?.y ?? 500}
                opacity={initialWords[index]?.opacity ?? 0}
                textAnchor="middle"
                className="font-roboto-mono font-medium"
                style={{
                  fill: "var(--content_dark)",
                  letterSpacing: "normal",
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
