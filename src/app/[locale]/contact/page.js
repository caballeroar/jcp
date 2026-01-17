import { getDictionary } from "../../../lib/i18n";

export const dynamicParams = false;
const locales = ["en", "nl"];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale).catch(() => ({}));
  const copy = dict?.pages?.contact ?? {};

  return (
    <main className="min-h-screen px-6 py-12 text-[var(--content_dark)] bg-[var(--background)] space-y-6">
      <h1 className="text-4xl font-semibold">{copy.heading ?? "Contact"}</h1>
    </main>
  );
}
