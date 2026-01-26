"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Fustat, Roboto_Mono } from "next/font/google";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import "./globals.css";

import CookieConsent from "../components/CookieConsent";
import Footer from "../components/ui/Footer";
import { I18nProvider } from "../lib/I18nContext";

import enDict from "../dictionaries/en.json";
import nlDict from "../dictionaries/nl.json";

import { MenuProvider } from "../components/ui/MenuFolder/MenuProvider";
import { DesktopHeader } from "../components/ui/MenuFolder/DesktopHeader.js";
import { MobileHeader } from "../components/ui/MenuFolder/MobileHeader";
import { MenuDrawer } from "../components/ui/MenuFolder/MenuDrawer";

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

  const isServicesPage = pathname?.includes("/services");
  const onBrandBackground = isServicesPage;
  const bgColor = isServicesPage ? "var(--bg_brand)" : "var(--background)";

  const buildHref = (slug = "") => (slug ? `/${locale}/${slug}` : `/${locale}`);

  const navItems = [
    { label: dict.nav.services, slug: "services" },
    { label: dict.nav.cases, slug: "cases" },
    { label: dict.nav.methodology, slug: "methodology" },
    { label: dict.nav.about, slug: "about" },
    { label: dict.nav.contact, slug: "contact" },
  ];

  return (
    <html className={`${fustat.variable} ${robotoMono.variable}`}>
      <head>
        {gaId && (
          <>
            <script defer src="/gtag-init.js" />
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
          </>
        )}
      </head>

      <body style={{ backgroundColor: bgColor }}>
        <Suspense fallback={null}>
          <I18nProvider value={{ locale, dict }}>
            <MenuProvider>
              <DesktopHeader buildHref={buildHref} invert={onBrandBackground} />
              <MobileHeader buildHref={buildHref} invert={onBrandBackground} />
              <MenuDrawer items={navItems} buildHref={buildHref} />
            </MenuProvider>
            {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
            {gaId && (
              <Suspense fallback={null}>
                <CookieConsent GA_MEASUREMENT_ID={gaId} />
              </Suspense>
            )}

            {children}
            <Footer />
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}
