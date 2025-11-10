import Link from "next/link";
import { getDictionary } from "../../lib/i18n";
import { notFound } from "next/navigation";

const locales = ["en", "nl"];

export default async function Page({ params }) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 text-center px-6">
      {/* <img src="/images/logo.svg" alt="Logo" className="w-24 mb-6" /> */}
      <h1 className="text-3xl font-semibold mb-2">{dict.title}</h1>
      <p className="text-gray-600 mb-8">{dict.message}</p>
      <div className="flex gap-4 text-blue-600">
        <Link href="/en">English</Link>
        <Link href="/nl">Nederlands</Link>
      </div>
    </main>
  );
}
