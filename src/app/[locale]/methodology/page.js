import { getDictionary } from "../../../lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
// Use a plain Link for back navigation to avoid client-only dependencies in an RSC

const locales = ["en", "nl"];

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function MethodologyPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <main
      className="min-h-screen  text-foreground p-8"
      style={{ background: "var(--bg_box_neutral)" }}
    >
      <div className="max-w-4xl mx-auto">
        <BackButton href={`/${locale || "en"}`} />

        {/* Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Methodology</h1>
          <div className="grid gap-8 text-left">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Discovery</h2>
              <p className="text-lg leading-relaxed">
                We align on goals, constraints, and context. Dummy text: lorem
                ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">Research</h2>
              <p className="text-lg leading-relaxed">
                We gather insights, map stakeholders, and surface risks. Dummy
                text: sed do eiusmod tempor incididunt ut labore.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">Design</h2>
              <p className="text-lg leading-relaxed">
                We prototype solutions and iterate with feedback. Dummy text: ut
                enim ad minim veniam, quis nostrud exercitation.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">Delivery</h2>
              <p className="text-lg leading-relaxed">
                We implement, measure outcomes, and refine. Dummy text: ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
