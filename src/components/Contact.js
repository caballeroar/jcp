"use client";

import Button from "./ui/Button";
import { ArrowRight } from "phosphor-react";

export default function Contact() {
  return (
    <section className="relative flex items-center w-full md:w-4/6 h-[600px] md:h-[800px] py-24 mx-auto sm:py-20 md:my-40 px-6 overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 -z-10" style={{ pointerEvents: "none" }}>
        <svg
          className="w-full h-full"
          viewBox="0 0 1148 1093"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbit 1 */}
          <g transform="rotate(-59.1622 384.402 405.368)">
            <path
              id="contactPath1"
              d="M 525.66 405.368 A 141.258 302.174 0 1 0 243.144 405.368 A 141.258 302.174 0 1 0 525.66 405.368 Z"
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
                className="font-roboto-mono rotate-60"
              >
                Identify
              </text>
              <animateMotion dur="48s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath1" />
              </animateMotion>
            </g>
          </g>

          {/* Orbit 2 */}
          <g transform="rotate(54.5895 724.149 335.821)">
            <path
              id="contactPath2"
              d="M 879.569 335.821 A 155.42 360.959 0 1 0 568.729 335.821 A 155.42 360.959 0 1 0 879.569 335.821 Z"
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
                className="font-roboto-mono rotate-[-55deg]"
              >
                Listen
              </text>
              <animateMotion dur="42s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath2" />
              </animateMotion>
            </g>
          </g>

          {/* Orbit 3 */}
          <g transform="rotate(135 745.172 691.067)">
            <path
              id="contactPath3"
              d="M 886.231 691.067 A 141.059 427.338 0 1 0 604.113 691.067 A 141.059 427.338 0 1 0 886.231 691.067 Z"
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
                className="font-roboto-mono rotate-225"
              >
                Translate
              </text>
              <animateMotion dur="46s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath3" />
              </animateMotion>
            </g>
          </g>

          {/* Orbit 4 */}
          <g transform="rotate(-123.807 352.906 618.302)">
            <path
              id="contactPath4"
              d="M 500.618 618.302 A 147.712 325.811 0 1 0 205.194 618.302 A 147.712 325.811 0 1 0 500.618 618.302 Z"
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
                className="font-roboto-mono rotate-124"
              >
                Experience
              </text>
              <animateMotion dur="48s" repeatCount="indefinite" rotate="0">
                <mpath xlinkHref="#contactPath4" />
              </animateMotion>
            </g>
          </g>
        </svg>
      </div>

      {/* Overlay content */}
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--content_dark)]">
          Let’s create impact, together.
        </h2>

        <div className="mt-8 inline-flex">
          <Button
            icon={<ArrowRight size={20} weight="bold" />}
            theme="dark"
            href="/contact"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
