"use client";

import { useI18n } from "../lib/I18nContext";
import ContactForm from "./ContactForm";
import Header from "./ui/Header";

export default function Contact() {
  const { locale, dict } = useI18n();
  const homeContact = dict?.pages?.home?.contact ?? {};
  const contactCopy = dict?.pages?.contact ?? {};
  const defaultFields = {
    name: "Name",
    email: "Work email",
    organization: "Organisation",
    message: "How can we help?",
  };
  const fields = { ...defaultFields, ...(contactCopy.fields ?? {}) };
  const submitLabel = contactCopy.submit ?? "Send message";
  const successNote =
    contactCopy.success ??
    "We aim to reply with next steps within two working days.";
  const formName = "contact";
  const formFields = [
    { key: "name", type: "text", autoComplete: "name" },
    { key: "email", type: "email", autoComplete: "email" },
    { key: "organization", type: "text", autoComplete: "organization" },
    { key: "message", type: "textarea", rows: 6 },
  ];

  return (
    <section className="w-full md:w-5/6 py-24 mx-auto sm:py-20 md:my-40 px-6 overflow-hidden">
      {/* Background SVG */}
      <Header title={"Contact us"} />

      {/* Overlay content */}
      <div className="relative w-full max-w-6xl mx-auto py-20 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        <div className="text-center lg:text-left">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--content_dark)]">
            {homeContact.sentence}
          </h3>
          <p className="mt-5 text-base md:text-lg text-[var(--content_dark)]/80 max-w-2xl mx-auto lg:mx-0">
            {contactCopy.description ??
              "Share a few details about your project, team, or policy question so we can prepare the right context before we connect."}
          </p>
        </div>

        <ContactForm
          locale={locale}
          formName={formName}
          formFields={formFields}
          fields={fields}
          submitLabel={submitLabel}
          successNote={successNote}
        />
      </div>
    </section>
  );
}
