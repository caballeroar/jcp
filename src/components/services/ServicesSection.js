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
  columns: columnsOverride = [],
}) {
  const columns = useMemo(() => {
    if (columnsOverride.length) {
      return columnsOverride;
    }

    const midpoint = Math.ceil(services.length / 2);

    return [
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
    ];
  }, [
    columnsOverride,
    services,
    leftHeader,
    rightHeader,
    leftDescription,
    rightDescription,
    defaultDescription,
  ]);

  return (
    <section
      id="services-section"
      className="space-y-10 flex flex-col items-center"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Header title={heading} level="h2" />
      </div>
      <ServicesInteractive columns={columns} />
    </section>
  );
}
