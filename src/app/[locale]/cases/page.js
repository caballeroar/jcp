import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import { getCaseImages } from "../../../data/cases";
import CasesClientPage from "./CasesClientPage";

export const dynamicParams = false;

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function CasesPage({ params, searchParams }) {
  const { locale } = params;
  const initialExpandedSlug = searchParams?.slug || null;

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

  const casesDict = dict?.pages?.cases || {};
  const heading = casesDict.heading ?? "CASES";
  const buttonLabel = casesDict.buttonLabel ?? "View case";
  const prevProjectLabel = casesDict.prevProjectLabel ?? "Previous project";
  const nextProjectLabel = casesDict.nextProjectLabel ?? "Next project";
  const closeLabel = casesDict.closeLabel ?? "Close";

  return (
    <CasesClientPage
      initialFolders={folders}
      locale={locale}
      heading={heading}
      buttonLabel={buttonLabel}
      prevProjectLabel={prevProjectLabel}
      nextProjectLabel={nextProjectLabel}
      closeLabel={closeLabel}
      initialExpandedSlug={initialExpandedSlug}
    />
  );
}
