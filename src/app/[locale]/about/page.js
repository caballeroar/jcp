import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function AboutPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const aboutCopy = dict?.pages?.about ?? {};

  const title = aboutCopy.heading ?? "About";

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <Header title={title} level="h1" />
    </main>
  );
}
