"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function GoogleAnalyticsInner({ GA_MEASUREMENT_ID }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debug: Check if component is rendering and has GA ID
  console.log("GoogleAnalytics component loaded with ID:", GA_MEASUREMENT_ID);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      const url = `${pathname}${searchParams}`;
      // gtag('config') must be called each time the route changes
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}

export function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
    </Suspense>
  );
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
