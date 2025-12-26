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
  // Using bundled SVG asset as background
  return (
    <div
      className="relative w-full flex flex-col justify-end items-center p-4 bg-no-repeat bg-contain"
      style={{
        aspectRatio: "180 / 120",
        backgroundImage: 'url("/assets/folder.svg")',
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: "var(--content_dark)",
        // backgroundColor: "red",
      }}
    >
      <div
        className="overflow-hidden flex flex-col gap-3 "
        style={{
          left: `${(12 / 180) * 100}%`,
          top: `${(24 / 120) * 100}%`,
          //   backgroundColor: "var(--background)",
        }}
      >
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
