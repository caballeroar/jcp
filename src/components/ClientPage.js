"use client";

import { useMemo } from "react";
import Hero from "./Hero";
import Environment from "./Environment";
import Methodology2 from "./Methodology_2";
import Cases from "./Cases";
import Testimonials from "./Testimonials";
import Services from "../components/services/Services";
import { useI18n } from "../lib/I18nContext";
import { resolveServices } from "../utils/service";
import Contact from "./Contact";

export default function ClientPage() {
  const { dict } = useI18n();
  const servicesCopy =
    dict?.pages?.home?.services ?? dict?.pages?.services ?? {};
  const servicesItems = useMemo(() => resolveServices(dict) ?? [], [dict]);

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="min-h-screen">
        <Environment />
      </div>
      <Methodology2 />
      <Testimonials />
      <Cases />
      <Services copy={servicesCopy} services={servicesItems} />
      <Contact />
    </main>
  );
}
