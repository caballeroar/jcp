import { getDictionary } from "../../lib/i18n";
import { notFound } from "next/navigation";
import ClientPage from "../../components/ClientPage";

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function Page({ params }) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return <ClientPage initialLocale={locale} initialDict={dict} />;
}
