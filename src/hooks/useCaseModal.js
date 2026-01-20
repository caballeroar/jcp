import { useCallback, useEffect, useState } from "react";

export function useCaseModal(items = []) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const totalCases = items.length;
  const activeCase =
    totalCases > 0 && expandedIndex !== null ? items[expandedIndex] : null;
  const isOpen = Boolean(activeCase);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const openCase = useCallback(
    (index) => {
      if (!totalCases) return;
      setExpandedIndex(
        ((index % totalCases) + totalCases) % Math.max(totalCases, 1),
      );
    },
    [totalCases],
  );

  const closeCase = useCallback(() => setExpandedIndex(null), []);

  const cycleCase = useCallback(
    (delta) => {
      if (!isOpen) return;
      setExpandedIndex((prev) => {
        const next = (prev + delta + totalCases) % Math.max(totalCases, 1);
        return next;
      });
    },
    [isOpen, totalCases],
  );

  return {
    expandedIndex,
    activeCase,
    isOpen,
    totalCases,
    openCase,
    closeCase,
    cycleCase,
  };
}
