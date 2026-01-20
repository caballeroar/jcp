import { getDictionary } from "../../../lib/i18n";
import MethodologyPageContent from "../../../components/MethodologyPageContent";

export const dynamicParams = false;
const locales = ["en", "nl"];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function MethodologyPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale).catch(() => ({}));
  const copy = dict?.pages?.methodology ?? {};
  const homeCopy = dict?.pages?.home?.methodology ?? {};
  const ctaLabel = copy?.cta ?? homeCopy?.cta ?? null;

  return (
    <main className="relative min-h-screen bg-[var(--background)] text-[var(--content_dark)]">
      <MethodologyPageContent copy={copy} locale={locale} ctaLabel={ctaLabel} />
    </main>
  );
}
