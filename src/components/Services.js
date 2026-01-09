"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Services({ items = DEFAULT_SERVICES }) {
  const services =
    Array.isArray(items) && items.length ? items : DEFAULT_SERVICES;
  const mid = Math.ceil(services.length / 2);
  const leftServices = services.slice(0, mid);
  const rightServices = services.slice(mid);
  const [activeCol, setActiveCol] = useState(null); // 'left' | 'right' | null
  const [activeLeftIndex, setActiveLeftIndex] = useState(null);
  const [activeRightIndex, setActiveRightIndex] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const isXL = viewportWidth >= 1280; // Tailwind xl breakpoint

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
      { threshold: 0.25 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const basis = (col) => {
    // Only resize columns on large screens; keep equal on smaller
    if (!isXL || !activeCol) return "50%";
    return activeCol === col ? "70%" : "30%"; // 7/10 vs 3/10
  };

  const handlePoint = (clientX, target) => {
    // Only use hover-based column resizing on xl and up
    if (!isXL || !target) return;
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const center = rect.width * 0.5;
    const threshold = Math.max(10, rect.width * 0.02);
    if (x < center - threshold) setActiveCol("left");
    else if (x > center + threshold) setActiveCol("right");
    else setActiveCol(null);
  };

  return (
    <section id="services-section" ref={sectionRef}>
      <div className="mb-10 flex justify-center">
        <h2
          className={`text font-monument-extended text-stroke-brand text-8xl md:text-9xl tracking-tight ${
            hasAnimated ? "stagger-in" : "anim-init"
          }`}
          style={{ animationDelay: "0ms" }}
        >
          SERVICES
        </h2>
      </div>

      <div
        id="services-brand-area"
        className={`flex flex-col xl:flex-row w-full px-2 xl:px-6 pt-28 pb-12 gap-4 bg-[var(--bg_brand)] cursor-pointer relative overflow-hidden ${
          hasAnimated ? "animate-bg" : "container-pre"
        }`}
        style={{ animationDelay: "1s" }}
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
        <div
          className="flex px-4 flex-col min-w-0 transition-all duration-700 ease-out gap-4"
          style={{ flexBasis: basis("left") }}
        >
          <article
            className={`mb-3 rounded-xl border-[2px] border-white text-white bg-[var(--bg_brand)] px-5 pt-20 pb-5 flex flex-col items-center gap-12 ${
              hasAnimated ? "stagger-in" : "anim-init"
            }`}
            style={{ animationDelay: "1400ms" }}
          >
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-3xl md:text-5xl font-medium text-center tracking-tighter">
                Empathy & Insights
              </h3>
              <p className="text-sm md:text-lg text-center ">
                We uncover what truly matters to the people at the heart of your
                challenge.
              </p>
            </div>

            <div className="grid grid-cols-full lg:grid-cols-2 gap-4 auto-rows-fr w-full">
              {leftServices.map((s, i) => (
                <article
                  key={`${s.title}-${i}`}
                  className={`rounded-xl border-[2px] border-white bg-[var(--bg_brand)] gap-4 pt-10 pb-4 px-1 flex flex-col items-center h-full transition-all duration-300 ease-out hover:z-50 hover:bg-white/8 hover:scale-[1.02] ${
                    hasAnimated ? "stagger-in" : "anim-init"
                  }`}
                  style={{ animationDelay: `${1500 + i * 120}ms` }}
                  onClick={() => {
                    setActiveLeftIndex((prev) => (prev === i ? null : i));
                  }}
                >
                  {activeLeftIndex !== i && (
                    <div className="flex flex-col pt-20 pb-4 gap-20 justify-between items-center h-full">
                      {s.svg && (
                        <Image
                          src={s.svg}
                          alt={s.title}
                          width={160}
                          height={160}
                          className="object-contain max-h-40 brightness-0 invert"
                        />
                      )}
                      <h3 className="mt-4 text-sm md:text-base text-white font-medium text-center font-roboto-mono uppercase">
                        {s.title}
                      </h3>
                    </div>
                  )}
                  {activeLeftIndex === i && (
                    <div className="flex flex-col pt-20 pb-4 gap-20 justify-between h-full">
                      <p className="text-sm md:text-2xl px-20 text-white text-center">
                        {s.description}
                      </p>
                      <h3 className="text-base md:text-md text-white font-medium mb-2 text-center font-roboto-mono uppercase ">
                        {s.title}
                      </h3>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </article>
        </div>
        <div
          className="flex flex-col px-4 min-w-0 transition-all duration-700 ease-out gap-4"
          style={{ flexBasis: basis("right") }}
        >
          <article
            className={`mb-3 rounded-xl border-[2px] border-white text-white bg-[var(--bg_brand)] px-5 pt-20 pb-5 flex flex-col items-center gap-12 ${
              hasAnimated ? "stagger-in" : "anim-init"
            }`}
            style={{ animationDelay: "1400ms" }}
          >
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-3xl md:text-5xl font-medium text-center tracking-tighter">
                Strategy & Design
              </h3>
              <p className="text-sm md:text-lg text-center ">
                We uncover what truly matters to the people at the heart of your
                challenge.
              </p>
            </div>
            <div className="grid grid-cols-full lg:grid-cols-2 gap-4 auto-rows-fr w-full">
              {rightServices.map((s, i) => (
                <article
                  key={`${s.title}-${i}`}
                  className={`rounded-xl border-[2px] border-white bg-[var(--bg_brand)] gap-4 pt-10 pb-4 px-1 flex flex-col items-center h-full transition-all duration-300 ease-out hover:bg-white/8 hover:z-50 hover:scale-[1.02] ${
                    hasAnimated ? "stagger-in" : "anim-init"
                  }`}
                  style={{ animationDelay: `${1500 + i * 120}ms` }}
                  onClick={() => {
                    setActiveRightIndex((prev) => (prev === i ? null : i));
                  }}
                >
                  {activeRightIndex !== i && (
                    <div className="flex flex-col pt-20 pb-4 gap-20 justify-between items-center h-full">
                      {s.svg && (
                        <Image
                          src={s.svg}
                          alt={s.title}
                          width={160}
                          height={160}
                          className="object-contain max-h-40 brightness-0 invert"
                        />
                      )}
                      <h3 className="mt-4 text-sm md:text-base text-white font-medium text-center font-roboto-mono uppercase">
                        {s.title}
                      </h3>
                    </div>
                  )}
                  {activeRightIndex === i && (
                    <div className="flex flex-col pt-20 pb-4 gap-20 justify-between h-full">
                      <p className="text-sm md:text-2xl px-20 text-white text-center">
                        {s.description}
                      </p>
                      <h3 className="text-base md:text-md text-white font-medium mb-2 text-center font-roboto-mono uppercase ">
                        {s.title}
                      </h3>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </article>
        </div>
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
          animation: bgGrowDown 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
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
