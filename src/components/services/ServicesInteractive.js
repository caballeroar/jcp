"use client";

import { useState, useCallback, useRef } from "react";
import { getHoverColumn } from "../../utils/service";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import { useIntersectionOnce } from "../../hooks/useIntersectionOnce";
import ServiceColumn from "./ServiceColumn";
import Animations from "./Animation";

export default function ServicesInteractive({ columns = [] }) {
  const containerRef = useRef(null);

  const width = useViewportWidth();
  const isDesktop = width >= 1280;

  const [activeCol, setActiveCol] = useState(null);

  /**
   * Stores only user-triggered expansions
   * Missing keys are treated as `null`
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
   * Toggle expansion per column
   * No derived state, no effects
   */
  const handleToggle = useCallback((columnId, index) => {
    setExpanded((prev) => ({
      ...prev,
      [columnId]: prev[columnId] === index ? null : index,
    }));
  }, []);

  return (
    <div
      id="services-brand-area"
      ref={containerRef}
      className={`flex flex-col xl:flex-row w-full px-2 xl:px-6 pt-28 pb-12 gap-4 bg-[var(--bg_brand)] cursor-pointer relative overflow-hidden ${
        visible ? "animate-bg" : "container-pre"
      }`}
      onPointerMove={(e) => handleHoverX(e.clientX)}
      onPointerLeave={resetHover}
      onTouchStart={(e) => e.touches?.[0] && handleHoverX(e.touches[0].clientX)}
      onTouchMove={(e) => e.touches?.[0] && handleHoverX(e.touches[0].clientX)}
    >
      {columns.map((column) => (
        <ServiceColumn
          key={column.id}
          column={column}
          isDesktop={isDesktop}
          activeCol={activeCol}
          expandedIndex={expanded[column.id] ?? null}
          onToggle={handleToggle}
        />
      ))}

      <Animations />
    </div>
  );
}
