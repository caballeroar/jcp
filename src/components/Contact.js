"use client";

import { useI18n } from "../lib/I18nContext";
import ContactForm from "./ContactForm";

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
    <section className="relative w-full md:w-5/6 py-24 mx-auto sm:py-20 md:my-40 px-6 overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 -z-10" style={{ pointerEvents: "none" }}>
        <svg
          className="w-full h-full"
          viewBox="0 0 1148 1093"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbit 1 */}
          <g transform="rotate(-59.1622 384.402 405.368)">
            <path
              id="contactPath1"
              d="M 525.66 405.368 A 141.258 302.174 0 1 0 243.144 405.368 A 141.258 302.174 0 1 0 525.66 405.368 Z"
              fill="none"
              stroke="var(--content_brand)"
            />
            <g>
              <circle r="4" fill="var(--content_brand)" />
              <text
                x="14"
                y="6"
                fill="var(--content_brand)"
                fontSize="14"
                className="font-roboto-mono rotate-60"
              >
                {homeContact.identify}
              </text>
              <animateMotion dur="48s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath1" />
              </animateMotion>
            </g>
          </g>

          {/* Orbit 2 */}
          <g transform="rotate(54.5895 724.149 335.821)">
            <path
              id="contactPath2"
              d="M 879.569 335.821 A 155.42 360.959 0 1 0 568.729 335.821 A 155.42 360.959 0 1 0 879.569 335.821 Z"
              fill="none"
              stroke="var(--content_brand)"
            />
            <g>
              <circle r="4" fill="var(--content_brand)" />
              <text
                x="14"
                y="6"
                fill="var(--content_brand)"
                fontSize="14"
                className="font-roboto-mono rotate-[-55deg]"
              >
                {homeContact.listen}
              </text>
              <animateMotion dur="42s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath2" />
              </animateMotion>
            </g>
          </g>

          {/* Orbit 3 */}
          <g transform="rotate(135 745.172 691.067)">
            <path
              id="contactPath3"
              d="M 886.231 691.067 A 141.059 427.338 0 1 0 604.113 691.067 A 141.059 427.338 0 1 0 886.231 691.067 Z"
              fill="none"
              stroke="var(--content_brand)"
            />
            <g>
              <circle r="4" fill="var(--content_brand)" />
              <text
                x="14"
                y="6"
                fill="var(--content_brand)"
                fontSize="14"
                className="font-roboto-mono rotate-225"
              >
                {homeContact.translate}
              </text>
              <animateMotion dur="46s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath3" />
              </animateMotion>
            </g>
          </g>

          {/* Orbit 4 */}
          <g transform="rotate(-123.807 352.906 618.302)">
            <path
              id="contactPath4"
              d="M 500.618 618.302 A 147.712 325.811 0 1 0 205.194 618.302 A 147.712 325.811 0 1 0 500.618 618.302 Z"
              fill="none"
              stroke="var(--content_brand)"
            />
            <g>
              <circle r="4" fill="var(--content_brand)" />
              <text
                x="14"
                y="6"
                fill="var(--content_brand)"
                fontSize="14"
                className="font-roboto-mono rotate-124"
              >
                {homeContact.experience}
              </text>
              <animateMotion dur="48s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath4" />
              </animateMotion>
            </g>
          </g>
        </svg>
      </div>

      {/* Overlay content */}
      <div className="relative w-full max-w-6xl mx-auto grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--content_dark)]">
            {homeContact.sentence}
          </h2>
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
