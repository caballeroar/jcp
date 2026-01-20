"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "phosphor-react";

export default function CasesModal({
  isOpen,
  activeCase,
  expandedIndex,
  totalCases,
  cases = [],
  onClose,
  onPrev,
  onNext,
  onSelectCase,
  locale,
}) {
  if (!isOpen || !activeCase) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--background)]/95 backdrop-blur-lg">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10 text-[var(--content_dark)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--surface)]/10 pb-4">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--content_brand)]"
          >
            <ArrowLeft size={18} weight="bold" />
            Prev
          </button>
          <p className="font-roboto-mono text-xs uppercase tracking-[0.25em] text-[var(--grey)]">
            {expandedIndex + 1} / {totalCases}
          </p>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--content_brand)]"
          >
            Next
            <ArrowRight size={18} weight="bold" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-full border border-[var(--surface)]/20 p-2"
            aria-label="Close case details"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8">
          <article className="rounded-3xl border border-[var(--surface)]/10 bg-[var(--bg_box_neutral)] p-8 shadow-2xl space-y-4">
            {locale && (
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--content_brand)]">
                {locale.toUpperCase()}
              </p>
            )}
            <h3 className="text-3xl font-semibold">{activeCase.client}</h3>
            <p className="text-lg leading-relaxed text-[var(--content_dark)]/80">
              {activeCase.sentence}
            </p>
          </article>

          {activeCase.images?.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {activeCase.images.map((src, idx) => (
                <div
                  key={`${activeCase.slug}-img-${idx}`}
                  className="relative h-48 w-full overflow-hidden rounded-2xl bg-[var(--grey)]/10"
                >
                  <Image
                    src={src}
                    alt={`${activeCase.client} image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={idx < 2}
                  />
                </div>
              ))}
            </div>
          )}

          {cases.length > 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              {cases.map((entry, idx) => (
                <button
                  key={`${entry.slug}-${idx}`}
                  type="button"
                  onClick={() => onSelectCase?.(idx)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    idx === expandedIndex
                      ? "border-[var(--content_brand)] bg-[var(--content_brand)]/5"
                      : "border-[var(--surface)]/10"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    {entry.client}
                  </p>
                  <p className="mt-2 text-sm text-[var(--grey)] line-clamp-2">
                    {entry.sentence}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="self-center rounded-full border border-[var(--surface)]/20 px-8 py-3 text-sm font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
