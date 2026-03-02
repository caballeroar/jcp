import Header from "@/components/ui/Header";
import { getDictionary } from "../../../lib/i18n";
import ContactForm from "@/components/ContactForm";

export const dynamicParams = false;
const locales = ["en", "nl"];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale).catch(() => ({}));
  const copy = dict?.pages?.contact ?? {};
  const defaultFields = {
    name: "Name",
    email: "Work email",
    organization: "Organisation",
    message: "How can we help?",
  };
  const fields = { ...defaultFields, ...(copy.fields ?? {}) };
  const description =
    copy.description ??
    "Share a few details about your project, team, or policy question so we can prepare the right context before we connect.";
  const submitLabel = copy.submit ?? "Send message";
  const successNote =
    copy.success ?? "We aim to reply with next steps within two working days.";
  const formName = "contact";
  const tags = [fields.name, fields.email, fields.organization];
  const formFields = [
    { key: "name", type: "text", autoComplete: "name" },
    { key: "email", type: "email", autoComplete: "email" },
    { key: "organization", type: "text", autoComplete: "organization" },
    { key: "message", type: "textarea", rows: 6 },
  ];

  return (
    <main className="min-h-screen px-6 py-12 text-[var(--content_dark)] bg-[var(--background)] space-y-8">
      <div className="pt-40">
        <Header title={copy.heading ?? "Contact Us"} level="h1" />
      </div>
      <ContactForm
        locale={locale}
        formName={formName}
        formFields={formFields}
        fields={fields}
        submitLabel={submitLabel}
        successNote={successNote}
      />
    </main>
  );
}
