"use client";

import { useMemo, useState } from "react";
import { useI18n } from "../lib/I18nContext";

const FALLBACK_COPY = {
  en: {
    eyebrow: "About Us",
    title: "A small team focused on human-centered transition work.",
    body: "We partner with public institutions, communities, and organizations to translate sustainability ambitions into practical steps people can trust.",
    values: ["Systems thinking", "Co-creation", "Evidence-driven action"],
    teamTitle: "Team",
  },
  nl: {
    eyebrow: "Over Ons",
    title: "Een klein team met focus op mensgerichte transities.",
    body: "We werken samen met publieke instellingen, gemeenschappen en organisaties om duurzaamheidsambities te vertalen naar praktische stappen die mensen vertrouwen.",
    values: ["Systeemdenken", "Co-creatie", "Actie op basis van bewijs"],
    teamTitle: "Team",
  },
};

const FALLBACK_TEAM = {
  en: [
    {
      id: "amel",
      name: "Amel Ramirez",
      role: "Founder & Strategy Lead",
      bio: "Bridges policy, participation, and delivery to make complex sustainability transitions understandable and actionable.",
    },
    {
      id: "kai",
      name: "Kai de Vries",
      role: "Research & Insights",
      bio: "Designs inclusive research processes and translates stakeholder insight into sharp strategic direction.",
    },
    {
      id: "nora",
      name: "Nora Janssen",
      role: "Partnerships & Programs",
      bio: "Builds trusted collaborations across institutions and communities to move initiatives from plan to practice.",
    },
  ],
  nl: [
    {
      id: "amel",
      name: "Amel Ramirez",
      role: "Oprichter & Strategielead",
      bio: "Verbindt beleid, participatie en uitvoering om complexe duurzaamheidsvraagstukken begrijpelijk en uitvoerbaar te maken.",
    },
    {
      id: "kai",
      name: "Kai de Vries",
      role: "Onderzoek & Inzichten",
      bio: "Ontwerpt inclusieve onderzoeksprocessen en vertaalt stakeholderinzichten naar scherpe strategische keuzes.",
    },
    {
      id: "nora",
      name: "Nora Janssen",
      role: "Partnerschappen & Programma's",
      bio: "Bouwt betrouwbare samenwerkingen tussen instellingen en gemeenschappen om plannen om te zetten in praktijk.",
    },
  ],
};

function initialsFromName(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AboutSection() {
  const { locale, dict } = useI18n();
  const [activeCard, setActiveCard] = useState(null);

  const lang = locale === "nl" ? "nl" : "en";
  const dictAbout = dict?.pages?.home?.about ?? {};

  const copy = {
    ...FALLBACK_COPY[lang],
    ...dictAbout,
    values: dictAbout.values ?? FALLBACK_COPY[lang].values,
  };

  const team = useMemo(() => {
    if (Array.isArray(dictAbout.team) && dictAbout.team.length > 0) {
      return dictAbout.team;
    }
    return FALLBACK_TEAM[lang];
  }, [dictAbout.team, lang]);

  return (
    <section className="relative px-6 py-20 md:py-28 bg-[var(--background)] text-[var(--content_dark)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute top-8 right-0 h-64 w-64 rounded-full bg-[var(--content_brand)]/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[var(--content_brand)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-12 md:space-y-16">
        <div className="grid gap-8 items-start">
          <div>
            <p className="font-roboto-mono text-xs uppercase tracking-[0.24em] text-[var(--content_brand)]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {copy.title}
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-base md:text-lg leading-relaxed text-[var(--content_dark)]/85">
              {copy.body}
            </p>
            <ul className="flex flex-wrap gap-3">
              {copy.values.map((value) => (
                <li
                  key={value}
                  className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            {copy.teamTitle}
          </h3>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {team.map((member) => {
              const isActive = activeCard === member.id;
              const memberInitials = initialsFromName(member.name);

              return (
                <article
                  key={member.id}
                  className="group relative rounded-3xl border border-black/10 bg-white/65 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                  onMouseEnter={() => setActiveCard(member.id)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setActiveCard(isActive ? null : member.id)}
                  >
                    <div className="relative h-60 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#0c2a2f_0%,#3f7f7a_65%,#8ec7be_100%)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.18),transparent_42%)]" />
                      <div className="absolute inset-0 flex items-end p-4">
                        <p className="font-monument-extended text-4xl uppercase text-white/95">
                          {memberInitials}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xl font-semibold leading-tight">
                        {member.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--content_dark)]/70">
                        {member.role}
                      </p>
                    </div>
                  </button>

                  <div
                    className={`pointer-events-none absolute inset-4 rounded-2xl bg-black/70 p-5 text-white transition-all duration-300 ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                    }`}
                  >
                    <p className="font-roboto-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
                      About
                    </p>
                    <p className="mt-3 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
