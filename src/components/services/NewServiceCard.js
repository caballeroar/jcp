import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "phosphor-react";

const CARD_HEIGHT = "h-[560px] md:h-[620px]";

export default function NewServiceCard({
  service,
  isHovered,
  isActive,
  onHoverStart,
  onHoverEnd,
  onOpen,
  onClose,
}) {
  const subServices = Array.isArray(service?.subServices)
    ? service.subServices
    : [];
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const safeSubIndex =
    subServices.length > 0 ? activeSubIndex % subServices.length : 0;
  const activeSubService =
    subServices.length > 0 ? subServices[safeSubIndex] : null;

  if (isActive) {
    return (
      <article
        className={`relative ${CARD_HEIGHT} overflow-hidden rounded-[34px] border border-[var(--content_brand)]/90 bg-white px-8 py-8 text-[var(--content_brand)] shadow-[0_8px_20px_rgba(255,255,255,0.25)]`}
      >
        <div className="flex items-center justify-between text-sm font-roboto-mono">
          <span>{service.methodology}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-[#404040] transition-colors hover:bg-black/5"
            aria-label="Close service details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 space-y-5">
          <h3 className="max-w-[16ch] text-[clamp(34px,2.8vw,48px)] font-semibold leading-[0.95] tracking-tight">
            {activeSubService?.title ?? service.title}
          </h3>
          <p className="max-w-[30ch] text-[clamp(18px,1.4vw,30px)] leading-[1.2]">
            {activeSubService?.description ?? service.description}
          </p>
        </div>

        <div className="absolute inset-x-8 bottom-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (!subServices.length) return;
              setActiveSubIndex(
                (prev) => (prev - 1 + subServices.length) % subServices.length,
              );
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--content_brand)] text-[var(--content_brand)] transition-colors hover:bg-[var(--content_brand)]/10"
            aria-label="Show previous service"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!subServices.length) return;
              setActiveSubIndex((prev) => (prev + 1) % subServices.length);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--content_brand)] text-[var(--content_brand)] transition-colors hover:bg-[var(--content_brand)]/10"
            aria-label="Show next service"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </article>
    );
  }

  if (isHovered) {
    return (
      <article
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onClick={onOpen}
        className={`group relative ${CARD_HEIGHT} flex cursor-pointer flex-col rounded-[34px] border border-white/80 bg-[var(--bg_brand)] px-6 py-8 text-white transition-transform duration-300 hover:-translate-y-0.5`}
      >
        {/* <div className="absolute bottom-[-260px] left-1/2 h-[420px] w-[150%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(223,77,32,0.85),rgba(223,77,32,0.5)_38%,rgba(223,77,32,0.16)_58%,transparent_74%)]" /> */}

        <div className="flex items-center justify-between text-lg font-roboto-mono mx-4">
          <p>{service.methodology}</p>
          {/* <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/90">
          <ArrowUpRight size={17} weight="bold" />
        </span> */}
        </div>

        <div className="mt-8 mx-12">
          <div className="mt-16 space-y-7">
            <h3 className="max-w-[16ch] text-5xl font-bold tracking-tight">
              {service.title}
            </h3>
          </div>

          <div className="flex flex-col items-start gap-3 pt-20">
            {service.subServices.map((sub) => (
              <div
                key={sub.id}
                className="inline-flex w-fit max-w-full rounded-full border border-white px-6 py-3 text-start font-roboto-mono text-[clamp(17px,1.4vw,28px)] leading-tight transition-all duration-200 hover:bg-white hover:text-[var(--bg_brand)] hover:shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
              >
                {sub.title}
              </div>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onOpen}
      className={`group relative ${CARD_HEIGHT} flex cursor-pointer flex-col rounded-[34px] border border-white/80 bg-[var(--bg_brand)] px-6 py-8 text-white transition-transform duration-300 hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between text-lg font-roboto-mono mx-4">
        <p>{service.methodology}</p>
        {/* <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/90">
          <ArrowUpRight size={17} weight="bold" />
        </span> */}
      </div>

      <div className="mt-8 flex flex-1 flex-col justify-between mx-12">
        <div className="mt-16 space-y-7">
          <h3 className="max-w-[16ch] text-5xl font-bold tracking-tight">
            {service.title}
          </h3>
          <p className="max-w-[30ch] text-3xl text-white leading-[1.14]">
            {service.description}
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="max-w-[16ch] text-xl font-roboto-mono font-semibold  tracking-tight">
            Outcome
          </h3>
          <p className="max-w-[30ch] text-lg font-roboto-mono text-white leading-[1.14] mb-6">
            {service.outcome}
          </p>
        </div>
      </div>
    </article>
  );
}
