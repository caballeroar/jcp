"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function InteractiveServices({ services = [] }) {
  const normalized = useMemo(() => {
    // Normalize data sources that may arrive as arrays or keyed objects.
    const ensureArray = (value) => {
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object") return Object.values(value);
      return [];
    };

    if (!Array.isArray(services)) return [];

    return services
      .map((service, index) => {
        const name = service?.name ?? service?.title;
        if (!name) return null;

        const serviceId = service?.id ?? service?.slug ?? `${name}-${index}`;
        const rawFocusAreas =
          service?.subService ??
          service?.subservice ??
          service?.subServices ??
          service?.subservices ??
          service?.["sub-services"];

        const focusAreas = ensureArray(rawFocusAreas)
          .map((focus, focusIndex) => {
            const focusTitle = focus?.title ?? focus?.name;
            if (!focusTitle) return null;

            const focusId = focus?.id ?? `${serviceId}-focus-${focusIndex}`;
            const nested = ensureArray(
              focus?.subService ??
                focus?.subservice ??
                focus?.subServices ??
                focus?.subservices ??
                focus?.["sub-services"],
            )
              .map((item, itemIndex) => {
                const nestedTitle = item?.title ?? item?.name;
                if (!nestedTitle) return null;
                return {
                  id: item?.id ?? `${focusId}-detail-${itemIndex}`,
                  title: nestedTitle,
                  description: item?.description ?? "",
                };
              })
              .filter(Boolean);

            return {
              id: focusId,
              title: focusTitle,
              description: focus?.description ?? "",
              methodology: focus?.methodology ?? focus?.method ?? "",
              methodDescription:
                focus?.methodDescription ?? focus?.methodSummary ?? "",
              icon: focus?.svg ?? focus?.icon ?? "",
              nestedSubServices: nested,
            };
          })
          .filter(Boolean);

        return {
          id: serviceId,
          name,
          summary:
            service?.description ?? service?.sentence ?? service?.summary ?? "",
          details: service?.details ?? service?.meta ?? "",
          focusAreas,
        };
      })
      .filter(Boolean);
  }, [services]);

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeFocusByService, setActiveFocusByService] = useState({});
  const activeService = normalized[activeServiceIndex] ?? normalized[0];
  const activeFocusIndex = activeService
    ? (activeFocusByService[activeService.id] ?? 0)
    : 0;
  const activeFocus =
    activeService?.focusAreas?.[activeFocusIndex] ??
    activeService?.focusAreas?.[0];

  const MAX_NESTED_ITEMS = 6;
  const focusDetails = activeFocus?.nestedSubServices
    ? activeFocus.nestedSubServices.slice(0, MAX_NESTED_ITEMS)
    : [];
  const forceTwoRows = focusDetails.length > 0 && focusDetails.length >= 4;

  const handleServiceChange = (nextIndex, serviceId) => {
    setActiveServiceIndex(nextIndex);
    setActiveFocusByService((prev) => {
      if (prev[serviceId] !== undefined) return prev;
      return { ...prev, [serviceId]: 0 };
    });
  };

  const handleFocusChange = (serviceId, nextFocusIndex) => {
    setActiveFocusByService((prev) => ({
      ...prev,
      [serviceId]: nextFocusIndex,
    }));
  };

  if (!normalized.length || !activeService) {
    return (
      <section className="mt-12 w-full max-w-5xl rounded-3xl bg-white/5 p-6 text-center text-white/70">
        No services available.
      </section>
    );
  }

  return (
    <section className="mt-12 w-full space-y-8 rounded-2xl border border-white/20 p-6 text-white">
      {/* <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60">
              Service tracks
            </p>
            <p className="text-sm text-white/70">
              Switch between the two core offerings to explore their focus
              areas.
            </p>
          </div>
          <p className="text-xs text-white/60">
            {normalized.length} services ·{" "}
            {activeService?.focusAreas?.length ?? 0} focus areas
          </p>
        </div>
      </div> */}

      <div className="grid gap-4 md:grid-cols-2">
        {normalized.map((service, index) => {
          const isActive = index === activeServiceIndex;
          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleServiceChange(index, service.id)}
              className={`rounded-2xl border px-12 py-5 text-left transition ${
                isActive
                  ? " border-1 border-white bg-white/10 "
                  : "border-white/50 hover:bg-white/10"
              }`}
            >
              <span className="text-[0.6rem] font-roboto-mono uppercase tracking-[2px] text-white/80">
                Track {index + 1}
              </span>
              <p className="mt-2 text-base font-semibold">{service.name}</p>
              {/* {service.summary && (
                <p className="mt-3 text-sm text-white/70 line-clamp-3">
                  {service.summary}
                </p>
              )} */}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl p-6 ">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div>
            {/* <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Service focus
            </p> */}
            <h2 className="mt-2 text-3xl font-semibold lg:text-3xl">
              {activeService.name}
            </h2>
            {activeService.summary && (
              <p className="mt-3 text-lg text-white/80">
                {activeService.summary}
              </p>
            )}
          </div>
          {/* {activeService.details && (
            <p className="text-sm text-white lg:max-w-sm">
              {activeService.details}
            </p>
          )} */}
        </div>

        {activeService.focusAreas?.length ? (
          <>
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {activeService.focusAreas.map((focus, index) => {
                const isActive = index === activeFocusIndex;
                return (
                  <button
                    key={focus.id}
                    type="button"
                    onClick={() => handleFocusChange(activeService.id, index)}
                    aria-pressed={isActive}
                    className={`w-full flex gap-4 rounded-xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-white bg-white/10"
                        : "border-white/50 hover:bg-white/10"
                    }`}
                  >
                    {/* <Image
                      src={focus.icon}
                      alt=""
                      width={32}
                      height={32}
                      aria-hidden="true"
                      className="object-contain brightness-0 invert"
                    /> */}
                    <div>
                      <span className="text-[0.6rem] font-roboto-mono uppercase tracking-[2px] text-white/80">
                        {focus.methodology || "Focus"}
                      </span>
                      <p className="mt-2 text-base font-semibold">
                        {focus.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-white p-8">
              <div className="flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.4em] text-white/60">
                {/* <span>Methodology</span> */}
                {/* {activeFocus?.methodology ? (
                  <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-roboto-mono tracking-[2px] text-white">
                    {activeFocus.methodology}
                  </span>
                ) : null} */}
              </div>

              <div className="mt-4 flex w-[50%] flex-col gap-4 lg:flex-row">
                {activeFocus?.icon ? (
                  // <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Image
                    src={activeFocus.icon}
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="h-28 w-28 object-contain brightness-0 invert"
                  />
                ) : // </div>
                null}
                <div>
                  <h3 className="text-2xl font-semibold">
                    {activeFocus?.title ?? "Focus area"}
                  </h3>
                  {activeFocus?.description && (
                    <p className="mt-2 text-lg text-white/80">
                      {activeFocus.description}
                    </p>
                  )}
                  {/* {activeFocus?.methodDescription && (
                    <p className="mt-3 text-sm text-white/70">
                      {activeFocus.methodDescription}
                    </p>
                  )} */}
                </div>
              </div>

              {focusDetails.length ? (
                <div
                  className={`mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                    forceTwoRows ? "lg:grid-rows-2" : ""
                  }`}
                >
                  {focusDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex h-[320px] flex-col items-center gap-6 rounded-xl border border-white/50 bg-white/5 p-8 text-center"
                    >
                      <p className="text-md uppercase font-roboto-mono text-white">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-lg font-semibold leading-relaxed text-white">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-white/60">
                  More detail for this focus area is coming soon.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="mt-6 text-white/70">
            More detail for this service is coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
