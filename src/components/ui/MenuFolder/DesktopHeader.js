"use client";

import Link from "next/link";
import Image from "next/image";
import { useMenuContext } from "./MenuProvider";
import LogoFull from "../../../../public/assets/logo_full.svg";
import LanguageSwitcher from "../Switcher/LanguageSwitcher";

export function DesktopHeader({ buildHref, invert }) {
  const { open, toggle, navigate } = useMenuContext();

  const style = open
    ? { borderColor: "transparent", background: "var(--bg_box_neutral)" }
    : {
        borderColor: "color-mix(in srgb, var(--surface) 25%, transparent)",
        background: "color-mix(in srgb, var(--background) 5%, transparent)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      };
  const logoClass = invert && !open ? "brightness-0 invert" : "";

  return (
    <header
      id="site-header"
      className="hidden md:block fixed top-0 left-0 right-0 z-50 w-full border-b"
      style={style}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href={buildHref()} onClick={(e) => navigate(buildHref(), e)}>
          <Image
            src={LogoFull}
            alt="Just Common People"
            height={36}
            className={logoClass}
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="px-4 text-sm font-bold"
            aria-expanded={open}
          >
            {open ? "CLOSE" : "MENU"}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
