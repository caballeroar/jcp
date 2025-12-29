"use client";

import "./globals.css";
import { Fustat, Roboto_Mono } from "next/font/google";
import { Suspense } from "react";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import CookieConsent from "../components/CookieConsent";
import RouteTransitionOverlay from "../components/RouteTransitionOverlay";
import { Menu } from "@/components/ui";
import { useState } from "react";
import enDict from "../dictionaries/en.json";
import nlDict from "../dictionaries/nl.json";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-fustat",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto-mono",
});

const dictionaries = {
  en: enDict,
  nl: nlDict,
};

export default function RootLayout({ children, initialLocale, initialDict }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [locale, setLocale] = useState(initialLocale);
  const [dict, setDict] = useState(initialDict);
  const [isLoading, setIsLoading] = useState(false);

  const switchLanguage = (newLocale) => {
    if (newLocale === locale) return;

    setIsLoading(true);

    setTimeout(() => {
      setLocale(newLocale);
      setDict(dictionaries[newLocale]);
      setIsLoading(false);

      // Update URL without page reload
      window.history.pushState({}, "", `/${newLocale}/`);
    }, 200);
  };

  return (
    <html className={`${fustat.variable} ${robotoMono.variable}`}>
      <head>
        {gaId && (
          <>
            {/* Define dataLayer/gtag without inline JS for CSP safety */}
            <script defer src="/gtag-init.js" />
            {/* Load GA4 gtag library */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
          </>
        )}
      </head>
      <body>
        <Menu
          locale={locale}
          onLocaleToggle={switchLanguage}
          localeDisabled={isLoading}
        />
        <RouteTransitionOverlay />
        {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
        {gaId && (
          <Suspense fallback={null}>
            <CookieConsent GA_MEASUREMENT_ID={gaId} />
          </Suspense>
        )}
        {children}
      </body>
    </html>
  );
}
