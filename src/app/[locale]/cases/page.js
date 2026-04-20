import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import { getCaseImages } from "../../../data/cases";
import CasesClientPage from "./CasesClientPage";

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function CasesPage({ params, searchParams }) {
  const { locale } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const initialCaseSlug =
    typeof resolvedSearchParams.case === "string"
      ? resolvedSearchParams.case
      : null;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const casesCopy = dict?.pages?.cases ?? {};
  const folders = (casesCopy.folders ?? []).map((entry, idx) => ({
    slug: entry?.slug || `case-${idx + 1}`,
    client: entry?.client,
    sentence: entry?.sentence,
    cta: entry?.cta ?? casesCopy.buttonLabel ?? "View case",
    images: getCaseImages(entry?.slug || `case-${idx + 1}`),
  }));

  return (
    <CasesClientPage
      key={initialCaseSlug ?? "no-case"}
      locale={locale}
      heading={casesCopy.heading ?? "Cases"}
      folders={folders}
      initialCaseSlug={initialCaseSlug}
    />
  );
}
