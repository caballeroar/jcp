import { useEffect } from "react";

export function useScrollProgress(ref, options = {}) {
  const { start = 0, end = 1 } = options;

  useEffect(() => {
    if (!ref.current) return;

    let readRaf = null;
    let smoothRaf = null;
    let targetProgress = 0;
    let currentProgress = null;

    const EASING = 0.18;
    const SNAP_EPSILON = 0.0005;

    const readTargetProgress = () => {
      readRaf = null;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      const raw = (vh - rect.top) / (vh + rect.height);
      const range = Math.max(0.0001, end - start);
      const normalized = (raw - start) / range;
      targetProgress = Math.max(0, Math.min(1, normalized));

      if (currentProgress === null) {
        currentProgress = targetProgress;
        el.style.setProperty("--scroll-progress", currentProgress.toFixed(4));
      }

      if (!smoothRaf) {
        smoothRaf = requestAnimationFrame(smoothStep);
      }
    };

    const smoothStep = () => {
      smoothRaf = null;
      const el = ref.current;
      if (!el || currentProgress === null) return;

      const delta = targetProgress - currentProgress;
      if (Math.abs(delta) <= SNAP_EPSILON) {
        currentProgress = targetProgress;
        el.style.setProperty("--scroll-progress", currentProgress.toFixed(4));
        return;
      }

      currentProgress += delta * EASING;
      el.style.setProperty("--scroll-progress", currentProgress.toFixed(4));
      smoothRaf = requestAnimationFrame(smoothStep);
    };

    const onScroll = () => {
      if (readRaf) return;
      readRaf = requestAnimationFrame(readTargetProgress);
    };

    readTargetProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (readRaf) cancelAnimationFrame(readRaf);
      if (smoothRaf) cancelAnimationFrame(smoothRaf);
    };
  }, [ref, start, end]);
}
