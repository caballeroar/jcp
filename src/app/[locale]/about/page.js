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

      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          {aboutCopy?.heroTitle}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[var(--content_muted)]">
          {aboutCopy?.heroSubtitle}
        </p>
      </section>

      {/* Who we are */}
      <section className="max-w-3xl mx-auto mt-32">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {aboutCopy?.whoTitle}
        </h2>
        <p className="mt-6 leading-relaxed text-lg text-[var(--content_muted)]">
          {aboutCopy?.whoBody}
        </p>
      </section>

      {/* How we work */}
      <section className="max-w-4xl mx-auto mt-32">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {aboutCopy?.approachTitle}
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-12">
          {aboutCopy?.approachSteps?.map((step, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="mt-4 text-[var(--content_muted)]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Focus */}
      <section className="max-w-4xl mx-auto mt-32">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {aboutCopy?.focusTitle}
        </h2>
        <ul className="mt-8 space-y-4 text-[var(--content_muted)]">
          {aboutCopy?.focusList?.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </section>

      {/* Why */}
      <section className="max-w-4xl mx-auto mt-32">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {aboutCopy?.whyTitle}
        </h2>
        <ul className="mt-8 space-y-4 text-[var(--content_muted)]">
          {aboutCopy?.whyList?.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="text-center mt-32">
        <p className="text-xl font-medium">{aboutCopy?.ctaText}</p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block mt-8 px-8 py-4 bg-[var(--content_dark)] text-white"
        >
          {aboutCopy?.ctaButton}
        </Link>
      </section>
    </main>
  );
}
