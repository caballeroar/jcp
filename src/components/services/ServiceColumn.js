"use client";

import { memo } from "react";
import ServiceCard from "./ServiceCard";

function ServiceColumn({
  column,
  isDesktop,
  activeCol,
  expandedIndex,
  onToggle,
}) {
  const basis =
    !isDesktop || !activeCol
      ? "50%"
      : activeCol === column.id
        ? "65%"
        : "35%";
  const dimmed = (side) =>
    isDesktop && activeCol && activeCol !== side ? "scale-[0.85]" : "scale-100";

  return (
    <div
      className="flex px-4 flex-col min-w-0 transition-all duration-700 ease-out gap-4"
      style={{ flexBasis: basis }}
    >
      <article className="mb-3 rounded-xl border-[2px] border-white text-white bg-[var(--bg_brand)] px-5 pt-20 pb-5 flex flex-col items-center gap-12 stagger-in">
        <div className="flex flex-col items-center gap-4 text-center max-w-xl">
          <h3 className="text-3xl md:text-5xl font-medium tracking-tighter">
            {column.heading}
          </h3>
          <p className="text-sm md:text-lg">{column.description}</p>
        </div>
        <div className="grid grid-cols-full lg:grid-cols-2 gap-4 auto-rows-fr w-full">
          {column.services.map((service, index) => (
            <ServiceCard
              key={service.id ?? `${column.id}-${index}`}
              service={service}
              expanded={expandedIndex === index}
              dimmed={dimmed(column.id)}
              onClick={() => onToggle(column.id, index)}
            />
          ))}
        </div>
      </article>
    </div>
  );
}

export default memo(ServiceColumn);
