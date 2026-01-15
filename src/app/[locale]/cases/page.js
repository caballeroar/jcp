import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import Folder from "../../../components/ui/Folder";
import { getCaseImages } from "../../../data/cases";

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function CasesPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const folders = Array.isArray(dict?.pages?.cases?.folders)
    ? dict.pages.cases.folders.map((f) => ({
        ...f,
        images: getCaseImages(f.slug),
      }))
    : [];

  const outlinedHeading =
    "text font-monument-extended text-stroke-brand text-8xl md:text-9xl tracking-tight";

  return (
    <main className="min-h-screen bg-background text-foreground p-8 ">
      <div className="flex justify-center my-40">
        <h1 className={outlinedHeading}>CASES</h1>
      </div>
      <div className="mx-auto mb-40 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
          {folders.map((item, index) => (
            <Folder
              key={index}
              locale={locale}
              title={item.client}
              description={item.sentence}
              images={item.images}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
