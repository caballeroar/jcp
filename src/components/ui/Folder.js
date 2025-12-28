"use client";

import Button from "./Button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "phosphor-react";

export default function FolderIcon({
  locale,
  title,
  description,
  imageSrc,
  buttonLabel = "View",
  href,
}) {
  const pathname = usePathname();
  const firstSeg = pathname?.split("/").filter(Boolean)[0];
  const supportedLocales = ["en", "nl"]; // extend if more locales are added
  const detectedLocale = supportedLocales.includes(firstSeg)
    ? firstSeg
    : undefined;
  const effectiveLocale = locale ?? detectedLocale;
  const targetHref =
    href || (effectiveLocale ? `/${effectiveLocale}/cases` : "/cases");
  return (
    <div
      className="relative w-full flex flex-col justify-end items-center p-4"
      style={{
        aspectRatio: "180 / 120",
        color: "var(--content_dark)",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 181 118"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <path
          d="M84.9845 0.199877L4.19234 0.338724C1.98589 0.342516 0.199219 2.13227 0.199219 4.33873V112.843C0.199219 115.052 1.99008 116.843 4.19922 116.843H176.201C178.41 116.843 180.201 115.052 180.201 112.843V11.4102C180.201 9.20111 178.41 7.41025 176.201 7.41025H93.3439C91.737 7.41025 90.2862 6.44873 89.66 4.96891L88.6752 2.64121C88.0481 1.15908 86.5938 0.197111 84.9845 0.199877Z"
          style={{
            fill: `var(--background)`,
            stroke: `var(--surface)`,
            strokeWidth: 0.4,
          }}
        />
      </svg>
      <div className="absolute overflow-hidden flex flex-col gap-3 z-10 px-4 py-3">
        <div className="flex justify-between items-end">
          <div className="max-w-[50%]">
            <h3 className="text-xl md:text-2xl text-left font-semibold color:[var(--content-dark)]">
              {title || "Title placeholder"}
            </h3>
            <p className="mt-1 text-lg md:text-xl text-left leading-snug color:[var(--content-dark)] line-clamp-3">
              {description ||
                "Description placeholder text that briefly summarizes the case. Keep it concise and informative."}
            </p>
          </div>
          <Button
            href={targetHref}
            iconPosition="right"
            theme="light"
            icon={<ArrowUpRight size={20} weight="bold" />}
          >
            {buttonLabel}
          </Button>
        </div>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title || "Case thumbnail"}
            width={600}
            height={200}
            unoptimized
            className="w-full h-[200px] object-cover rounded-lg"
          />
        ) : (
          <Image
            src="https://placehold.co/600x200?text=Case+Thumbnail"
            alt="Case thumbnail placeholder"
            width={600}
            height={200}
            unoptimized
            className="w-full h-[200px] object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
}
