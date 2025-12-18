"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function GoogleAnalyticsTracker({ GA_MEASUREMENT_ID }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Respect Do Not Track and only run in production
    const dnt =
      typeof navigator !== "undefined" &&
      (navigator.doNotTrack === "1" || window.doNotTrack === "1");
    if (process.env.NODE_ENV !== "production" || dnt) return;

    if (typeof window !== "undefined" && window.gtag) {
      const query = searchParams ? searchParams.toString() : "";
      const url = query ? `${pathname}?${query}` : pathname;
      // Track page changes for SPA navigation
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null; // Only handles tracking, no HTML output
}

export function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
    </Suspense>
  );
}

// No inline helpers here; gtag/dataLayer are declared in /public/gtag-init.js
