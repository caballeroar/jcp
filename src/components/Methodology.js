"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "phosphor-react";

export default function Methodology({ locale }) {
  const [expanded, setExpanded] = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);
  const sectionCount = 4; // can be any integer
  const containerRef = useRef(null);
  const scrollAccumulator = useRef(0);
  const scrollLocked = useRef(false);

  const accent = "font-bold mb-2 text-[var(--content_brand)]";

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  // Scroll handler for section navigation
  useEffect(() => {
    if (!expanded) return;

    const SCROLL_THRESHOLD = 120; // px per section (one step)
    const LOCK_DURATION = 400; // ms lock after step

    const handleWheel = (e) => {
      e.preventDefault();

      if (scrollLocked.current) return;

      scrollAccumulator.current += e.deltaY;

      if (scrollAccumulator.current > SCROLL_THRESHOLD) {
        setSectionIdx((idx) => idx + 1);
        lockScroll();
      } else if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
        setSectionIdx((idx) => idx - 1);
        lockScroll();
      }
    };

    const lockScroll = () => {
      scrollLocked.current = true;
      scrollAccumulator.current = 0;

      setTimeout(() => {
        scrollLocked.current = false;
      }, LOCK_DURATION);
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (node) {
        node.removeEventListener("wheel", handleWheel);
      }
    };
  }, [expanded]);

  return (
    <section
      className={
        expanded
          ? "fixed inset-0 z-50 w-screen h-screen flex items-center justify-center px-0 py-0 overflow-hidden"
          : "w-full sm:w-5/6 md:w-4/6 m-auto flex items-center justify-center"
      }
      aria-modal={expanded ? "true" : undefined}
      role={expanded ? "dialog" : undefined}
    >
      <div
        className={
          expanded
            ? "relative w-full h-full flex justify-center items-center overflow-hidden transition-all duration-500 ease-in-out"
            : "relative flex justify-center items-center h-[60vh] my-48 overflow-hidden transition-all duration-500 ease-in-out"
        }
        style={{
          background: "var(--bg_gradient)",
          transformOrigin: "50% 50%",
          transform: expanded ? "scale(1)" : "scale(0.95)",
          transition: "transform 500ms ease-in-out",
        }}
      >
        {/* Collapsed state background SVG: spins in place */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <div
            className={`absolute transition-transform transition-opacity duration-700 ease-in-out ${
              expanded ? "opacity-0" : "opacity-100"
            }`}
            style={{
              width: "160%",
              height: "160%",
              left: "2%",
              bottom: "-30%",
              transform: expanded
                ? "translateY(100%) rotate(0deg)"
                : "translateY(0) rotate(360deg)",
            }}
          >
            <div className="w-full h-full animate-spin-slow">
              <Image
                src="/assets/symbol_icon.svg"
                alt="Brand Symbol Icon as background decoration"
                fill
                style={{ objectFit: "contain", opacity: 0.5 }}
                priority={false}
              />
            </div>
          </div>
        </div>

        {/* Expanded state background SVG: slides in from left while rotating per section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <div
            className={`absolute transition-transform transition-opacity duration-700 ease-in-out ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              width: "200%",
              height: "200%",
              right: "-18%",
              bottom: "-50%",
              transform: expanded
                ? `translate(0, 0) rotate(${sectionIdx * 90}deg)`
                : `translate(-120%, 0) rotate(${sectionIdx * 90 - 270}deg)`,
            }}
          >
            <Image
              src="/assets/symbol_icon.svg"
              alt="Brand Symbol Icon as background decoration"
              fill
              style={{ objectFit: "contain", opacity: 0.5 }}
              priority={false}
            />
          </div>
        </div>

        {expanded ? (
          <div
            ref={containerRef}
            className="relative w-full h-full py-8 md:py-24 z-20 flex flex-col items-start gap-8 overflow-hidden"
          >
            <div className="w-5/6 mx-auto">
              <Button
                theme="brand"
                icon={<ArrowLeft size={20} weight="bold" />}
                iconPosition="left"
                onClick={() => {
                  setExpanded(false);
                  setSectionIdx(0);
                }}
              >
                Back
              </Button>
              <h3 className="text-3xl font-medium mt-12 text-[var(--content_brand)] text-start">
                Methodology
              </h3>
              {(() => {
                const i =
                  ((sectionIdx % sectionCount) + sectionCount) % sectionCount;
                switch (i) {
                  case 0:
                    return (
                      <section className="flex md:justify-end mt-20 lg:pr-48">
                        <div className=" w-full md:w-4/6 lg:w-3/6 ">
                          <h2 className="text-6xl font-bold mb-2 text-[var(--content_brand)] mb-12">
                            Discovery.
                          </h2>
                          <p className="text-2xl leading-relaxed text-[var(--content_brand)] font-semibold">
                            We align on goals, constraints, and context. Dummy
                            text: lorem ipsum dolor sit amet, consectetur
                            adipiscing elit.
                          </p>
                        </div>
                      </section>
                    );
                  case 1:
                    return (
                      <section className="flex md:justify-end mt-20 lg:pr-48">
                        <div className=" w-full md:w-4/6 lg:w-3/6 ">
                          <h2 className="text-6xl font-bold mb-2 text-[var(--content_brand)] mb-12">
                            Listen.
                          </h2>
                          <p className="text-2xl leading-relaxed text-[var(--content_brand)] font-semibold">
                            We gather insights, map stakeholders, and surface
                            risks. Dummy text: sed do eiusmod tempor incididunt
                            ut labore.
                          </p>
                        </div>
                      </section>
                    );
                  case 2:
                    return (
                      <section className="flex md:justify-end mt-20 lg:pr-48">
                        <div className=" w-full md:w-4/6 lg:w-3/6 ">
                          <h2 className="text-6xl font-bold mb-2 text-[var(--content_brand)] mb-12">
                            Translate.
                          </h2>
                          <p className="text-2xl leading-relaxed text-[var(--content_brand)] font-semibold">
                            We prototype solutions and iterate with feedback.
                            Dummy text: ut enim ad minim veniam, quis nostrud
                            exercitation.
                          </p>
                        </div>
                      </section>
                    );
                  case 3:
                  default:
                    return (
                      <section className="flex md:justify-end mt-20 lg:pr-48">
                        <div className=" w-full md:w-4/6 lg:w-3/6 ">
                          <h2 className="text-6xl font-bold mb-2 text-[var(--content_brand)] mb-12">
                            Experience.
                          </h2>
                          <p className="text-2xl leading-relaxed text-[var(--content_brand)] font-semibold">
                            We implement, measure outcomes, and refine. Dummy
                            text: ullamco laboris nisi ut aliquip ex ea commodo
                            consequat.
                          </p>
                        </div>
                      </section>
                    );
                }
              })()}
              {/********* DO NOT DELETE THIS **********/}
              {/* <div className="flex justify-between mt-8">
                <Button
                  theme="brand"
                  onClick={() => setSectionIdx((idx) => idx - 1)}
                >
                  Previous
                </Button>
                <Button
                  theme="brand"
                  onClick={() => setSectionIdx((idx) => idx + 1)}
                >
                  Next
                </Button>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="relative h-full p-4 sm:p-20 md:p-16 lg:p-28 flex flex-col justify-center items-center text-[var(--content_dark)] overflow-hidden">
            <p className="text-xl text-center lg:text-3xl md:text-2xl text-foreground leading-relaxed">
              Every challenge revolves around people.
            </p>
            <p className="mt-8 text-center text-xl lg:text-3xl md:text-2xl text-foreground leading-relaxed">
              We help you strengthen{" "}
              <span className={accent}>understanding</span>,
              <span className={accent}> trust</span> and
              <span className={accent}> collaboration</span>.
            </p>
            <div className="mt-8 z-10 flex items-center justify-center">
              <Button
                theme="dark"
                icon={<ArrowRight size={20} weight="bold" />}
                onClick={() => setExpanded(true)}
              >
                Methodology
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
