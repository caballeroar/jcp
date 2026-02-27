import Header from "@/components/ui/Header";
import { getDictionary } from "../../../lib/i18n";

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
      <Header title={copy.heading ?? "Contact Us"} level="h1" />

      <section className="mx-auto w-full max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <aside
            className="relative overflow-hidden rounded-[32px] border border-white/10 p-8 text-[var(--content_light)] shadow-[0_30px_90px_rgba(6,6,6,0.35)]"
            style={{
              background:
                "linear-gradient(135deg, rgba(12,16,22,0.95), rgba(12,38,32,0.85))",
            }}
          >
            <div className="pointer-events-none" aria-hidden="true">
              <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.28),_transparent_65%)] blur-3xl" />
              <div className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(83,255,205,0.35),_transparent_70%)] blur-3xl" />
            </div>

            <div className="relative space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                {copy.heading ?? "Contact"}
              </p>
              <p className="text-2xl font-semibold leading-snug text-white">
                {description}
              </p>
              <ul className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                {tags.map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-white/30 px-4 py-2 text-[0.65rem]"
                  >
                    {label}
                  </li>
                ))}
              </ul>
              <p className="rounded-3xl border border-white/30 bg-white/5 p-4 text-sm leading-relaxed text-white/80">
                {successNote}
              </p>
            </div>
          </aside>

          <form
            name={formName}
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/70 p-8 text-[var(--content_dark)] shadow-[0_25px_70px_rgba(15,15,15,0.15)] backdrop-blur"
          >
            <input type="hidden" name="form-name" value={formName} />
            <input type="hidden" name="locale" value={locale} />
            <p className="hidden">
              <label>
                Do not fill this out if you are human:
                <input name="bot-field" />
              </label>
            </p>

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
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-[var(--surface)] px-8 py-4 text-base font-semibold text-[var(--content_light)] shadow-[0_20px_35px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_45px_rgba(0,0,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/30"
              >
                {submitLabel}
              </button>
              <p className="text-sm text-[var(--content_dark)] opacity-75">
                {copy.success ?? successNote}
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
