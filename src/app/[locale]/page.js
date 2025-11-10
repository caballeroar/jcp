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
      {/* Add this debug element */}
      <div className="font-test mb-4"></div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-normal mb-4">{dict.title}</h1>
        <h2 className="text-2xl font-extralight mb-8 text-gray-700">
          {dict.subtitle}
        </h2>

        <div className="mb-8">
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto font-extralight">
            {dict.keywords}
          </p>
        </div>

        {/* Logo placeholder */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-500">
            [LOGO]
          </div>
        </div>

        <p className="text-blue-600 mb-8">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {dict.contact}
          </a>
        </p>

        <div className="flex gap-4 text-blue-600">
          <Link href="/en" className="hover:underline">
            English
          </Link>
          <Link href="/nl" className="hover:underline">
            Nederlands
          </Link>
        </div>
      </div>
    </main>
  );
}
