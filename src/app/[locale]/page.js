import { notFound } from "next/navigation";
import ClientPage from "../../components/ClientPage";

export const dynamicParams = false;

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Page({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ClientPage />;
}
