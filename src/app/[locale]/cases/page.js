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
  const folders = (casesCopy.folders ?? []).map((entry, idx) => {
    const slug = entry?.slug || `case-${idx + 1}`;
    const title = entry?.title ?? entry?.client ?? "";
    const sentence =
      entry?.sentence ?? entry?.description ?? entry?.challenge ?? "";

    return {
      slug,
      title,
      client: entry?.client ?? title,
      sentence,
      description: entry?.description ?? sentence,
      challenge: entry?.challenge ?? "",
      solution: entry?.solution ?? "",
      themes: Array.isArray(entry?.themes) ? entry.themes : [],
      services: Array.isArray(entry?.services) ? entry.services : [],
      cta: entry?.cta ?? casesCopy.buttonLabel ?? "View case",
      images: getCaseImages(slug),
    };
  });

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
