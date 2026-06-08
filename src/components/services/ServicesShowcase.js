"use client";

import { useMemo, useState } from "react";
import { SERVICES as DEFAULT_SERVICES } from "../../data/services";
import NewServiceCard from "./NewServiceCard";
import Header from "../ui/Header";

const toSafeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeServices = (items) => {
  return toSafeArray(items).map((item, index) => ({
    id: item?.id ?? `service-${index}`,
    methodology: item?.methodology ?? "Methodology",
    title: item?.mainService ?? item?.title ?? "Service",
    description:
      item?.mainServiceDescription ??
      item?.description ??
      "Service description",
    outcome: item?.outcome ?? "Outcome",
    subServices: toSafeArray(item?.subServices)
      .map((sub, subIndex) => ({
        id: sub?.id ?? `sub-${index}-${subIndex}`,
        title: sub?.subService ?? sub?.title ?? `Subservice ${subIndex + 1}`,
        description: sub?.subServiceDescription ?? sub?.description ?? "",
      }))
      .slice(0, 4),
  }));
};

export default function ServicesShowcase({ services = [], copy = {} }) {
  const normalizedServices = useMemo(() => {
    const source = services.length ? services : DEFAULT_SERVICES;
    return normalizeServices(source).slice(0, 4);
  }, [services]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const sectionTitle = String(copy?.heading ?? "SERVICES").toUpperCase();
  const sectionDescription =
    copy?.description ??
    "Together with you, we align internal teams and external stakeholders to make ESG strategies work.";

  return (
    <section
      id="services-section"
      className="relative overflow-hidden bg-[var(--bg_brand)] px-6 py-24 text-white md:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <header className="mx-auto w-full md:w-5/6 my-32 text-center">
          <Header title={sectionTitle} level="h2" variant="white" />
          <p className="text-[clamp(1.35rem,5vw,2.6rem)]  text-center font-bold leading-[1.02] tracking-[-0.02em]">
            {sectionDescription}
          </p>
        </header>

        <div className="relative mt-14">
          <div className="absolute inset-0 h-full w-full shrink-0 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#ffffff80_0%,#ffffff40_100%)] blur-[260px]" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] shrink-0 rounded-full  bg-[radial-gradient(circle,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.12)_35%,transparent_72%)] blur-[30px]" />
          <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] aspect-square shrink-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(62.49%_62.49%_at_50%_50%,#fff_33.17%,#fff0_100%)] blur-[20px]" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {normalizedServices.map((service, index) => {
              return (
                <NewServiceCard
                  key={service.id}
                  service={service}
                  isHovered={hoveredIndex === index && activeIndex === null}
                  isActive={activeIndex === index}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onOpen={() => setActiveIndex(index)}
                  onClose={() => setActiveIndex(null)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
