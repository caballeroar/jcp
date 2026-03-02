"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../Button";
import { ArrowUpRight } from "phosphor-react";
import { useCarouselSwap } from "./useCarouselSwap";
// import { useI18n } from "../lib/I18nContext";

export default function FolderIcon({
  title,
  description,
  imageSrc,
  images = [],
  buttonLabel = "View",
  cta,
  href,
  logo,
  onExpand,
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // const { dict, locale } = useI18n();

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
    isDisabled: false,
  });

  const gapPx = 4;
  const primaryWidth = `calc(70% - ${gapPx}px)`;
  const secondaryWidth = `calc(30% - ${gapPx}px)`;
  const currentTransform = isSwapping ? "translateX(-110%)" : "translateX(0)";
  const nextWidth = isSwapping ? primaryWidth : secondaryWidth;
  const nextLeft = isSwapping ? "0%" : "70%";
  const enteringLeft = enterActive ? "70%" : "100%";
  const animationEase = `${swapDurationMs}ms ease-in-out`;
  const currentTransition = isSwapping ? `transform ${animationEase}` : "none";
  const nextTransition = isSwapping
    ? `left ${animationEase}, width ${animationEase}`
    : "none";
  const enteringTransition = `left ${animationEase}`;

  const handleActivate = () => {
    onExpand?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded="false"
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleActivate();
      }}
      onMouseEnter={() => {
        setShowOverlay(true);
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setShowOverlay(false);
        setIsPaused(false);
      }}
      className="relative w-full flex flex-col justify-end items-center pb-2 cursor-pointer"
      style={{
        aspectRatio: "180 / 120",
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
        {logo && (
          <div className="relative h-10 w-[140px] max-w-full self-start">
            <Image
              src={logo}
              alt={title || ""}
              fill
              className="object-contain object-left"
              sizes="140px"
              unoptimized
            />
          </div>
        )}
        <h3 className="font-semibold text-xl">
          {title || "Title placeholder"}
        </h3>

        <p className="text-sm line-clamp-3">
          {description ||
            "Description placeholder text that briefly summarizes the case."}
        </p>

        {/* Image area */}
        <div className="relative w-full overflow-hidden rounded-lg h-[180px]">
          {effectiveImages.length > 0 && (
            <>
              <div
                className="absolute top-0 left-0 h-full overflow-hidden rounded-lg"
                style={{
                  width: primaryWidth,
                  transform: currentTransform,
                  transition: currentTransition,
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

              {effectiveImages.length > 1 && (
                <div
                  className="absolute top-0 h-full overflow-hidden rounded-lg"
                  style={{
                    width: nextWidth,
                    left: nextLeft,
                    transition: nextTransition,
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

              {effectiveImages.length > 2 && isSwapping && (
                <div
                  className="absolute top-0 h-full overflow-hidden rounded-lg"
                  style={{
                    width: secondaryWidth,
                    left: enteringLeft,
                    transition: enteringTransition,
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
              showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              href={href}
              theme="light"
              icon={<ArrowUpRight size={20} weight="bold" />}
              onClick={(event) => {
                event.stopPropagation();
                handleActivate();
              }}
            >
              {cta || buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
