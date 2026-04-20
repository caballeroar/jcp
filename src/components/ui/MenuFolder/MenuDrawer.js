"use client";

import Image from "next/image";
import { useState } from "react";
import { useMenuContext } from "./MenuProvider";

const toMenuLabel = (item, href) => {
  const rawLabel =
    item?.label ?? (item?.slug ? item.slug.replace(/-/g, " ") : null);
  if (!rawLabel) return href;
  return rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
};

function CaseFolderPreview({ title, description, image }) {
  return (
    <article
      className="relative overflow-hidden"
      style={{ aspectRatio: "180 / 120" }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 181 118"
        aria-hidden
      >
        <path
          d="M84.9845 0.199877L4.19234 0.338724C1.98589 0.342516 0.199219 2.13227 0.199219 4.33873V112.843C0.199219 115.052 1.99008 116.843 4.19922 116.843H176.201C178.41 116.843 180.201 115.052 180.201 112.843V11.4102C180.201 9.20111 178.41 7.41025 176.201 7.41025H93.3439C91.737 7.41025 90.2862 6.44873 89.66 4.96891L88.6752 2.64121C88.0481 1.15908 86.5938 0.197111 84.9845 0.199877Z"
          fill="var(--background)"
          stroke="var(--surface)"
          strokeWidth={0.5}
        />
      </svg>

      <div className="relative z-10 h-full px-4 py-4 flex flex-col gap-2">
        <h3 className="text-base font-semibold text-[var(--content_dark)] line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-[var(--content_dark)]/80 line-clamp-2">
          {description}
        </p>

        <div className="relative mt-auto h-20 rounded-lg overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[var(--surface)]/10" />
          )}
        </div>
      </div>
    </article>
  );
}

export function MenuDrawer({ items, buildHref, relatedBySlug = {} }) {
  const { open, close, navigate } = useMenuContext();
  const [activeSlug, setActiveSlug] = useState(null);

  if (!open) return null;

  const activeItem =
    items.find((item) => item?.slug === activeSlug) ?? items.find(Boolean);
  const activeRelated = activeItem?.slug
    ? relatedBySlug[activeItem.slug]
    : undefined;
  const relatedItems = activeRelated?.items ?? [];
  const relatedTitle = activeRelated?.title ?? activeItem?.label ?? "Explore";
  const isCasesPreview = activeItem?.slug === "cases";
  const previewKey = activeItem?.slug ?? "default";
  const casesBaseHref = buildHref("cases");

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <nav className="absolute inset-0 bg-[var(--bg_box_neutral)]">
        <div className="mx-auto h-full w-full max-w-6xl px-6 md:px-10 pt-24 pb-10 flex items-center justify-center md:justify-between gap-10">
          <aside className="hidden md:block w-full max-w-xl">
            <div className="rounded-3xl border border-[var(--bg_brand)]/25 bg-[var(--background)]/75 p-8 backdrop-blur-sm min-h-[20rem]">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--content_brand)]">
                {relatedTitle}
              </p>
              <div key={previewKey} className="mt-6 menu-preview-in">
                {relatedItems.length > 0 ? (
                  isCasesPreview ? (
                    <div className="grid grid-cols-2 gap-4">
                      {relatedItems.slice(0, 4).map((entry, index) => {
                        const title = entry?.title ?? `Case ${index + 1}`;
                        const caseSlug = entry?.slug ?? `case-${index + 1}`;
                        const caseHref = `${casesBaseHref}?case=${encodeURIComponent(caseSlug)}`;
                        return (
                          <a
                            key={`${caseSlug}-${index}`}
                            href={caseHref}
                            onClick={(e) => {
                              e.preventDefault();
                              close();
                              navigate(caseHref);
                            }}
                            className="block transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--content_brand)] rounded-lg"
                          >
                            <CaseFolderPreview
                              title={title}
                              description={entry?.description ?? ""}
                              image={entry?.image ?? null}
                            />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {relatedItems.slice(0, 4).map((entry, index) => {
                        const title = entry?.title ?? `Item ${index + 1}`;
                        return (
                          <div
                            key={`${title}-${index}`}
                            className="rounded-xl border border-[var(--surface)]/25 bg-[var(--surface)]/10 px-4 py-3"
                          >
                            <p className="text-base font-semibold text-[var(--content_dark)]">
                              {title}
                            </p>
                            {entry?.description ? (
                              <p className="mt-1 text-sm text-[var(--content_dark)]/80 line-clamp-2">
                                {entry.description}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <p className="text-[var(--content_dark)]/80 text-base leading-relaxed">
                    Explore this section for related work and details.
                  </p>
                )}
              </div>
            </div>
          </aside>

          <div className="space-y-6 text-center md:text-right md:w-[21rem] ">
            {items.map((item) => {
              if (!item) return null;
              const href = buildHref(item.slug);
              const label = toMenuLabel(item, href);
              const isActive = item.slug === activeItem?.slug;
              return (
                <a
                  key={item.slug ?? href}
                  href={href}
                  onClick={(e) => navigate(href, e)}
                  onMouseEnter={() => setActiveSlug(item.slug ?? null)}
                  onFocus={() => setActiveSlug(item.slug ?? null)}
                  className={`block text-3xl md:text-4xl font-semibold transition-colors ${
                    isActive
                      ? "text-[var(--content_brand)]"
                      : "text-[var(--content_dark)]"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
