"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Switch } from ".";
import LogoFull from "../../../public/assets/logo_full.svg";

export default function Menu({
  items = [
    { label: "About", slug: "about" },
    { label: "Cases", slug: "cases" },
    { label: "Services", slug: "services" },
  ],
  locale = "en",
  onLocaleToggle,
  localeDisabled = false,
  showHeader = true,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleMenu = () => setOpen((v) => !v);

  return (
    <div className={`w-full ${className}`}>
      {showHeader && (
        <header
          className="fixed top-0 left-0 right-0 z-50 w-full border-b"
          style={{
            borderColor: "color-mix(in srgb, var(--surface) 25%, transparent)",
            background: "color-mix(in srgb, var(--background) 5%, transparent)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <div
            className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between tracking-normal"
            style={{ letterSpacing: "normal" }}
          >
            <div className="flex items-center gap-3">
              <Image
                src={LogoFull}
                alt="Just Common People"
                // width={160}
                height={36}
                priority
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center gap-2 ] px-4 text-sm font-bold translate-y-0.5 cursor-pointer text-[var(--content_dark)]"
                aria-expanded={open}
                aria-controls="site-menu-panel"
              >
                MENU
              </button>
              {onLocaleToggle && (
                <Switch
                  checked={locale === "nl"}
                  disabled={localeDisabled}
                  onChange={(v) => onLocaleToggle(v ? "nl" : "en")}
                />
              )}
            </div>
          </div>
        </header>
      )}

      {/* Slide-out panel */}
      {open && (
        <div className={`fixed inset-0 pointer-events-auto`}>
          {/* Overlay */}
          <div
            ref={overlayRef}
            onClick={() => setOpen(false)}
            className={`absolute inset-0 transition-opacity duration-200 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ background: "rgba(0,0,0,0.2)" }}
          />

          {/* Drawer */}
          <nav
            id="site-menu-panel"
            className={`absolute right-0 top-0 h-full w-[280px] transform transition-transform duration-300 ease-out tracking-normal ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ letterSpacing: "normal" }}
            //   style={panelStyle}
            aria-hidden={!open}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: "var(--grey)" }}
            >
              <span
                className="text-sm font-medium tracking-normal"
                style={{ color: "var(--content_dark)" }}
              >
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full h-[32px] px-3 text-xs"
              >
                Close
              </button>
            </div>

            <ul className="p-4 space-y-2">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${locale}/${item.slug}`}
                    className="block rounded-md px-3 py-2 hover:underline text-sm"
                    style={{ color: "var(--content_dark)" }}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
