"use client";

import { useCallback, useEffect, useState } from "react";
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
  const caseTitle = activeCase?.title || activeCase?.client || "Case details";
  const caseSummary = activeCase?.description || activeCase?.sentence;
  const caseThemes = Array.isArray(activeCase?.themes) ? activeCase.themes : [];
  const caseServices = Array.isArray(activeCase?.services)
    ? activeCase.services
    : [];

  const getCaseLabel = (entry) => entry?.title || entry?.client || "-";

  const openGalleryAt = useCallback(
    (index) => {
      if (!galleryImages.length) return;
      setGalleryIndex(index);
      setIsGalleryOpen(true);
    },
    [galleryImages.length],
  );

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  const stepGallery = useCallback(
    (direction) => {
      if (!galleryImages.length) return;

      setGalleryIndex((prev) => {
        return (prev + direction + galleryImages.length) % galleryImages.length;
      });
    },
    [galleryImages.length],
  );

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKey = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowRight") stepGallery(1);
      if (event.key === "ArrowLeft") stepGallery(-1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isGalleryOpen, closeGallery, stepGallery]);

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
          <div className="h-full overflow-y-auto rounded-2xl bg-white p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--content_dark)]/60">
                    {activeCase.client && activeCase.client !== activeCase.title
                      ? activeCase.client
                      : `Case ${expandedIndex + 1}`}
                  </p>
                  <h1 className="text-2xl font-semibold md:text-3xl">
                    {caseTitle}
                  </h1>

                  {caseSummary && (
                    <p className="text-base leading-relaxed text-[var(--content_dark)]/80 md:text-lg">
                      {caseSummary}
                    </p>
                  )}
                </div>

                {activeCase.challenge && (
                  <section className="rounded-xl bg-[var(--background)]/55 p-5">
                    <h2 className="font-roboto-mono text-xs uppercase tracking-[0.22em] text-[var(--content_dark)]/65">
                      Challenge
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--content_dark)]/85 md:text-base">
                      {activeCase.challenge}
                    </p>
                  </section>
                )}

                {activeCase.solution && (
                  <section className="rounded-xl bg-[var(--background)]/55 p-5">
                    <h2 className="font-roboto-mono text-xs uppercase tracking-[0.22em] text-[var(--content_dark)]/65">
                      Solution
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--content_dark)]/85 md:text-base">
                      {activeCase.solution}
                    </p>
                  </section>
                )}

                {(caseThemes.length > 0 || caseServices.length > 0) && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {caseThemes.length > 0 && (
                      <section className="rounded-xl border border-[var(--surface)]/25 p-5">
                        <h2 className="font-roboto-mono text-xs uppercase tracking-[0.22em] text-[var(--content_dark)]/65">
                          Themes
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {caseThemes.map((theme, index) => (
                            <span
                              key={`${activeCase.slug}-theme-${index}`}
                              className="rounded-full bg-[var(--content_dark)]/8 px-3 py-1 text-xs font-medium text-[var(--content_dark)]/80"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {caseServices.length > 0 && (
                      <section className="rounded-xl border border-[var(--surface)]/25 p-5">
                        <h2 className="font-roboto-mono text-xs uppercase tracking-[0.22em] text-[var(--content_dark)]/65">
                          Services
                        </h2>
                        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-[var(--content_dark)]/85 md:text-base">
                          {caseServices.map((service, index) => (
                            <li key={`${activeCase.slug}-service-${index}`}>
                              {service}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <aside className="space-y-4">
                  <button
                    type="button"
                    onClick={() => openGalleryAt(galleryIndex)}
                    className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--grey)]/10"
                    aria-label="Open image gallery"
                  >
                    <Image
                      src={galleryImages[galleryIndex]}
                      alt={`${caseTitle} image ${galleryIndex + 1}`}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>

                  <div className="grid grid-cols-3 gap-3">
                    {galleryImages.map((src, index) => (
                      <button
                        key={`${activeCase.slug}-img-${index}`}
                        type="button"
                        onClick={() => setGalleryIndex(index)}
                        className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                          galleryIndex === index
                            ? "border-[var(--content_dark)]/60"
                            : "border-transparent"
                        }`}
                        aria-label={`Show image ${index + 1}`}
                      >
                        <Image
                          src={src}
                          alt={`${caseTitle} preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        {hasSiblings && (
          <div className="flex justify-between border-t border-[var(--surface)]/15 pt-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium">{getCaseLabel(prevCase)}</p>
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
              <p className="font-medium">{getCaseLabel(nextCase)}</p>
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
                alt={`${caseTitle} large image`}
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
