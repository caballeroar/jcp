"use client";

import Link from "next/link";
import Image from "next/image";
import { useMenuContext } from "./MenuProvider";
import LogoIcon from "../../../../public/assets/logo_icon.svg";
import LanguageSwitcher from "../Switcher/LanguageSwitcher";

export function MobileHeader({ buildHref, invert }) {
  const { open, toggle, navigate } = useMenuContext();

  const style = open
    ? { borderColor: "transparent", background: "var(--bg_box_neutral)" }
    : {
        borderColor: "color-mix(in srgb, var(--surface) 25%, transparent)",
        background: "color-mix(in srgb, var(--background) 10%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      };
  const logoClass = invert && !open ? "brightness-0 invert" : "";

  return (
    <header
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full border-t"
      style={style}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <Link href={buildHref()} onClick={(e) => navigate(buildHref(), e)}>
          <Image
            src={LogoIcon}
            alt="Just Common People"
            height={28}
            className={logoClass}
            priority
          />
        </Link>

        <button onClick={toggle} className="text-sm font-bold">
          {open ? "CLOSE" : "MENU"}
        </button>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
