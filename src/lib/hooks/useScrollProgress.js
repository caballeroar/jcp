import { useEffect } from "react";

export function useScrollProgress(ref, options = {}) {
  const { start = 0, end = 1 } = options;

  useEffect(() => {
    if (!ref.current) return;

    let raf = null;

    const update = () => {
      raf = null;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      const raw = (vh - rect.top) / (vh + rect.height);
      const range = Math.max(0.0001, end - start);
      const normalized = (raw - start) / range;
      const clamped = Math.max(0, Math.min(1, normalized));

      el.style.setProperty("--scroll-progress", clamped.toFixed(4));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, start, end]);
}
