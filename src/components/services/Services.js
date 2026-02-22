"use client";

import ServicesSection from "./ServicesSection";

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
};

const normalizeGroupServices = (group, fallbackId) => {
  const rawItems =
    group?.subservices ??
    group?.subServices ??
    group?.services ??
    group?.items ??
    [];

  return toArray(rawItems)
    .map((item, index) => {
      const title = item?.title ?? item?.name;
      if (!title) return null;

      return {
        id: item?.id ?? `${fallbackId}-service-${index}`,
        title,
        description: item?.description ?? item?.sentence ?? "",
        svg: item?.svg ?? item?.img ?? null,
      };
    })
    .filter(Boolean);
};

export default function Services({ services = [], copy = {} }) {
  const groups = [
    copy?.service1 ?? copy?.column1 ?? null,
    copy?.service2 ?? copy?.column2 ?? null,
  ].filter(Boolean);

  const leftHeader =
    copy.leftHeader ?? groups[0]?.title ?? copy.heading ?? "Services";
  const rightHeader =
    copy.rightHeader ?? groups[1]?.title ?? copy.heading ?? "Services";

  const leftDescription =
    copy.leftDescription ??
    groups[0]?.sentence ??
    groups[0]?.description ??
    copy.description;
  const rightDescription =
    copy.rightDescription ??
    groups[1]?.sentence ??
    groups[1]?.description ??
    copy.description;

  const normalizedColumns = groups
    .map((group, index) => {
      const isLeft = index === 0;
      const columnId = group?.id ?? (isLeft ? "left" : "right");

      return {
        id: columnId,
        heading: isLeft ? leftHeader : rightHeader,
        description: isLeft ? leftDescription : rightDescription,
        services: normalizeGroupServices(group, columnId),
      };
    })
    .filter((column) => column.services.length);

  const fallbackServices = normalizedColumns.flatMap(
    (column) => column.services,
  );
  const resolvedServices = services.length ? services : fallbackServices;
  const columnsForSection = normalizedColumns.length
    ? normalizedColumns
    : undefined;

  return (
    <ServicesSection
      services={resolvedServices}
      columns={columnsForSection}
      heading={copy.heading ?? "Services"}
      leftHeader={leftHeader}
      rightHeader={rightHeader}
      leftDescription={leftDescription}
      rightDescription={rightDescription}
      defaultDescription={copy.description}
    />
  );
}
