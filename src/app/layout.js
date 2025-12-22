import "./globals.css";
import { Fustat } from "next/font/google";
import { Suspense } from "react";
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import CookieConsent from "../components/CookieConsent";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-fustat",
});

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html className={`${fustat.variable}`}>
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
