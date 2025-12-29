"use client";
import { useState, useCallback } from "react";

export default function Services({ items = DEFAULT_SERVICES }) {
  const services =
    Array.isArray(items) && items.length ? items : DEFAULT_SERVICES;
  const mid = Math.ceil(services.length / 2);
  const leftServices = services.slice(0, mid);
  const rightServices = services.slice(mid);
  const [activeCol, setActiveCol] = useState(null); // 'left' | 'right' | null

  const basis = (col) => {
    if (!activeCol) return "50%";
    return activeCol === col ? "70%" : "30%"; // 7/10 vs 3/10
  };

  const handlePoint = useCallback((clientX, target) => {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const center = rect.width * 0.5;
    const threshold = Math.max(10, rect.width * 0.02);
    if (x < center - threshold) setActiveCol("left");
    else if (x > center + threshold) setActiveCol("right");
    else setActiveCol(null);
  }, []);

  return (
    <section>
      <div className="mb-10">
        <h2 className="text font-monument-extended text-stroke-brand text-5xl md:text-9xl ">
          SERVICES
        </h2>
      </div>

      <div
        className="flex w-full px-6 pt-28 pb-12 gap-6 bg-[var(--bg_brand)] cursor-pointer"
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
          className="flex px-4 flex-col min-w-0 transition-all duration-700 ease-out isolate h-[45vh] md:h-[80vh] overflow-y-auto overscroll-y-auto no-scrollbar [--stackBase:120px] md:[--stackBase:164px] [--stackGap:16px]"
          style={{ flexBasis: basis("left"), WebkitOverflowScrolling: "touch" }}
          onClick={() => setActiveCol("left")}
        >
          <article className="sticky mb-3 top-0 z-0 rounded-xl border-[2px] border-white text-white bg-[var(--bg_brand)] px-8 py-20 flex flex-col gap-5 ">
            <h3 className="text-base md:text-6xl font-regular tracking-tighter">
              Empathy & Insights
            </h3>
            <p className="text-sm md:text-lg text-white ">
              We uncover what truly matters to the people at the heart of your
              challenge.
            </p>
          </article>
          {leftServices.map((s, i) => (
            <article
              key={`${s.title}-${i}`}
              className={`sticky rounded-xl border-[2px] border-white bg-[var(--bg_brand)] px-20 py-40 mb-2 flex flex-col transition-all duration-300 ease-out hover:z-50 hover:scale-[1.02] ${
                i === leftServices.length - 1 ? "mb-12" : ""
              }`}
              style={{
                top: `calc(var(--stackBase) + ${i} * var(--stackGap))`,
                zIndex: 10 + i,
              }}
            >
              <h3 className="text-base md:text-3xl  text-white font-semibold">
                {s.title}
              </h3>
              <p className="text-sm md:text-base text-white leading-relaxed">
                {s.description}
              </p>
            </article>
          ))}
        </div>
        <div
          className="flex flex-col  px-4 min-w-0 transition-all duration-700 ease-out isolate h-[65vh] md:h-[80vh] overflow-y-auto overscroll-y-auto no-scrollbar [--stackBase:120px] md:[--stackBase:164px] [--stackGap:16px]"
          style={{
            flexBasis: basis("right"),
            WebkitOverflowScrolling: "touch",
          }}
          onClick={() => setActiveCol("right")}
        >
          <article className="sticky mb-3 top-0 z-0 rounded-xl border-[2px] border-white text-white bg-[var(--bg_brand)] px-8 py-20 flex flex-col gap-5 ">
            <h3 className="text-base md:text-6xl font-regular tracking-tighter">
              Empathy & Insights
            </h3>
            <p className="text-sm md:text-lg text-white ">
              We uncover what truly matters to the people at the heart of your
              challenge.
            </p>
          </article>
          {rightServices.map((s, i) => (
            <article
              key={`${s.title}-${i}`}
              className={`sticky rounded-xl border-[2px] border-white bg-[var(--bg_brand)] px-20 py-40 mb-2  flex flex-col transition-all duration-300 ease-out hover:z-50 hover:scale-[1.02] ${
                i === rightServices.length - 1 ? "mb-12" : ""
              }`}
              style={{
                top: `calc(var(--stackBase) + ${i} * var(--stackGap))`,
                zIndex: 10 + i,
              }}
            >
              <h3 className="text-base md:text-3xl  text-white font-semibold">
                {s.title}
              </h3>
              <p className="text-sm md:text-base text-white leading-relaxed">
                {s.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_SERVICES = [
  {
    title: "Discovery & Alignment",
    description:
      "Facilitate workshops to uncover goals, align stakeholders, and define success criteria.",
  },
  {
    title: "Strategy & Roadmapping",
    description:
      "Translate insights into a practical plan with milestones, owners, and measurable outcomes.",
  },
  {
    title: "Enablement & Delivery",
    description:
      "Equip teams with tools and coaching to drive change and deliver results consistently.",
  },
  {
    title: "Measurement & Iteration",
    description:
      "Set up feedback loops and reporting to learn, adapt, and improve over time.",
  },
  {
    title: "Communication & Adoption",
    description:
      "Create clear narratives and materials to build trust and drive adoption across the org.",
  },
  {
    title: "Sustainability Integration",
    description:
      "Embed sustainability practices into operations with realistic targets and governance.",
  },
];
