"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// A lightweight full-screen overlay that fades in on navigation start
// and fades out after the route changes. Trigger by adding the class
// `route-transition-active` to <html> before navigation (e.g., on link click).
export default function RouteTransitionOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // When the pathname changes, if a transition was triggered, play exit.
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const active = html.classList.contains("route-transition-active");
    if (!active) return;
    // Ensure overlay is visible during the route swap
    const t0 = setTimeout(() => setVisible(true), 0);
    // Fade out and clear the flag after a short delay
    const t1 = setTimeout(() => {
      html.classList.remove("route-transition-active");
      setVisible(false);
    }, 500); // exit duration
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [pathname, mounted]);

  // Enter: when class is added prior to navigation
  useEffect(() => {
    if (!mounted) return;
    const onClassChange = () => {
      const html = document.documentElement;
      const active = html.classList.contains("route-transition-active");
      if (active) setVisible(true);
    };
    // Poll for class addition (since we don't have a mutation observer here)
    const id = setInterval(onClassChange, 50);
    return () => clearInterval(id);
  }, [mounted]);

  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        background: "var(--bg_gradient)",
        opacity: 0.85,
        transition: "opacity 500ms ease",
      }}
    />
  );
}
