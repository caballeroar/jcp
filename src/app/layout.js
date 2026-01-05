"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Fustat, Roboto_Mono } from "next/font/google";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import "./globals.css";

import CookieConsent from "../components/CookieConsent";
import RouteTransitionOverlay from "../components/RouteTransitionOverlay";
import { Menu } from "@/components/ui";
import Footer from "../components/Footer";
import { I18nProvider } from "../lib/I18nContext";

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

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const firstSeg = pathname?.split("/").filter(Boolean)[0];
  const supportedLocales = ["en", "nl"];
  const locale = supportedLocales.includes(firstSeg) ? firstSeg : "en";
  const dict = dictionaries[locale];

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const switchLanguage = (newLocale) => {
    if (newLocale === locale) return;
    router.push(`/${newLocale}/`);
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
      <body className="bg-black text-white">
        <I18nProvider value={{ locale, dict }}>
          <Menu
            locale={locale}
            onLocaleToggle={switchLanguage}
            localeDisabled={false}
          />
          <RouteTransitionOverlay />
          {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
          {gaId && (
            <Suspense fallback={null}>
              <CookieConsent GA_MEASUREMENT_ID={gaId} />
            </Suspense>
          )}
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
