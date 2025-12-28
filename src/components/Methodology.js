"use client";
import Button from "./ui/Button";
import Image from "next/image";
import { ArrowRight } from "phosphor-react";

export default function Methodology({ locale }) {
  const accent = "font-bold mb-2 text-[var(--content_brand)]";
  return (
    <>
      <section className="py-40 px-40 flex items-center justify-center">
        <div
          className={
            "relative w-full text-center px-20 py-48 md:px-40 overflow-hidden"
          }
          style={{
            background: "var(--bg_gradient)",
            transformOrigin: "50% 50%",
          }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <div
              className="absolute"
              style={{
                width: "160%",
                height: "160%",
                left: "2%",
                bottom: "-32%",
              }}
            >
              <Image
                src="/assets/symbol_icon.svg"
                alt=""
                fill
                style={{ objectFit: "contain", opacity: 0.5 }}
                priority={false}
              />
            </div>
          </div>
          <div className="relative z-10 text-[var(--content_dark)]">
            <p className="text-xl lg:text-3xl md:text-2xl text-foreground leading-relaxed">
              Every challenge revolves around people.
            </p>
            <p className="mt-12 text-xl lg:text-3xl md:text-2xl text-foreground leading-relaxed">
              We help you strengthen{" "}
              <span className={accent}>understanding</span>,
              <span className={accent}> trust</span> and
              <span className={accent}> collaboration</span>.
            </p>

            <div className="mt-8 flex items-center justify-center">
              <Button
                theme="dark"
                iconPosition="right"
                icon={<ArrowRight size={20} weight="bold" />}
                href={`/${locale || "en"}/methodology`}
              >
                Methodology
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
