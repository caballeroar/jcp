"use client";

import { useState, useCallback, useRef } from "react";
import { getHoverColumn } from "../../utils/service";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import { useIntersectionOnce } from "../../hooks/useIntersectionOnce";
import ServiceColumn from "./ServiceColumn";
import { ArrowRight } from "phosphor-react";
import { Button } from "../ui";
import { useI18n } from "@/lib/I18nContext";

export default function ServicesInteractive({ columns = [] }) {
  const containerRef = useRef(null);
  const { locale } = useI18n();
  const width = useViewportWidth();
  const isDesktop = width >= 1280;

  const [activeCol, setActiveCol] = useState(null);

  /**
   * Stores only user-triggered expansions
   * Missing keys are treated as empty
   */
  const [expanded, setExpanded] = useState({});

  const visible = useIntersectionOnce(containerRef);

  /**
   * Hover intent handler
   */
  const handleHoverX = useCallback(
    (clientX) => {
      if (!isDesktop || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setActiveCol(getHoverColumn(clientX, rect));
    },
    [isDesktop],
  );

  const resetHover = useCallback(() => {
    setActiveCol(null);
  }, []);

  /**
   * Toggle expansion per column (user-triggered only)
   */
  const handleToggle = useCallback((columnId, index) => {
    setExpanded((prev) => {
      const current = new Set(prev[columnId] ?? []);

      if (current.has(index)) {
        current.delete(index);
      } else {
        current.add(index);
      }

      const nextEntries = Array.from(current);

      if (!nextEntries.length) {
        const nextState = { ...prev };
        delete nextState[columnId];
        return nextState;
      }

      return {
        ...prev,
        [columnId]: nextEntries,
      };
    });
  }, []);

  /**
   * Derive desktop-visible expansions
   * No effect. No cascading renders.
   */
  const getVisibleExpanded = useCallback(
    (columnId) => {
      if (!isDesktop) {
        return expanded[columnId] ?? [];
      }

      if (!activeCol) return [];

      if (columnId !== activeCol) return [];

      return expanded[columnId] ?? [];
    },
    [expanded, activeCol, isDesktop],
  );

  return (
    <div
      id="services-brand-area"
      data-brand-bg
      ref={containerRef}
      onPointerMove={(e) => handleHoverX(e.clientX)}
      onPointerLeave={resetHover}
      onTouchStart={(e) => e.touches?.[0] && handleHoverX(e.touches[0].clientX)}
      onTouchMove={(e) => e.touches?.[0] && handleHoverX(e.touches[0].clientX)}
      className="bg-[var(--bg_brand)] w-full flex flex-col items-center"
    >
      <div
        className={`flex flex-col xl:flex-row w-full px-2 xl:px-6 pt-28 pb-12 gap-4  cursor-pointer relative overflow-hidden ${
          visible ? "animate-bg" : "container-pre"
        }`}
      >
        {columns.map((column) => (
          <ServiceColumn
            key={column.id}
            column={column}
            isDesktop={isDesktop}
            activeCol={activeCol}
            expandedIndexes={getVisibleExpanded(column.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>
      <Button
        className="py-20"
        href={`/${locale}/services`}
        icon={<ArrowRight />}
        theme="brand"
      >
        View Services
      </Button>
    </div>
  );
}
