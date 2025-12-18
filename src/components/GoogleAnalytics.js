"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debug: Check if component is rendering and has GA ID
  console.log("GoogleAnalytics component loaded with ID:", GA_MEASUREMENT_ID);

  useEffect(() => {
    const url = `${pathname}${searchParams}`;

    // gtag('config') must be called each time the route changes
    gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  // Try direct HTML approach as fallback
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];

      // Create gtag function
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };

      // Load GA script manually
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;

      script.onload = () => {
        console.log("GA script loaded successfully (manual method)");
        // Initialize GA
        window.gtag("js", new Date());
        window.gtag("config", GA_MEASUREMENT_ID, {
          page_path: window.location.pathname,
        });
      };

      script.onerror = (e) => {
        console.error("GA script still failed to load (manual method):", e);
      };

      document.head.appendChild(script);
    }
  }, [GA_MEASUREMENT_ID]);

  return null;
}

// Helper function to safely call gtag
function gtag(...args) {
  if (typeof window !== "undefined") {
    window.gtag =
      window.gtag ||
      function () {
        (window.dataLayer = window.dataLayer || []).push(arguments);
      };
    window.gtag(...args);
  }
}
