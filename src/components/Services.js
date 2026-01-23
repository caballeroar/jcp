"use client";
import { useMemo } from "react";
import ServicesSection from "./services/ServicesSection";
import { useI18n } from "../lib/I18nContext";
import { resolveServices } from "../utils/service";

export default function Services({ items }) {
  const { dict } = useI18n();
  const servicesCopy = dict?.pages?.services ?? {};
  const services = useMemo(() => resolveServices(dict, items), [dict, items]);

  return (
    <ServicesSection
      services={services}
      heading={servicesCopy.heading ?? "Services"}
      leftHeader={servicesCopy.leftHeader}
      rightHeader={servicesCopy.rightHeader}
      leftDescription={servicesCopy.leftDescription ?? servicesCopy.description}
      rightDescription={
        servicesCopy.rightDescription ?? servicesCopy.description
      }
      defaultDescription={servicesCopy.description}
    />
  );
}
