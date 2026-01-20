"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { useI18n } from "../lib/I18nContext";

export default function Services({ items }) {
  const { dict } = useI18n();

  // Prefer dictionary items under pages.services, then prop, then default
  const dictItems = dict?.pages?.services?.items;
  const services =
    Array.isArray(dictItems) && dictItems.length
      ? dictItems
      : Array.isArray(items) && items.length
        ? items
        : DEFAULT_SERVICES;

  const mid = Math.ceil(services.length / 2);
  const leftServices = services.slice(0, mid);
  const rightServices = services.slice(mid);

  const [activeCol, setActiveCol] = useState(null);
  const [expandedMap, setExpandedMap] = useState(() => ({
    left: new Set(),
    right: new Set(),
  }));
  const [viewportWidth, setViewportWidth] = useState(0);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const isXL = viewportWidth >= 1280;
  const imgScaleClass = (side) =>
    isXL && activeCol && activeCol !== side ? "scale-[0.8]" : "scale-100";

  const columns = useMemo(
    () => [
      {
        id: "left",
        heading: dict?.pages?.services?.leftHeader || "Empathy & Insights",
        description:
          dict?.pages?.services?.description ||
          "We uncover what truly matters to the people at the heart of your challenge.",
        services: leftServices,
      },
      {
        id: "right",
        heading: dict?.pages?.services?.rightHeader || "Strategy & Design",
        description:
          dict?.pages?.services?.description ||
          "We uncover what truly matters to the people at the heart of your challenge.",
        services: rightServices,
      },
    ],
    [dict, leftServices, rightServices],
  );

  const toggleCard = useCallback(
    (columnId, index) => {
      setExpandedMap((prev) => {
        const next = {
          left: new Set(prev.left),
          right: new Set(prev.right),
        };
        const bucket = next[columnId];
        if (bucket.has(index)) bucket.delete(index);
        else bucket.add(index);
        return next;
      });
    },
    [setExpandedMap],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setViewportWidth(window.innerWidth);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setHasAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const basis = (col) => {
    if (!isXL || !activeCol) return "50%";
    return activeCol === col ? "65%" : "35%";
  };

  const handlePoint = (clientX, target) => {
    // Only use hover-based column resizing on xl and up
    if (!isXL || !target) return;
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const center = rect.width * 0.5;
    const threshold = Math.max(10, rect.width * 0.02);
    let newCol = null;
    if (x < center - threshold) newCol = "left";
    else if (x > center + threshold) newCol = "right";
    setActiveCol(() => {
      // Clear the collapsed column's active cards
      if (newCol === "left")
        setExpandedMap((prev) => ({ ...prev, right: new Set() }));
      else if (newCol === "right")
        setExpandedMap((prev) => ({ ...prev, left: new Set() }));
      return newCol;
    });
  };

  return (
    <section id="services-section" ref={sectionRef}>
      <div className="mb-10 flex justify-center">
        <h2 className="text font-monument-extended text-stroke-brand text-8xl md:text-9xl tracking-tight">
          {dict?.pages?.services?.title || "SERVICES"}
        </h2>
      </div>

      <div
        id="services-brand-area"
        className={`flex flex-col xl:flex-row w-full px-2 xl:px-6 pt-28 pb-12 gap-4 bg-[var(--bg_brand)] cursor-pointer relative overflow-hidden ${
          hasAnimated ? "animate-bg" : "container-pre"
        }`}
        style={{ animationDelay: "800ms" }}
        onMouseLeave={() => setActiveCol(null)}
        onMouseMove={(e) => handlePoint(e.clientX, e.currentTarget)}
        onTouchStart={(e) => {
          if (e.touches && e.touches[0])
            handlePoint(e.touches[0].clientX, e.currentTarget);
        }}
        onTouchMove={(e) => {
          if (e.touches && e.touches[0])
            handlePoint(e.touches[0].clientX, e.currentTarget);
        }}
      >
        {columns.map((column) => (
          <ServiceColumn
            key={column.id}
            column={column}
            flexBasis={basis(column.id)}
            hasAnimated={hasAnimated}
            isXL={isXL}
            activeCol={activeCol}
            expandedSet={expandedMap[column.id]}
            onToggleCard={(index) => toggleCard(column.id, index)}
            imgScaleClass={imgScaleClass(column.id)}
          />
        ))}
      </div>

      <style jsx>{`
        .anim-init {
          opacity: 0;
          transform: translateY(10px);
        }
        .stagger-in {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 600ms ease-out forwards;
          will-change: transform, opacity;
        }

        /* Container pre-state to avoid flashing before grow-down */
        .container-pre {
          opacity: 0;
          transform: scaleY(0.85);
          transform-origin: top center;
        }

        /* Container grow-down animation */
        #services-brand-area.animate-bg {
          animation: bgGrowDown 1s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-origin: top center;
          will-change: transform, opacity;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bgGrowDown {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </section>
  );
}

function ServiceColumn({
  column,
  flexBasis,
  hasAnimated,
  isXL,
  activeCol,
  expandedSet,
  onToggleCard,
  imgScaleClass,
}) {
  return (
    <div
      className="flex px-4 flex-col min-w-0 transition-all duration-700 ease-out gap-4"
      style={{ flexBasis }}
    >
      <article
        className={`mb-3 rounded-xl border-[2px] border-white text-white bg-[var(--bg_brand)] px-5 pt-20 pb-5 flex flex-col items-center gap-12 ${
          hasAnimated ? "stagger-in" : "anim-init"
        }`}
        style={{ animationDelay: "1400ms" }}
      >
        <div className="flex flex-col items-center gap-4 h-[140px]">
          <h3 className="text-3xl md:text-5xl font-medium text-center tracking-tighter">
            {column.heading}
          </h3>
          <p className="text-sm md:text-lg text-center ">
            {column.description}
          </p>
        </div>
        <div className="grid grid-cols-full lg:grid-cols-2 gap-4 auto-rows-fr w-full">
          {column.services.map((service, index) => {
            const isExpanded = expandedSet.has(index);
            return (
              <article
                key={`${service.title}-${index}`}
                className={`rounded-xl border-[2px] border-white bg-[var(--bg_brand)] gap-4 pt-10 pb-4 px-1 flex flex-col items-center overflow-hidden transition-all duration-300 ease-out hover:bg-white/8 hover:z-50 hover:scale-[1.02] ${
                  hasAnimated ? "stagger-in" : "anim-init"
                }`}
                style={{ animationDelay: `${1000 + index * 120}ms` }}
                onClick={() => onToggleCard(index)}
              >
                {!isExpanded ? (
                  <CollapsedCard
                    service={service}
                    imgScaleClass={imgScaleClass}
                  />
                ) : (
                  <ExpandedCard service={service} />
                )}
              </article>
            );
          })}
        </div>
      </article>
    </div>
  );
}

function CollapsedCard({ service, imgScaleClass }) {
  return (
    <div className="flex flex-col pt-20 gap-16 justify-between items-center h-[440px]">
      {service.svg && (
        <Image
          src={service.svg}
          alt={service.title}
          width={160}
          height={160}
          className={`object-contain max-h-40 brightness-0 invert transition-transform duration-300 ease-out ${imgScaleClass}`}
        />
      )}
      <h3 className="mt-4 text-sm md:text-base text-white font-medium text-center font-roboto-mono uppercase">
        {service.title}
      </h3>
    </div>
  );
}

function ExpandedCard({ service }) {
  return (
    <div className="flex flex-col pt-20 gap-16 justify-between h-[440px]">
      <p className="text-2xl px-10 text-white text-center">
        {service.description}
      </p>
      <h3 className="text-base md:text-md text-white font-medium text-center font-roboto-mono uppercase ">
        {service.title}
      </h3>
    </div>
  );
}

const DEFAULT_SERVICES = [
  {
    svg: "/assets/stakeholder_mapping.svg",
    title: "Stakeholder Mapping",
    description: "Facilitate workshops to uncover goals, align stakeholders.",
  },
  {
    svg: "/assets/participatory_research.svg",
    title: "Participatory Research",
    description:
      "Translate insights into a practical plan with milestones, owners, and measurable outcomes.",
  },
  {
    svg: "/assets/persona_design.svg",
    title: "Persona Journey Design",
    description:
      "Equip teams with tools and coaching to drive change and deliver results consistently.",
  },
  {
    svg: "/assets/empathy_workshop.svg",
    title: "Empathy Workshops",
    description:
      "Set up feedback loops and reporting to learn, adapt, and improve over time.",
  },
  {
    svg: "/assets/problem_analysis.svg",
    title: "Problem / Opportunity Analysis",
    description:
      "Create clear narratives and materials to build trust and drive adoption across the org.",
  },
  {
    svg: "/assets/cocreation_ideation.svg",
    title: "Co-creation & Ideation",
    description:
      "Embed sustainability practices into operations with realistic targets and governance.",
  },
  {
    svg: "/assets/strategy_design.svg",
    title: "Strategy Design",
    description:
      "Create clear narratives and materials to build trust and drive adoption across the org.",
  },
  {
    svg: "/assets/living_labs.svg",
    title: "Living Labs & Pilot Projects",
    description:
      "Embed sustainability practices into operations with realistic targets and governance.",
  },
];
