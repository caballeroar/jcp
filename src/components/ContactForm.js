"use client";

import { useState } from "react";
import { submitContactForm } from "@/utils/contact";
import { Button } from "./ui";

export default function ContactForm({
  locale,
  formName,
  formFields,
  fields,
  submitLabel,
  successNote,
}) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.target;

    const payload = {
      name: form.name.value,
      email: form.email.value,
      organization: form.organization.value,
      message: form.message.value,
      companyWebsite: form.companyWebsite?.value || "",
    };

    const result = await submitContactForm(payload);

    setStatus(result.message);
    setLoading(false);

    if (result.ok) {
      form.reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/70 p-8 text-[var(--content_dark)] shadow-[0_25px_70px_rgba(15,15,15,0.15)] backdrop-blur"
    >
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot */}
      <input
        type="text"
        name="companyWebsite"
        className="hidden"
        tabIndex="-1"
        autoComplete="off"
      />

      <div className="space-y-6">
        {formFields.map((field) => {
          const id = `${formName}-${field.key}`;
          const label = fields[field.key];
          const inputClasses =
            "w-full rounded-[28px] border border-black/10 bg-white/60 px-5 py-4 text-base font-medium text-[var(--content_dark)] placeholder:text-black/40 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition";

          return (
            <label
              key={field.key}
              htmlFor={id}
              className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.25em]"
            >
              <span className="text-[var(--content_dark)] opacity-70">
                {label}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.key}
                  rows={field.rows}
                  required
                  placeholder={label}
                  className={`${inputClasses} resize-none`}
                />
              ) : (
                <input
                  id={id}
                  type={field.type}
                  name={field.key}
                  autoComplete={field.autoComplete}
                  required
                  placeholder={label}
                  className={inputClasses}
                />
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-8 space-y-3">
        <Button
          type="submit"
          disabled={loading}
          theme="dark"
          //   className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-[var(--surface)] px-8 py-4 text-base font-semibold text-[var(--content_light)] shadow-[0_20px_35px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_45px_rgba(0,0,0,0.25)] disabled:opacity-60"
        >
          {loading ? "Sending..." : submitLabel}
        </Button>

        <p className="text-sm text-[var(--content_dark)] opacity-75">
          {status ?? successNote}
        </p>
      </div>
    </form>
  );
}
