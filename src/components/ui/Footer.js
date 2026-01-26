"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isServicesPage = pathname?.includes("/services");
  const bgColor = isServicesPage ? "var(--bg_brand)" : "transparent";
  const fontColor = isServicesPage ? "white" : "var(--bg_brand)";
  const imageFilter = isServicesPage ? "brightness-0 invert" : "";

  return (
    <footer
      className=" relative w-full overflow-hidden flex flex-col items-center mb-14 md:mb-0 "
      style={{ backgroundColor: bgColor }}
    >
      {/* do not remove the commented lines below - they are for future design iterations */}
      {/* <div className="absolute bottom-[-150%] inset-0 flex items-end justify-center">
        <div className="w-[80%] max-w-5xl aspect-square bg-[var(--content_brand)] rounded-full blur-3xl opacity-20" />
      </div> */}
      <div
        className="flex flex-col gap-6  w-5/6 pb-2 border-b"
        style={{ borderColor: fontColor }}
      >
        <div
          className="relative mx-auto w-full h-32 md:h-64 "
          style={{ pointerEvents: "none" }}
          aria-hidden="true"
        >
          <Image
            src="/assets/official_logo_full.svg"
            alt=""
            fill
            className={`object-contain ${imageFilter}`}
          />
        </div>
        <p className="font-roboto-mono italic text-sm md:w-2/6">
          Just Common People is a creative, human centred & strategic agency
        </p>
        <div className="flex items-center gap-1 pt-20">
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full  hover:bg-[var(--content_brand)]/10 transition"
          >
            <Image
              src="/assets/Insta.svg"
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className={imageFilter}
            />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full  hover:bg-[var(--content_brand)]/10 transition"
          >
            <Image
              src="/assets/LinkedIn.svg"
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className={imageFilter}
            />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div
        className="w-5/6 mx-auto py-6 flex justify-between "
        style={{ color: fontColor }}
      >
        <div>
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: fontColor }}
          >
            © {new Date().getFullYear()} JCP
          </p>
        </div>

        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/privacy" style={{ color: fontColor }}>
            Privacy
          </Link>

          <Link href="/cookies" style={{ color: fontColor }}>
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
