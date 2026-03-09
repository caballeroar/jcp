"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "phosphor-react";
import { Button } from "./ui";

export default function CasesModal({
  isOpen,
  activeCase,
  expandedIndex = 0,
  totalCases = 0,
  cases = [],
  onClose,
  onPrev,
  onNext,
}) {
  // Hooks MUST always run
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const galleryImages = activeCase?.images || [];

  const hasSiblings = totalCases > 1 && cases.length > 1;

  const prevCaseIndex = hasSiblings
    ? (expandedIndex - 1 + totalCases) % totalCases
    : null;

  const nextCaseIndex = hasSiblings ? (expandedIndex + 1) % totalCases : null;

  const prevCase = prevCaseIndex !== null ? cases[prevCaseIndex] : null;
  const nextCase = nextCaseIndex !== null ? cases[nextCaseIndex] : null;

  const openGalleryAt = (index) => {
    if (!galleryImages.length) return;
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const stepGallery = (direction) => {
    if (!galleryImages.length) return;

    setGalleryIndex((prev) => {
      return (prev + direction + galleryImages.length) % galleryImages.length;
    });
  };

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKey = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowRight") stepGallery(1);
      if (event.key === "ArrowLeft") stepGallery(-1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isGalleryOpen, galleryImages.length]);

  // Safe early return AFTER hooks
  if (!isOpen || !activeCase) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-stretch bg-[var(--background)]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-6 px-4 py-6 text-[var(--content_dark)] md:px-6 md:py-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 border-b border-[var(--surface)]/15 pb-4">
          <p className="text-md uppercase font-roboto-mono tracking-[2px]">
            Case {expandedIndex + 1}/{totalCases}
          </p>

          <Button
            theme="dark"
            iconOnly
            icon={<X size={18} weight="bold" />}
            onClick={onClose}
            aria-label="Close case details"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto rounded-2xl bg-white p-8">
            <h1 className="text-2xl font-semibold md:text-3xl">
              {activeCase.client}
            </h1>

            <div className="mt-4 space-y-4">
              <p className="text-lg leading-relaxed text-[var(--content_dark)]/80">
                {activeCase.sentence}
              </p>

              {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {galleryImages.map((src, index) => (
                    <button
                      key={`${activeCase.slug}-img-${index}`}
                      type="button"
                      onClick={() => openGalleryAt(index)}
                      className="group relative h-48 flex-1 min-w-[220px] overflow-hidden rounded-lg bg-[var(--grey)]/10"
                      aria-label={`Expand image ${index + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`${activeCase.client} image ${index + 1}`}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        {hasSiblings && (
          <div className="flex justify-between border-t border-[var(--surface)]/15 pt-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium">{prevCase?.client || "—"}</p>
              <Button
                onClick={onPrev}
                icon={<ArrowLeft size={18} weight="bold" />}
                iconPosition="left"
                theme="light"
              >
                Prev
              </Button>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-medium">{nextCase?.client || "—"}</p>
              <Button
                onClick={onNext}
                icon={<ArrowRight size={18} weight="bold" />}
                iconPosition="right"
                theme="light"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Overlay */}
      {isGalleryOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 px-4 py-8"
          onClick={closeGallery}
        >
          <div
            className="relative flex w-full max-w-4xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <Button
              iconOnly
              theme="light"
              onClick={closeGallery}
              icon={<X size={18} weight="bold" />}
              aria-label="Close enlarged image"
              className="self-end"
            /> */}

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-black">
              <Image
                src={galleryImages[galleryIndex]}
                alt={`${activeCase.client} large image`}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="flex w-full items-center justify-between text-sm text-white/80">
              <Button
                iconOnly
                theme="light"
                onClick={() => stepGallery(-1)}
                icon={<ArrowLeft size={20} weight="bold" />}
                aria-label="Previous image"
              />

              <p>
                {galleryIndex + 1} / {galleryImages.length}
              </p>

              <Button
                iconOnly
                theme="light"
                onClick={() => stepGallery(1)}
                icon={<ArrowRight size={20} weight="bold" />}
                aria-label="Next image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
