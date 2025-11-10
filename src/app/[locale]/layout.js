import "../globals.css";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale || "en"}>
      <body>{children}</body>
    </html>
  );
}
