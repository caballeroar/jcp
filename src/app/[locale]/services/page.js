import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <nav className="mb-12">
          <Link
            href={`/${locale}`}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            ← {dict.nav.home}
          </Link>
        </nav>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {dict.pages.services.title}
          </h1>
          <h2 className="text-xl font-light mb-8 text-foreground/70">
            {dict.pages.services.subtitle}
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {dict.pages.services.description}
          </p>
        </div>

        {/* Language Switch */}
        <div className="flex justify-center gap-4 mt-12 text-sm">
          <Link
            href="/en/services"
            className={`hover:underline transition-colors ${
              locale === "en"
                ? "text-foreground font-medium"
                : "text-foreground/60"
            }`}
          >
            English
          </Link>
          <Link
            href="/nl/services"
            className={`hover:underline transition-colors ${
              locale === "nl"
                ? "text-foreground font-medium"
                : "text-foreground/60"
            }`}
          >
            Nederlands
          </Link>
        </div>
      </div>
    </main>
  );
}
