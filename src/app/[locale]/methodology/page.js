import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";

export const dynamicParams = false;

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function MethodologyPage({ params }) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  const outlinedHeading =
    "text font-monument-extended text-stroke-brand text-8xl md:text-9xl tracking-tight uppercase";

  return (
    <main>
      <h1 className={outlinedHeading}>
        {dict?.pages?.methodology?.heading ?? "Methodology"}
      </h1>
    </main>
  );
}
