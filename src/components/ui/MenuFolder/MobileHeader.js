"use client";

import Link from "next/link";
import Image from "next/image";
import LogoIcon from "../../../../public/assets/logo_icon.svg";
import LanguageSwitcher from "../Switcher/LanguageSwitcher";

export function MobileHeader({ buildHref, invert }) {
  const style = {
    borderColor: "color-mix(in srgb, var(--surface) 25%, transparent)",
    background: "color-mix(in srgb, var(--background) 5%, transparent)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
  };
  const logoClass = invert ? "brightness-0 invert" : "";

  return (
    <header
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full border-t"
      style={style}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <Link href={buildHref()}>
          <Image
            src={LogoIcon}
            alt="Just Common People"
            height={28}
            className={logoClass}
            priority
          />
        </Link>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
