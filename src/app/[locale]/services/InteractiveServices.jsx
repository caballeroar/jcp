"use client";

import { useMemo, useState } from "react";

export default function InteractiveServices({ services = [] }) {
  const normalized = useMemo(() => {
    if (!Array.isArray(services)) return [];
    return services
      .map((service, index) => {
        const name = service?.name ?? service?.title;
        if (!name) return null;
        const serviceId = service?.id ?? service?.slug ?? `${name}-${index}`;
        const rawSubServices =
          service?.subServices ??
          service?.subservices ??
          service?.["sub-services"] ??
          [];
        const subServicesArray = Array.isArray(rawSubServices)
          ? rawSubServices
          : Object.values(rawSubServices ?? {});

        return {
          id: serviceId,
          name,
          summary:
            service?.description ?? service?.sentence ?? service?.summary ?? "",
          details: service?.details ?? service?.meta ?? "",
          subServices: subServicesArray
            .map((sub, subIndex) => {
              const subTitle = sub?.title ?? sub?.name;
              if (!subTitle) return null;
              return {
                id: sub?.id ?? `${serviceId}-sub-${subIndex}`,
                title: subTitle,
                description: sub?.description ?? "",
              };
            })
            .filter(Boolean),
        };
      })
      .filter(Boolean);
  }, [services]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = normalized[activeIndex] ?? normalized[0];

  if (!normalized.length || !activeService) {
    return (
      <section className="mt-12 w-full max-w-5xl rounded-3xl bg-white/5 p-6 text-center text-white/70">
        No services available.
      </section>
    );
  }

  return (
    <section className="mt-12 w-full max-w-5xl rounded-3xl bg-white/5 p-6 text-white shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
      <div className="rounded-2xl bg-white/10 p-6 border border-white/20">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Service focus
        </p>
        <h2 className="mt-2 text-3xl font-semibold">{activeService.name}</h2>
        {activeService.summary && (
          <p className="mt-3 text-lg text-white/80">{activeService.summary}</p>
        )}
        {activeService.details && (
          <p className="mt-2 text-base text-white/70">
            {activeService.details}
          </p>
        )}
        {activeService.subServices?.length ? (
          <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Sub-services
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {activeService.subServices.map((subService) => (
                <div
                  key={subService.id}
                  className="rounded-lg border border-white/15 bg-white/5 p-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {subService.title}
                  </p>
                  {subService.description && (
                    <p className="mt-1 text-sm text-white/70">
                      {subService.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {normalized.map((service, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
              className={`rounded-2xl border px-5 py-4 text-left transition ${
                isActive
                  ? "border-white bg-white/20 shadow-lg"
                  : "border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10"
              }`}
            >
              <p className="text-lg font-semibold">{service.name}</p>
              {service.summary && (
                <p className="mt-2 text-sm text-white/70 line-clamp-3">
                  {service.summary}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
