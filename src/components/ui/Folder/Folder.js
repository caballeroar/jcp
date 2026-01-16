"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../Button";
import { ArrowUpRight } from "phosphor-react";
import { useCarouselSwap } from "./useCarouselSwap";

export default function FolderIcon({
  title,
  description,
  imageSrc,
  images = [],
  buttonLabel = "View",
  href,
  onExpand,
  isExpanded = false,
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const effectiveImages =
    images.length > 0 ? images : imageSrc ? [imageSrc] : [];

  const {
    currentIndex,
    nextIndex,
    enteringIndex,
    isSwapping,
    enterActive,
    swapDurationMs,
  } = useCarouselSwap({
    imageCount: effectiveImages.length,
    isPaused,
    isDisabled: isExpanded,
  });

  const gapPx = 4;

  const handleActivate = () => {
    if (onExpand) onExpand();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleActivate();
      }}
      onMouseEnter={() => {
        if (!isExpanded) {
          setShowOverlay(true);
          setIsPaused(true);
        }
      }}
      onMouseLeave={() => {
        if (!isExpanded) {
          setShowOverlay(false);
          setIsPaused(false);
        }
      }}
      className="relative w-full flex flex-col justify-end items-center pb-2 cursor-pointer"
      style={{
        aspectRatio: isExpanded ? "auto" : "180 / 120",
        color: "var(--content_dark)",
      }}
    >
      {/* Folder SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 181 118"
        aria-hidden
      >
        <path
          d="M84.9845 0.199877L4.19234 0.338724C1.98589 0.342516 0.199219 2.13227 0.199219 4.33873V112.843C0.199219 115.052 1.99008 116.843 4.19922 116.843H176.201C178.41 116.843 180.201 115.052 180.201 112.843V11.4102C180.201 9.20111 178.41 7.41025 176.201 7.41025H93.3439C91.737 7.41025 90.2862 6.44873 89.66 4.96891L88.6752 2.64121C88.0481 1.15908 86.5938 0.197111 84.9845 0.199877Z"
          fill="var(--background)"
          stroke="var(--surface)"
          strokeWidth={0.4}
        />
      </svg>

      <div className="relative z-10 w-full px-4 py-4 flex flex-col gap-3">
        <h3 className="font-semibold text-xl">
          {title || "Title placeholder"}
        </h3>

        <p className="text-sm line-clamp-3">
          {description ||
            "Description placeholder text that briefly summarizes the case."}
        </p>

        {/* Image area */}
        <div
          className={`relative w-full overflow-hidden rounded-lg ${
            isExpanded ? "h-[400px]" : "h-[180px]"
          }`}
        >
          {effectiveImages.length > 0 && (
            <>
              {/* Current image */}
              <div
                className="absolute h-full"
                style={{
                  width: isSwapping
                    ? `calc(0% - ${gapPx}px)`
                    : `calc(70% - ${gapPx}px)`,
                  transition: `width ${swapDurationMs}ms ease-in-out`,
                }}
              >
                <Image
                  src={effectiveImages[currentIndex]}
                  alt={title || ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Next image */}
              {effectiveImages.length > 1 && (
                <div
                  className="absolute right-0 h-full"
                  style={{
                    width: isSwapping
                      ? `calc(70% - ${gapPx}px)`
                      : `calc(30% - ${gapPx}px)`,
                    transition: `width ${swapDurationMs}ms ease-in-out`,
                  }}
                >
                  <Image
                    src={effectiveImages[nextIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Entering image */}
              {isSwapping && effectiveImages.length > 2 && (
                <div
                  className="absolute top-0 right-0 h-full"
                  style={{
                    width: `calc(30% - ${gapPx}px)`,
                    transform: enterActive
                      ? "translateX(0)"
                      : "translateX(100%)",
                    transition: `transform ${swapDurationMs}ms ease-in-out`,
                  }}
                >
                  <Image
                    src={effectiveImages[enteringIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </>
          )}

          {/* Overlay CTA */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
              showOverlay && !isExpanded
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              href={href}
              theme="light"
              icon={<ArrowUpRight size={20} weight="bold" />}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
