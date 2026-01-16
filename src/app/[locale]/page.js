import { notFound } from "next/navigation";
import ClientPage from "../../components/ClientPage";

export const dynamicParams = false;

const locales = ["en", "nl"];

export async function generateStaticParams() {
  // IMPORTANT: the key must be named "locale" to match the [locale] segment
  return locales.map((locale) => ({ locale }));
}

export default async function Page({ params }) {
  const { locale } = await params; // unwrap params

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ClientPage initialLocale={locale} />;
}
