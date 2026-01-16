import { useEffect, useRef, useState } from "react";

export function useCarouselSwap({
  imageCount,
  isPaused,
  isDisabled = false,
  intervalMs = 5000,
  swapDurationMs = 800,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [enterActive, setEnterActive] = useState(false);

  const intervalRef = useRef(null);

  // ✅ Guard against invalid index instead of resetting in effect
  const safeIndex = imageCount > 0 ? currentIndex % imageCount : 0;

  const nextIndex = imageCount > 1 ? (safeIndex + 1) % imageCount : 0;

  const enteringIndex =
    imageCount > 2 ? (safeIndex + 2) % imageCount : nextIndex;

  // Auto swap logic
  useEffect(() => {
    if (imageCount < 2 || isPaused || isDisabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setIsSwapping(true);
      setEnterActive(false);

      requestAnimationFrame(() => setEnterActive(true));

      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setIsSwapping(false);
        setEnterActive(false);
      }, swapDurationMs);
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imageCount, isPaused, isDisabled, intervalMs, swapDurationMs]);

  return {
    currentIndex: safeIndex,
    nextIndex,
    enteringIndex,
    isSwapping,
    enterActive,
    swapDurationMs,
  };
}
