"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Jane Doe",
    title: "Head of Sustainability",
    company: "Acme Corp",
    logoSrc: "/assets/globe.svg",
    quote:
      "JCP helped us turn ambitious sustainability goals into measurable outcomes with strong stakeholder buy-in.",
  },
  {
    name: "Mark Visser",
    title: "Program Manager, ESG",
    company: "Northline",
    logoSrc: "/assets/logo_full.svg",
    quote:
      "Their methodology made complex change feel simple and collaborative. We saw momentum from week one.",
  },
  {
    name: "Sofia Alvarez",
    title: "Director of Operations",
    company: "GreenWave",
    logoSrc: "/assets/globe.svg",
    quote:
      "Clear facilitation, practical tools, and a genuine partnership. JCP elevated our teams and our results.",
  },
  {
    name: "Liam Janssen",
    title: "Chief People Officer",
    company: "Helios",
    logoSrc: "/assets/globe.svg",
    quote:
      "The focus on understanding, trust, and collaboration matched our culture and delivered lasting improvements.",
  },
];

export default function Testimonials({ items }) {
  const testimonials = items && items.length ? items : DEFAULT_TESTIMONIALS;
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const initialOrder = useMemo(
    () => Array.from({ length: testimonials.length }, (_, i) => i),
    [testimonials.length]
  );
  const [order, setOrder] = useState(initialOrder);
  const [inView, setInView] = useState(false);
  const ASSET_LOGOS = [
    { src: "/assets/globe.svg", alt: "Globe" },
    { src: "/assets/logo_full.svg", alt: "Full Logo" },
    { src: "/assets/globe.svg", alt: "Globe" },
    { src: "/assets/logo_icon.svg", alt: "Symbol Icon" },
  ];
  const ROW_COUNT = 4;
  const repeatLogos = (times = 3) =>
    Array.from(
      { length: ASSET_LOGOS.length * times },
      (_, i) => ASSET_LOGOS[i % ASSET_LOGOS.length]
    );

  // Reset order when testimonials length changes
  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  // IntersectionObserver to detect when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Circular carousel using React state: rotate `order` at boundaries
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const getGap = () =>
      parseFloat(
        getComputedStyle(track).gap || getComputedStyle(track).columnGap || "0"
      );

    let isRotating = false;
    const rotateLeft = () => {
      const last = track.lastElementChild;
      if (!last) return;
      const width = last.getBoundingClientRect().width;
      const gap = getGap();
      isRotating = true;
      const prevSnap = container.style.scrollSnapType;
      const prevBehavior = container.style.scrollBehavior;
      container.style.scrollSnapType = "none";
      container.style.scrollBehavior = "auto";
      flushSync(() => {
        setOrder((prev) => {
          const next = prev.slice();
          next.unshift(next.pop());
          return next;
        });
      });
      container.scrollLeft += width + gap;
      setTimeout(() => {
        container.style.scrollSnapType = prevSnap || "x proximity";
        container.style.scrollBehavior = prevBehavior || "auto";
        isRotating = false;
      }, 100);
    };

    const rotateRight = () => {
      const first = track.firstElementChild;
      if (!first) return;
      const width = first.getBoundingClientRect().width;
      const gap = getGap();
      isRotating = true;
      const prevSnap = container.style.scrollSnapType;
      const prevBehavior = container.style.scrollBehavior;
      container.style.scrollSnapType = "none";
      container.style.scrollBehavior = "auto";
      flushSync(() => {
        setOrder((prev) => {
          const next = prev.slice();
          next.push(next.shift());
          return next;
        });
      });
      container.scrollLeft -= width + gap;
      setTimeout(() => {
        container.style.scrollSnapType = prevSnap || "x proximity";
        container.style.scrollBehavior = prevBehavior || "auto";
        isRotating = false;
      }, 100);
    };

    const onScroll = () => {
      if (isRotating) return;
      const left = container.scrollLeft;
      const maxLeft = container.scrollWidth - container.clientWidth;
      const threshold = 2; // px
      if (left <= threshold) rotateLeft();
      else if (left >= maxLeft - threshold) rotateRight();
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [order, testimonials.length]);

  return (
    <section
      ref={sectionRef}
      className=" w-5/6 md:w-4/6 max-w-4xl mx-auto mb-80 flex items-center justify-center bg-[var(--bg_box_neutral)]/60 text-[var(--content_dark)]"
      style={{
        transform: inView ? "scale(1)" : "scale(0.9)",
        opacity: inView ? 1 : 0,
        transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
      }}
    >
      <div className="py-32 overflow-hidden">
        <div
          className="w-full px-8 md:px-20 text-start  sm:w-5/6 lg:w-4/6"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
          }}
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl tracking-tight mb-8">
            We have helped organisations and business decipher difficult
            questions.
          </h3>
        </div>
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s",
          }}
        >
          <div className="relative  h-96 w-full mx-auto my-20 overflow-hidden">
            <div
              className="absolute inset-0 flex flex-col gap-6 skew-wrap w-[120%] "
              style={{ left: "-20%", top: "12%" }}
            >
              {Array.from({ length: ROW_COUNT }).map((_, rowIdx) => {
                const dir = rowIdx % 2 === 0 ? "left" : "right";
                const logos = repeatLogos(3);
                return (
                  <div
                    key={`row-${rowIdx}`}
                    className="relative w-full overflow-hidden"
                  >
                    <div
                      className={`inline-flex items-center gap-8 marquee-${dir} skew-content`}
                    >
                      {logos.map((logo, i) => (
                        <Image
                          key={`${logo.src}-${rowIdx}-${i}`}
                          src={logo.src}
                          alt={logo.alt}
                          width={160}
                          height={48}
                          className="h-12 w-auto object-contain"
                        />
                      ))}
                      {logos.map((logo, i) => (
                        <Image
                          key={`${logo.src}-${rowIdx}-dup-${i}`}
                          src={logo.src}
                          alt={logo.alt}
                          width={160}
                          height={48}
                          className="h-12 w-auto object-contain"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="relative mt-12 bg-[var(--bg_box_accent)]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.6s ease-out 0.6s, transform 0.6s ease-out 0.6s",
          }}
        >
          <div
            ref={containerRef}
            className="overflow-x-auto no-scrollbar snap-x snap-proximity px-6"
            style={{ overscrollBehavior: "contain" }}
          >
            <div ref={trackRef} className="flex gap-2 py-20">
              {order.map((idx) => {
                const t = testimonials[idx];
                return (
                  <article
                    key={`testimonial-${idx}`}
                    className="snap-center w-5/6 md:w-4/6 shrink-0 p-3 md:p-6 flex flex-col items-start gap-12 border-r-1 border-[var(--content_dark)]"
                  >
                    <div className="flex items-start  w-full flex-col">
                      <div className="min-w-0 flex gap-1 flex-col">
                        <p className="text-sm text-left md:text-base font-semibold">
                          {t.name}
                        </p>
                        <p className="text-sm text-foreground/70">
                          {t.title} · {t.company}
                        </p>
                        <div className="shrink-0 flex items-center">
                          <Image
                            src={t.logoSrc}
                            alt={`${t.company} logo`}
                            height={28}
                            width={160}
                            className="h-7 w-auto object-contain"
                            sizes="24px"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-base md:text-lg leading-relaxed mt-2 text-left">
                      “{t.quote}”
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
