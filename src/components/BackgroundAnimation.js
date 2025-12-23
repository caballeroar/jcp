"use client";

import { useEffect, useMemo, useState } from "react";

export default function BackgroundAnimation({ locale }) {
  const [progress, setProgress] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [autoTime, setAutoTime] = useState(0);
  // Scroll tracking → compute progress over the first viewport

  useEffect(() => {
    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = window.pageYOffset || doc.scrollTop || 0;
        // Drive the animation over the first viewport height
        const viewport = window.innerHeight || 1;
        const ratio = scrollTop / viewport;
        const p = Math.max(0, Math.min(1, ratio));
        setProgress(p);
        setScrollRatio(ratio);
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Autonomous motion loop — drives subtle in/out movement even without scroll
  useEffect(() => {
    let rafId = null;
    let last =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const step = (now) => {
      // Update ~30fps to keep re-renders efficient
      const current = typeof performance !== "undefined" ? now : Date.now();
      if (current - last >= 33) {
        setAutoTime(current);
        last = current;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Scaling config
  // - MAX_SCALE: final ring scale (~5% overflow at completion)
  // - delays: stagger order (inner → outer)
  // - END: rings reach full size by 85% of first viewport scroll
  // - easeOut: acceleration curve for faster early growth
  const MAX_SCALE = 1.75; // ensures outer ring ~105vmin diameter (~5% overflow)
  const delays = [0.0, 0.12, 0.24, 0.36]; // inner -> outer
  const END = 0.85; // complete scaling earlier to reduce required scroll
  const easeOut = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
  const scales = delays.map((d) => {
    const rpRaw = (progress - d) / Math.max(0.0001, END - d);
    const rp = easeOut(Math.max(0, Math.min(1, rpRaw)));
    return 1 + rp * (MAX_SCALE - 1);
  });

  // Words setup
  // - innerLabel: localized "people"
  // - WORDS: 20 sustainability-related keywords
  const innerLabel = locale === "nl" ? "mensen" : "people";
  const WORDS = useMemo(
    () => [
      "climate",
      "equity",
      "circular",
      "resilience",
      "energy",
      "justice",
      "community",
      "inclusion",
      "governance",
      "policy",
      "innovation",
      "biodiversity",
      "carbon",
      "water",
      "waste",
      "ethics",
      "transparency",
      "impact",
      "collaboration",
      "stewardship",
    ],
    []
  );

  // Assign words across OUTER rings with deterministic angles/phases
  // - ringAssignments: spread words across r=240, 320, 400
  // - angle/phase: fixed layout with subtle variation
  // - speed: 20% of words move slightly faster on scroll
  const wordLayout = useMemo(() => {
    const baseRadii = [120, 240, 400, 600];
    // 20 words across outer rings: 7 (r=240), 7 (r=320), 6 (r=700)
    const ringAssignments = [
      ...Array(7).fill(1),
      ...Array(7).fill(2),
      ...Array(6).fill(3),
    ];
    return WORDS.map((w, i) => {
      const ringIndex = ringAssignments[i % ringAssignments.length];
      const baseR = baseRadii[ringIndex];
      // Deterministic angle using a simple hash
      const angle = ((i * 137.5) % 360) * (Math.PI / 180);
      const phase = (i * 47.3) % (2 * Math.PI);
      const amp = 14 + (i % 4);
      // 20% of words (i % 5 === 0) move slightly faster with scroll
      const speed = i % 5 === 0 ? 1.25 : 1.0;
      // autonomous per-word variation factors (constant per word)
      const autoPhase = (i * 13.37) % (2 * Math.PI);
      const autoSpeed = 0.8 + (i % 4) * 0.15;
      return {
        w,
        ringIndex,
        baseR,
        angle,
        phase,
        amp,
        speed,
        autoPhase,
        autoSpeed,
      };
    });
  }, [WORDS]);

  // Words move based on scroll progress (no time-based rotation)

  // Helpers
  // - clamp01: clamp to [0,1]
  // - ease: easeInOutCubic used for opacity/parallax sequencing
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const ease = (t) => {
    // easeInOutCubic
    t = clamp01(t);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Parallax + fade sequencing (inner → outer)
  // - depths: increasing vertical parallax per ring
  // - opacities: staggered fade-in per ring using delays
  // - offsetsY: BASE_Y position + parallax based on scroll
  const FADE_WINDOW = 0.12;
  const PARALLAX_PX = 120;
  const BASE_Y = -120; // nudge entire animation slightly upward toward screen center
  const depths = [0.15, 0.25, 0.35, 0.45];
  const opacities = delays.map((d) => clamp01((progress - d) / FADE_WINDOW));
  const offsetsY = delays.map(
    (_, i) => BASE_Y + depths[i] * PARALLAX_PX * progress
  );

  // Autonomous motion config — subtle continuous in/out movement
  const AUTO_AMP = 40; // small amplitude so scroll remains dominant
  const AUTO_FREQ = 0.1; // Hz multiplier for gentle pacing

  // Overlay fade timing
  // - Start fading when the next section is ~25% visible
  // - Fade out over the next 20% of a viewport
  const FADE_START_RATIO = 1.25; // next section ~25% visible
  const FADE_DURATION_RATIO = 0.2; // fade over the next 20% of viewport scroll
  const globalOpacity =
    1 - clamp01((scrollRatio - FADE_START_RATIO) / FADE_DURATION_RATIO);
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        opacity: globalOpacity,
        background: "var(--background)",
        zIndex: 5,
      }}
    >
      <div className="inset-0 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            width="120vmin"
            height="120vmin"
            viewBox="-200 -200 1400 1400"
            style={{ overflow: "visible" }}
          >
            {/* Solid center ring (smallest) — scales first, no rotation */}
            <g
              transform={`translate(0 ${offsetsY[0]})`}
              opacity={ease(opacities[0])}
            >
              <g
                transform={`translate(500 500) scale(${scales[0]}) translate(-500 -500)`}
              >
                <circle
                  cx="500"
                  cy="500"
                  r="120"
                  fill="none"
                  stroke="var(--content_brand)"
                  strokeWidth="1"
                />
              </g>
            </g>

            {/* Dashed rings — staggered scaling + independent rotation speeds */}
            <g
              transform={`translate(0 ${offsetsY[1]})`}
              opacity={ease(opacities[1])}
            >
              {/* Inner dashed ring rotation (faster) */}
              <g
                className="animate-spin-slow"
                style={{
                  transformOrigin: "500px 500px",
                  transformBox: "view-box",
                  animationDuration: "60s",
                  animationTimingFunction: "linear",
                }}
              >
                <g
                  transform={`translate(500 500) scale(${scales[1]}) translate(-500 -500)`}
                >
                  <circle
                    cx="500"
                    cy="500"
                    r="240"
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
              transform={`translate(0 ${offsetsY[2]})`}
              opacity={ease(opacities[2])}
            >
              {/* Middle dashed ring rotation (medium) */}
              <g
                className="animate-spin-slow"
                style={{
                  transformOrigin: "500px 500px",
                  transformBox: "view-box",
                  animationDuration: "120s",
                  animationTimingFunction: "linear",
                }}
              >
                <g
                  transform={`translate(500 500) scale(${scales[2]}) translate(-500 -500)`}
                >
                  <circle
                    cx="500"
                    cy="500"
                    r="320"
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
              transform={`translate(0 ${offsetsY[3]})`}
              opacity={ease(opacities[3])}
            >
              {/* Outer dashed ring rotation (slowest) */}
              <g
                className="animate-spin-slow"
                style={{
                  transformOrigin: "500px 500px",
                  transformBox: "view-box",
                  animationDuration: "240s",
                  animationTimingFunction: "linear",
                }}
              >
                <g
                  transform={`translate(500 500) scale(${scales[3]}) translate(-500 -500)`}
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

            {/* Inner label — centered "people/mensen" (Roboto Mono) */}
            <g
              transform={`translate(0 ${offsetsY[0]})`}
              opacity={ease(opacities[0])}
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

            {/* Words — radial in/out motion bound to scroll, staggered fade-in */}
            {wordLayout.map(
              (
                {
                  w,
                  ringIndex,
                  baseR,
                  angle,
                  phase,
                  amp,
                  speed,
                  autoPhase,
                  autoSpeed,
                },
                i
              ) => {
                const delta =
                  amp * Math.sin(progress * Math.PI * speed + phase);
                // time-based autonomous offset so words move even without scroll
                const tSec = autoTime / 1000;
                const autoDelta =
                  AUTO_AMP *
                  Math.sin(
                    tSec * 2 * Math.PI * AUTO_FREQ * autoSpeed + autoPhase
                  );
                // Keep words from coming too close to inner ring
                const minR =
                  ringIndex === 1 ? 200 : ringIndex === 2 ? 380 : 460;
                const r = Math.max(baseR + delta + autoDelta, minR);
                const x = 500 + r * Math.cos(angle);
                const y = 500 + r * Math.sin(angle) + offsetsY[ringIndex];
                const appear = ease(
                  clamp01((progress - delays[ringIndex]) / (FADE_WINDOW * 0.9))
                );
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="font-roboto-mono"
                    style={{
                      fill: "var(--content_dark)",
                      letterSpacing: "normal",
                      fontSize: 20,
                      opacity: appear,
                      fontFamily: "var(--font-roboto-mono)",
                      textTransform: "capitalize",
                    }}
                    fontSize={14}
                  >
                    {w}
                  </text>
                );
              }
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
