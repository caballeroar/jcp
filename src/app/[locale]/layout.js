import "../globals.css";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale || "en"}>
      <body>
        {/* This transition wrapper might not be necessary */}
        {children}
      </body>
    </html>
  );
}
