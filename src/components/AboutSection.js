"use client";

import { useMemo, useState } from "react";
import { useI18n } from "../lib/I18nContext";
import Team from "../../public/assets/team.jpg";
import Header from "./ui/Header";
import Image from "next/image";

const FALLBACK_TEAM = {
  en: [
    {
      id: "amel",
      name: "Amel Ramirez",
      role: "Founder & Strategy Lead",
      bio: "Bridges policy, participation and delivery to make complex sustainability transitions understandable and actionable.",
      image: "/assets/jay.jpeg",
    },
    {
      id: "kai",
      name: "Kai de Vries",
      role: "Research & Insights",
      bio: "Designs inclusive research processes and translates stakeholder insight into strategic direction.",
      image: "/assets/amel.png",
    },
    {
      id: "nora",
      name: "Nora Janssen",
      role: "Partnerships & Programs",
      bio: "Builds trusted collaborations across institutions and communities to move initiatives from plan to practice.",
      image: "/assets/andrew.jpg",
    },
    {
      id: "sara",
      name: "Sara Verbeek",
      role: "Design Lead",
      bio: "Creates human-centred service experiences that connect strategy and implementation.",
      image: "/assets/marlies.jpeg",
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

function normalizeImageSrc(src) {
  if (typeof src !== "string") return null;
  const trimmedSrc = src.trim();
  return trimmedSrc.length > 0 ? trimmedSrc : null;
}

export default function AboutSection() {
  const { locale, dict } = useI18n();

  const lang = locale === "nl" ? "nl" : "en";

  const team = useMemo(() => {
    const translatedTeam = dict?.pages?.home?.about?.team;

    if (Array.isArray(translatedTeam) && translatedTeam.length > 0) {
      return translatedTeam;
    }

    return FALLBACK_TEAM[lang] ?? FALLBACK_TEAM.en ?? [];
  }, [dict, lang]);

  const [activeMemberId, setActiveMemberId] = useState(null);

  const activeMember = useMemo(() => {
    if (!Array.isArray(team) || team.length === 0) return null;
    return team.find((member) => member.id === activeMemberId) ?? team[0];
  }, [team, activeMemberId]);

  return (
    <section className="mx-auto max-w-7xl px-6 my-[20%]">
      <Header title="About Us" level="h4" variant="accent" />

      <div className="mx-auto max-w-3xl py-6 text-center">
        <p className="text-[clamp(1.35rem,5vw,2.4rem)] text-center font-bold leading-[1.02] tracking-[-0.02em]">
          Shaping systems that create lasting impact.
        </p>

        <p className="text-[clamp(0.5rem,5vw,1.3rem)] py-6 text-center font-normal leading-relaxed tracking-normal">
          We work with governments, organisations and communities to transform
          ambitious goals into practical solutions. By combining strategy,
          design and implementation, we help create change that is measurable,
          sustainable and centred around people.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1.7fr_1fr] max-w-4xl mx-auto">
        <div className="relative min-h-[520px] overflow-hidden rounded-[32px]">
          <Image
            src={Team}
            alt="Workshop"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="grid gap-4">
          <div className="relative h-[252px] overflow-hidden rounded-[32px]">
            <Image
              src={Team}
              alt="Collaboration"
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="relative h-[252px] overflow-hidden rounded-[32px]">
            <Image
              src={Team}
              fill
              alt="Team session"
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-40 max-w-4xl mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight text-[var(--accent)]">
            Team Members
          </h2>

          <p className="mt-6 text-[clamp(0.8rem,2.5vw,1.2rem)] tracking-relaxed leading-relaxed text-[var(--content_dark)]/80">
            We are a multidisciplinary team with a shared passion for solving
            complex societal challenges. Through research, strategy, design and
            facilitation, we help organisations move from ambition to
            implementation.
          </p>
        </div>

        <div className="mt-20 grid gap-20 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT SIDE */}

          <div className="flex flex-wrap gap-6 max-w-[560px]">
            {team.map((member) => {
              const isActive = activeMember?.id === member.id;
              const memberImageSrc = normalizeImageSrc(member?.image);

              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setActiveMemberId(member.id)}
                  className={`
                    relative h-32 w-32 overflow-hidden rounded-full
                    transition-all duration-300
                    ${
                      isActive
                        ? "scale-105 ring-2 ring-[var(--content_brand)]"
                        : "opacity-100 hover:scale-105"
                    }
                  `}
                >
                  {memberImageSrc ? (
                    <Image
                      fill
                      src={memberImageSrc}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xl font-semibold">
                      {initialsFromName(member.name)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE */}

          <div className="max-w-md">
            <h4 className="text-[clamp(1.5rem,4vw,2rem)] font-normal tracking-tight">
              {activeMember?.name}
            </h4>
            <p className="mt-3 text-lg font-medium text-[var(--accent)]">
              {activeMember?.role}
            </p>
            <div className="mt-4 h-px w-40 bg-[var(--content_brand)]" />
            <p className="mt-6 text-[clamp(0.8rem,2.5vw,1.2rem)] leading-relaxed text-[var(--content_dark)]/80">
              {activeMember?.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
