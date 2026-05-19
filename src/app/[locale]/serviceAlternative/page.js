import { notFound } from "next/navigation";
import Header from "../../../components/ui/Header";
import ServiceCards from "../../../components/serviceCards/serviceCards";

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function ServiceAlternativePage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl pt-20 md:pt-28">
        <Header title="Service Alternative" level="h1" />
      </div>
      <ServiceCards />
    </main>
  );
}
