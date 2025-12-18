import "./globals.css";
import { Fustat } from "next/font/google";
import { GoogleAnalytics } from "../components/GoogleAnalytics";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-fustat",
});

export default function RootLayout({ children }) {
  // Debug: Check if GA ID is loaded
  console.log("GA_MEASUREMENT_ID:", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return (
    <html className={`${fustat.variable} ${fustat.className}`}>
      <body>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics
            GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
        {children}
      </body>
    </html>
  );
}
