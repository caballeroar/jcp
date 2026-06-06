"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../Button";
import { ArrowUpRight } from "phosphor-react";
import { useCarouselSwap } from "./useCarouselSwap";

export default function Folder2({
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
  const [isPaused, setIsPaused] = useState(false);

  const effectiveImages =
    images.length > 0 ? images : imageSrc ? [imageSrc] : [];

  const { currentIndex, nextIndex, isSwapping, enterActive, swapDurationMs } =
    useCarouselSwap({
      imageCount: effectiveImages.length,
      isPaused,
      isDisabled: false,
    });

  const animationEase = `${swapDurationMs}ms ease-in-out`;
  const currentTransform = isSwapping ? "translateX(-100%)" : "translateX(0)";
  const nextTransform =
    isSwapping && enterActive ? "translateX(0)" : "translateX(100%)";
  const currentTransition = isSwapping ? `transform ${animationEase}` : "none";
  const nextTransition = isSwapping ? `transform ${animationEase}` : "none";

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
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full cursor-pointer flex items-end"
      style={{
        aspectRatio: "180 / 120",
        color: "var(--content_dark)",
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
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

      <div className="relative z-10 flex h-[85%] w-full px-4 mb-6">
        <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-end pl-2 pb-2">
            <div className="flex flex-col gap-3">
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

              <h4 className="text-3xl font-semibold tracking-tight">
                {title || "Title placeholder"}
              </h4>

              <p className="line-clamp-2 text-lg">
                {description ||
                  "Description placeholder text that briefly summarizes the case."}
              </p>
            </div>

            <div className="pt-3">
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

          <div className="relative h-[180px] w-full overflow-hidden rounded-lg md:h-full md:min-h-0">
            {effectiveImages.length > 0 ? (
              <>
                <div
                  className="absolute inset-0"
                  style={{
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
                    className="absolute inset-0"
                    style={{
                      transform: nextTransform,
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
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/5 text-sm opacity-70">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
