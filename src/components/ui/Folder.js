"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "phosphor-react";

export default function FolderIcon({
  locale,
  title,
  description,
  imageSrc,
  images = [],
  buttonLabel = "View",
  href,
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isSwapping, setIsSwapping] = useState(false);
  const [enterActive, setEnterActive] = useState(false);
  const swapDurationMs = 800; // unified animation duration for transitions and timers
  const gapPx = 4; // visual gap between images
  const intervalMs = 5000; // time between swaps (slower pacing)
  const intervalRef = useRef(null);
  const pathname = usePathname();
  const firstSeg = pathname?.split("/").filter(Boolean)[0];
  const supportedLocales = ["en", "nl"]; // extend if more locales are added
  const detectedLocale = supportedLocales.includes(firstSeg)
    ? firstSeg
    : undefined;
  const effectiveLocale = locale ?? detectedLocale;
  const targetHref =
    href || (effectiveLocale ? `/${effectiveLocale}/cases` : "/cases");

  // Setup auto-swap for carousel when there are 2+ images, with hover pause
  useEffect(() => {
    if (!Array.isArray(images) || images.length < 2) return;
    // Clear any existing interval before (re)starting or pausing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isPaused) return; // paused: don't start interval
    intervalRef.current = setInterval(() => {
      setIsSwapping(true);
      // trigger right-entering panel animation
      setEnterActive(false);
      requestAnimationFrame(() => setEnterActive(true));
      // After the swap animation completes, advance indices and reset positions
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setNextIndex((prev) => (prev + 1) % images.length);
        setIsSwapping(false);
        setEnterActive(false);
      }, swapDurationMs);
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images, isPaused]);
  const displayImage = imageSrc || (Array.isArray(images) && images[0]);
  return (
    <div
      className="relative w-full flex flex-col justify-end items-center pb-2 sm:pb-2 md:pb-3 "
      onMouseEnter={() => {
        setShowOverlay(true);
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setShowOverlay(false);
        setIsPaused(false);
      }}
      onClick={() => setShowOverlay((v) => !v)}
      style={{
        aspectRatio: "180 / 120",
        color: "var(--content_dark)",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 181 118"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <path
          d="M84.9845 0.199877L4.19234 0.338724C1.98589 0.342516 0.199219 2.13227 0.199219 4.33873V112.843C0.199219 115.052 1.99008 116.843 4.19922 116.843H176.201C178.41 116.843 180.201 115.052 180.201 112.843V11.4102C180.201 9.20111 178.41 7.41025 176.201 7.41025H93.3439C91.737 7.41025 90.2862 6.44873 89.66 4.96891L88.6752 2.64121C88.0481 1.15908 86.5938 0.197111 84.9845 0.199877Z"
          style={{
            fill: `var(--background)`,
            stroke: `var(--surface)`,
            strokeWidth: 0.4,
          }}
        />
      </svg>
      <div className="absolute w-full overflow-hidden flex flex-col gap-3 z-10 px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
        <div className="flex justify-between items-end">
          <div className="max-w-[90%]">
            <h3 className="text-md sm:text-lg md:text-2xl text-left font-semibold color:[var(--content-dark)]">
              {title || "Title placeholder"}
            </h3>
            <p className="mt-1 text-sm !leading-none sm:text-md md:text-lg text-left leading-snug color:[var(--content-dark)] line-clamp-3">
              {description ||
                "Description placeholder text that briefly summarizes the case. Keep it concise and informative."}
            </p>
          </div>
        </div>
        <div className="relative w-full h-[100px] sm:h-[150px] md:h-[200px] group cursor-pointer overflow-hidden">
          {Array.isArray(images) && images.length >= 2 ? (
            <div className="absolute inset-0">
              <div className=" flex w-full h-full overflow-hidden relative">
                {/* Left panel (current) */}
                <div
                  className="h-full relative"
                  style={{
                    flex: "0 0 auto",
                    width: isSwapping
                      ? `calc(0% - ${gapPx / 2}px)`
                      : `calc(70% - ${gapPx / 2}px)`,
                    marginRight: `${gapPx / 2}px`,
                    transition: isSwapping
                      ? `width ${swapDurationMs}ms ease-in-out`
                      : "none",
                  }}
                >
                  <Image
                    src={images[currentIndex]}
                    alt={title || "Case thumbnail"}
                    width={600}
                    height={200}
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Right panel (next -> left) */}
                <div
                  className="h-full relative"
                  style={{
                    flex: "0 0 auto",
                    width: isSwapping
                      ? `calc(70% - ${gapPx / 2}px)`
                      : `calc(30% - ${gapPx / 2}px)`,
                    marginLeft: `${gapPx / 2}px`,
                    transition: isSwapping
                      ? `width ${swapDurationMs}ms ease-in-out`
                      : "none",
                  }}
                >
                  <Image
                    src={images[nextIndex]}
                    alt={title || "Case thumbnail next"}
                    width={600}
                    height={200}
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Entering panel (third from right) - overlay to avoid layout jumps */}
                {isSwapping && (
                  <div
                    className="absolute top-0 right-0 h-full z-10"
                    style={{
                      width: `calc(30% - ${gapPx / 2}px)`,
                      transform: enterActive
                        ? "translateX(0%)"
                        : "translateX(100%)",
                      transition: `transform ${swapDurationMs}ms ease-in-out`,
                    }}
                  >
                    <Image
                      src={images[(nextIndex + 1) % images.length]}
                      alt={title || "Case thumbnail entering"}
                      width={600}
                      height={200}
                      unoptimized
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : displayImage ? (
            <Image
              src={displayImage}
              alt={title || "Case thumbnail"}
              width={600}
              height={200}
              unoptimized
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Image
              src="https://placehold.co/600x200?text=Case+Thumbnail"
              alt="Case thumbnail placeholder"
              width={600}
              height={200}
              unoptimized
              className="w-full h-full object-cover rounded-lg"
            />
          )}

          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ease-out ${
              showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                href={targetHref}
                iconPosition="right"
                theme="light"
                icon={<ArrowUpRight size={20} weight="bold" />}
              >
                {buttonLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
