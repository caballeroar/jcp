"use client";

import { useRef } from "react";
import { ArrowRight } from "phosphor-react";
import { useI18n } from "../lib/I18nContext";
import { Button } from "./ui";
import { useScrollProgress } from "../hooks/useScrollProgress";
// import "../app/globals.css";

const CONTACT_ORBITS = [
  {
    transform: "rotate(-59.1622 384.402 405.368)",
    centerX: 294.402,
    centerY: 365.368,
    path: "M 525.66 405.368 A 141.258 302.174 0 1 0 243.144 405.368 A 141.258 302.174 0 1 0 525.66 405.368 Z",
    labelKey: "identify",
    duration: "48s",
    textClass: "font-roboto-mono rotate-60",
  },
  {
    transform: "rotate(54.5895 724.149 335.821)",
    centerX: 724.149,
    centerY: 335.821,
    path: "M 879.569 335.821 A 155.42 360.959 0 1 0 568.729 335.821 A 155.42 360.959 0 1 0 879.569 335.821 Z",
    labelKey: "listen",
    duration: "42s",
    textClass: "font-roboto-mono rotate-[-55deg]",
  },
  {
    transform: "rotate(-123.807 352.906 618.302)",
    centerX: 282.906,
    centerY: 788.302,
    path: "M 500.618 618.302 A 147.712 325.811 0 1 0 205.194 618.302 A 147.712 325.811 0 1 0 500.618 618.302 Z",
    labelKey: "experience",
    duration: "48s",
    textClass: "font-roboto-mono rotate-124",
  },
  {
    transform: "rotate(135 745.172 691.067)",
    centerX: 745.172,
    centerY: 791.067,
    path: "M 886.231 691.067 A 141.059 427.338 0 1 0 604.113 691.067 A 141.059 427.338 0 1 0 886.231 691.067 Z",
    labelKey: "translate",
    duration: "46s",
    textClass: "font-roboto-mono rotate-225",
  },
];

const CONTACT_ELLIPSE_MAP = [
  { xStart: -600, yStart: -400, xEnd: -260, yEnd: -220 },
  { xStart: 600, yStart: -400, xEnd: 260, yEnd: -220 },
  { xStart: -600, yStart: 400, xEnd: -260, yEnd: 260 },
  { xStart: 600, yStart: 400, xEnd: 260, yEnd: 260 },
];

const ORBIT_SCALE = 1.55;
const VIEWBOX_CENTER_X = 574;
const VIEWBOX_CENTER_Y = 546.5;

function OrbitGlyph({ id, orbit, label }) {
  const offsetX = VIEWBOX_CENTER_X - orbit.centerX;
  const offsetY = VIEWBOX_CENTER_Y - orbit.centerY;

  return (
    <g
      transform={`translate(${VIEWBOX_CENTER_X} ${VIEWBOX_CENTER_Y}) scale(${ORBIT_SCALE}) translate(${-VIEWBOX_CENTER_X} ${-VIEWBOX_CENTER_Y})`}
    >
      <g transform={`translate(${offsetX} ${offsetY})`}>
        <g transform={orbit.transform}>
          <path
            id={id}
            d={orbit.path}
            fill="none"
            stroke="var(--content_brand)"
          />
          <g>
            <circle r="4" fill="var(--content_brand)" />
            <text
              x="14"
              y="6"
              fill="var(--content_brand)"
              fontSize="14"
              className={orbit.textClass}
            >
              {label}
            </text>
            <animateMotion
              dur={orbit.duration}
              repeatCount="indefinite"
              rotate="0"
            >
              <mpath xlinkHref={`#${id}`} />
            </animateMotion>
          </g>
        </g>
      </g>
    </g>
  );
}

export default function Methodology2() {
  const { locale, dict } = useI18n();
  const sectionRef = useRef(null);

  useScrollProgress(sectionRef, { start: 0.12, end: 0.42 });

  const accent = "font-bold mb-2 text-[var(--content_brand)]";

  return (
    <section
      ref={sectionRef}
      className="methodology relative w-full min-h-screen flex items-center justify-center overflow-visible"
    >
      {CONTACT_ORBITS.map((orbit, index) => {
        const coords = CONTACT_ELLIPSE_MAP[index];
        const id = `methodologyContactPath${index + 1}`;
        const label = dict?.pages?.home?.contact?.[orbit.labelKey] ?? "";
        return (
          <svg
            key={id}
            className="ellipse opacity-70 w-[520px] md:w-[680px] lg:w-[780px] overflow-visible"
            data-index={index}
            viewBox="0 0 1148 1093"
            aria-hidden
            style={{
              "--x-start": `${coords.xStart}px`,
              "--y-start": `${coords.yStart}px`,
              "--x-end": `${coords.xEnd}px`,
              "--y-end": `${coords.yEnd}px`,
            }}
          >
            <OrbitGlyph id={id} orbit={orbit} label={label} />
          </svg>
        );
      })}

      <div className="w-4/6  flex flex-col items-center text-center relative z-10">
        <p className="text-xl md:text-5xl font-bold tracking-tighter">
          {dict?.pages?.home?.methodology?.sentence1}
        </p>

        <p className="mt-8 text-xl md:text-5xl font-bold tracking-tighter">
          {dict?.pages?.home?.methodology?.sentence2}{" "}
          <span className={accent}>
            {dict?.pages?.home?.methodology?.accent1}
          </span>
          ,{" "}
          <span className={accent}>
            {dict?.pages?.home?.methodology?.accent2}
          </span>{" "}
          and{" "}
          <span className={accent}>
            {dict?.pages?.home?.methodology?.accent3}
          </span>
        </p>

        <Button
          theme="dark"
          icon={<ArrowRight size={20} weight="bold" />}
          className="mt-12"
          href={`/${locale}/methodology`}
        >
          {dict?.pages?.home?.methodology?.cta}
        </Button>
      </div>
    </section>
  );
}
