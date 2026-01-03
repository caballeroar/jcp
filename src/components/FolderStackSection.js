// Client component: enables hooks and browser APIs
"use client";

import { useEffect, useRef, useState } from "react";

import FolderIcon from "./ui/Folder";
import { Button } from "./ui";
import { ArrowRight } from "phosphor-react";

export default function FolderStackSection({
  href,
  ctaLabel = "Explore Cases",
  effectiveLocale,
}) {
  const targetHref =
    href || (effectiveLocale ? `/${effectiveLocale}/cases` : "/cases");
  const sectionRef = useRef(null);

  const stickyRef = useRef(null);
  // Normalized scroll progress (0..1) within the sticky window
  const [progress, setProgress] = useState(0);
  // Measured frame height to compute exit distance in pixels
  const frameRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Bind scroll/resize to recompute progress inside the sticky range
  useEffect(() => {
    // rAF guard: avoid excessive computations per frame
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      // Defer work to next animation frame
      raf = requestAnimationFrame(() => {
        raf = null;
        const sectionEl = sectionRef.current;
        const stickyEl = stickyRef.current;
        if (!sectionEl || !stickyEl) return;
        // Viewport-relative bounds of the section
        const rect = sectionEl.getBoundingClientRect();
        // Viewport height for sticky math
        const viewportH = window.innerHeight;
        // Absolute top of the section (relative to document)
        const sectionTopAbs = window.scrollY + rect.top;
        // Full section height
        const sectionHeight = sectionEl.offsetHeight;
        // Distance over which sticky progress runs
        const stickyRun = Math.max(sectionHeight - viewportH, 1);
        // Clamp current scroll offset within that range
        const current = Math.min(
          Math.max(window.scrollY - sectionTopAbs, 0),
          stickyRun
        );
        // Normalize to 0..1
        const p = current / stickyRun;
        setProgress(p);
      });
    };
    // Initialize once on mount
    onScroll();
    // Listen to scroll/resize updates
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      // Cleanup listeners and any pending rAF
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Measure frame height on mount and resize for pixel-precise travel
  useEffect(() => {
    const measure = () => {
      const el = frameRef.current;
      setFrameHeight(el ? el.offsetHeight : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Track viewport size to switch positioning arrays for mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768); // match Tailwind md breakpoint
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Visual tuning
  // Number of folders
  const count = 4;
  // Desktop positions: cluster near bottom while staying scattered around center
  const desktopInitialBottoms = ["-56%", "-53%", "-46%", "2%"];
  const desktopLeftPositions = [4, 20, 8, 40];

  // Mobile positions: stack more tightly behind each other
  const mobileInitialBottoms = ["-36%", "-38%", "-40%", "2%"];
  const mobileLeftPositions = [0, 0, 0, 0];

  const initialBottoms = isMobile
    ? mobileInitialBottoms
    : desktopInitialBottoms;
  // Vertical offsets in pixels for subtle separation
  //   const yOffsetsPx = [-550, -240, 8, 10];
  const yOffsetsPx = [-340, -340, -340, 10];

  // Responsive folder width based on viewport width
  //  - At 375px => 100% of container
  //  - At 1440px => 50% of container
  //  - Linearly interpolated in between, clamped to [50%, 100%]
  const minViewport = 375;
  const maxViewport = 1440;
  const minFraction = 0.5; // 50%
  const maxFraction = 1; // 100%
  const vw = viewportWidth || minViewport;
  const clampedVw = Math.min(Math.max(vw, minViewport), maxViewport);
  const t = (clampedVw - minViewport) / (maxViewport - minViewport);
  const widthFraction = maxFraction - t * (maxFraction - minFraction);
  const folderWidth = `${widthFraction * 100}%`;

  // Responsive horizontal positioning:
  // - For very small screens (<= sm ~640px), keep folders centered
  //   behind each other.
  // - As the screen widens towards xl (1280px), gradually interpolate
  //   from centered to the desktopLeftPositions values.
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

  // Easing helper: smooth start and end, total travel preserved
  const ease = (t) => (1 - Math.cos(t * Math.PI)) / 2;

  return (
    <section ref={sectionRef} className="relative" style={{ height: "160vh" }}>
      <div ref={stickyRef} className="sticky top-0 h-screen">
        <div className="relative w-full  h-[80%] md:h-full flex items-center justify-center ">
          <div
            ref={frameRef}
            className="relative w-full h-[80vh] overflow-hidden 2xl:px-40 "
            style={{ borderBottom: "2px solid var(--content_dark)" }}
          >
            <div className="sticky top-0 w-full h-full">
              {Array.from({ length: count }).map((_, i) => {
                // Layer stacking order (front to back)
                const z = 5 - i;
                // Divide total progress into equal per-folder segments
                const segments = count;
                const segLen = 1 / segments;
                const start = i * segLen;
                // Local progress (0..1) for this folder's segment
                const local = Math.max(
                  Math.min((progress - start) / segLen, 1),
                  0
                );
                // Exit distance in px so item fully leaves the 72vh frame
                const exitPx = Math.max(frameHeight * 0.9, 0);
                const eased = ease(local);
                // Last item stays; others exit upward by exitPx
                const targetExit = i === segments - 1 ? 0 : exitPx;
                // Upward travel (negative moves up); add small per-item offset
                const travelPx = -(eased * targetExit) + yOffsetsPx[i];
                // Consistent item width inside the frame
                //LOOK HERE the width is in percentage to be responsive - be very because depending on the screen size the folder might be too small
                // const widthPct = "50%";

                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: folderWidth,
                      bottom: initialBottoms[i],
                      left: `${computeLeftPercent(i)}%`,
                      zIndex: z,
                      transform: `translateY(${travelPx}px)`,
                    }}
                  >
                    <FolderIcon />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className=" mt-12 md:mt-[-6%] xl:mt-[-4%] mx-auto w-fit">
          <Button href={targetHref} icon={<ArrowRight />}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
