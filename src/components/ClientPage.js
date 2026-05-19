"use client";

import Hero from "./Hero";
import Environment from "./Environment";
import Methodology2 from "./Methodology_2";
import Cases from "./Cases";
import Testimonials from "./Testimonials";
import Services from "../components/services/Services";
import { useI18n } from "../lib/I18nContext";
import Contact from "./Contact";
import { SERVICES as mappedServices } from "../data/services";

export default function ClientPage() {
  const { dict } = useI18n();
  const servicesCopy =
    dict?.pages?.home?.services ?? dict?.pages?.services ?? {};

  return (
    <main className="overflow-hidden">
      <div className="min-h-screen">
        <Environment />
      </div>
      <Hero />
      <Methodology2 />
      <Testimonials />
      <Cases />
      <Services copy={servicesCopy} services={mappedServices} />
      <Contact />
    </main>
  );
}
