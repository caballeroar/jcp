"use client";
import { useEffect, useState } from "react";

export function useIntersectionOnce(ref, options = { threshold: 0.25 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, options);

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, visible]);

  return visible;
}
