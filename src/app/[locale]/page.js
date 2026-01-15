import { notFound } from "next/navigation";
import ClientPage from "../../components/ClientPage";

const locales = ["en", "nl"];
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function Page({ params }) {
  const { locale } = await params; // unwrap params

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ClientPage initialLocale={locale} />;
}
