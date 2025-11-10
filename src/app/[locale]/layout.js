import "../globals.css";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale || "en"}>
      <body>
        <div className="transition-opacity duration-300 ease-in-out">
          {children}
        </div>
      </body>
    </html>
  );
}
