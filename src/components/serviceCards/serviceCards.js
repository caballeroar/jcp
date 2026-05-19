"use client";

import { Fragment, useState } from "react";
import { ArrowsOutSimple, CaretLeft, CaretRight, X } from "phosphor-react";
import { SERVICES } from "../../data/services";

function ExpandButton({ expanded, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={label}
      className="h-9 w-9 rounded-full border border-[var(--surface)]/25 bg-[var(--background)]/80 text-[var(--content_dark)] grid place-items-center transition-transform duration-200 hover:scale-105"
    >
      <ArrowsOutSimple size={16} weight="bold" />
    </button>
  );
}

function CardShell({ methodology, expanded, onExpand, topRight, children }) {
  return (
    <article
      className={`rounded-2xl border p-6 md:p-7 min-h-[300px] transition-all duration-200 ${
        expanded
          ? "border-[var(--content_brand)] shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          : "border-[var(--surface)]/20"
      } bg-[var(--bg_box_neutral)] text-[var(--content_dark)]`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--content_brand)]">
          {methodology}
        </p>
        {topRight ?? (
          <ExpandButton
            expanded={expanded}
            onClick={onExpand}
            label="Toggle card details"
          />
        )}
      </div>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function ServicePrimaryCard({ service, expanded, onExpand }) {
  return (
    <CardShell
      methodology={service.methodology}
      expanded={expanded}
      onExpand={onExpand}
    >
      <h3 className="text-2xl md:text-3xl font-semibold leading-tight">
        {service.mainService}
      </h3>
      <p
        className={`mt-4 text-base leading-relaxed ${
          expanded ? "" : "max-h-[7.2rem] overflow-hidden"
        }`}
      >
        {service.mainServiceDescription}
      </p>
    </CardShell>
  );
}

function ServiceSecondaryCard({ service, expanded, onExpand }) {
  const [activeSubserviceIndex, setActiveSubserviceIndex] = useState(null);
  const subServices = service.subServices ?? [];
  const activeSubservice =
    activeSubserviceIndex !== null ? subServices[activeSubserviceIndex] : null;

  const openSubservice = (index) => {
    setActiveSubserviceIndex(index);
  };

  const closeSubservice = () => {
    setActiveSubserviceIndex(null);
  };

  const goToSubservice = (delta) => {
    if (activeSubserviceIndex === null || subServices.length === 0) return;
    setActiveSubserviceIndex(
      (prev) => (prev + delta + subServices.length) % subServices.length,
    );
  };

  return (
    <CardShell
      methodology={service.methodology}
      expanded={expanded}
      onExpand={onExpand}
      topRight={
        activeSubservice ? (
          <button
            type="button"
            onClick={closeSubservice}
            aria-label="Close subservice details"
            className="h-9 w-9 rounded-full border border-[var(--surface)]/25 bg-[var(--background)]/80 text-[var(--content_dark)] grid place-items-center transition-transform duration-200 hover:scale-105"
          >
            <X size={16} weight="bold" />
          </button>
        ) : undefined
      }
    >
      {activeSubservice ? (
        <div className="min-h-[210px] flex flex-col">
          <h3 className="text-xl md:text-2xl font-semibold leading-tight">
            {activeSubservice.subService}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-[var(--content_dark)]/85">
            {activeSubservice.subServiceDescription}
          </p>

          <div className="mt-auto pt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => goToSubservice(-1)}
              aria-label="Previous subservice"
              className="h-10 w-10 rounded-full border border-[var(--surface)]/25 bg-[var(--background)]/80 text-[var(--content_dark)] grid place-items-center transition-transform duration-200 hover:scale-105"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => goToSubservice(1)}
              aria-label="Next subservice"
              className="h-10 w-10 rounded-full border border-[var(--surface)]/25 bg-[var(--background)]/80 text-[var(--content_dark)] grid place-items-center transition-transform duration-200 hover:scale-105"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg md:text-xl font-semibold">Subservices</h3>
          <ul
            className={`mt-4 space-y-2 text-sm md:text-base ${
              expanded ? "" : "max-h-[8.2rem] overflow-hidden"
            }`}
          >
            {subServices.map((item, index) => (
              <li
                key={`${item.subService}-${index}`}
                className="leading-relaxed"
              >
                <button
                  type="button"
                  onClick={() => openSubservice(index)}
                  className="w-full text-left rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-[var(--surface)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--content_brand)]"
                >
                  <span className="font-medium">{item.subService}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-[var(--surface)]/15">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--content_brand)]">
              Outcome
            </p>
            <p className="mt-2 text-base md:text-lg font-medium">
              {service.outcome}
            </p>
          </div>
        </>
      )}
    </CardShell>
  );
}

export default function ServiceCards({ services = SERVICES }) {
  const [expandedKey, setExpandedKey] = useState(null);

  const toggleExpanded = (key) => {
    setExpandedKey((current) => (current === key ? null : key));
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {services.map((service, index) => {
          const primaryKey = `service-${index}-primary`;
          const secondaryKey = `service-${index}-secondary`;

          return (
            <Fragment key={`service-group-${index}`}>
              <ServicePrimaryCard
                key={primaryKey}
                service={service}
                expanded={expandedKey === primaryKey}
                onExpand={() => toggleExpanded(primaryKey)}
              />
              <ServiceSecondaryCard
                key={secondaryKey}
                service={service}
                expanded={expandedKey === secondaryKey}
                onExpand={() => toggleExpanded(secondaryKey)}
              />
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
