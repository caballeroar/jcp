import { useMemo } from "react";
import Header from "../ui/Header";
import ServicesInteractive from "./ServicesInteractive";

export default function ServicesSection({
  services = [],
  heading = "Services",
  leftHeader,
  rightHeader,
  leftDescription,
  rightDescription,
  defaultDescription,
}) {
  const midpoint = Math.ceil(services.length / 2) || 1;

  const columns = useMemo(
    () => [
      {
        id: "left",
        heading: leftHeader ?? "Empathy & Insights",
        description:
          leftDescription ??
          defaultDescription ??
          "We uncover what truly matters to the people at the heart of your challenge.",
        services: services.slice(0, midpoint),
      },
      {
        id: "right",
        heading: rightHeader ?? "Strategy & Design",
        description:
          rightDescription ??
          defaultDescription ??
          "We translate insights into aligned strategy, execution, and impact.",
        services: services.slice(midpoint),
      },
    ],
    [
      services,
      midpoint,
      leftHeader,
      rightHeader,
      leftDescription,
      rightDescription,
      defaultDescription,
    ],
  );

  return (
    <section id="services-section" className="space-y-10">
      <Header title={heading} />
      <ServicesInteractive columns={columns} />
    </section>
  );
}
