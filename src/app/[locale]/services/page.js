import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";

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
  const servicesCopy = dict?.pages?.services ?? {};

  const title = servicesCopy.heading ?? "Services";

  return (
    <main
      data-brand-bg
      className="min-h-screen bg-[var(--bg_brand)] text-foreground p-8"
    >
      <Header title={title} level="h1" variant="white" />
    </main>
  );
}
