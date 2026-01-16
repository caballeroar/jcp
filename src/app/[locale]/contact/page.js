import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import Contact from "@/components/Contact";

export const dynamicParams = false;

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function ContactPage({ params }) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <main
      className="min-h-screen  text-foreground p-8"
      style={{ background: "var(--bg_box_neutral)" }}
    >
      <Contact locale={locale} dict={dict} />
    </main>
  );
}
