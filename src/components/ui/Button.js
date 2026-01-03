"use client";

import React from "react";
import Link from "next/link";

export default function Button({
  children,
  icon,
  iconPosition = "right",
  theme = "dark",
  onClick,
  href,
  prefetch,
  className,
  ...props
}) {
  const baseButton =
    "inline-flex items-center justify-center rounded-full h-[46px] px-8 font-semibold leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const baseIcon =
    "inline-flex items-center justify-center rounded-full text-2xl w-[46px] h-[46px] p-0 transition-transform duration-500 ease-in-out";

  const baseStyleCommon = { boxSizing: "border-box" };

  const themes = {
    light: {
      background: "var(--background)",
      color: "var(--content_dark)",
      border: "1px solid var(--content_dark)",
      letterSpacing: "normal",
    },
    dark: {
      background: "var(--surface)",
      color: "var(--content_light)",
      border: "1px solid var(--background)",
      letterSpacing: "normal",
    },
    brand: {
      background: "var(--bg_box_neutral)",
      color: "var(--content_brand)",
      border: "1px solid var(--content_brand)",
      letterSpacing: "normal",
    },
  };
  const themeStyle = { ...baseStyleCommon, ...(themes[theme] || themes.light) };

  const iconMargin = iconPosition === "left" ? "-mr-[1px]" : "-ml-[1px]";
  const iconHoverClass =
    iconPosition === "left"
      ? "group-hover:-translate-x-1"
      : "group-hover:translate-x-1";

  if (href) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        className={`group ${className || ""}`}
        {...props}
        style={{ display: "flex", transform: "translateY(1px)" }}
      >
        {iconPosition === "left" && (
          <span
            className={`${baseIcon} ${iconMargin} ${iconHoverClass}`}
            style={themeStyle}
          >
            {icon}
          </span>
        )}
        <span className={` ${baseButton}  `} style={themeStyle}>
          {children}
        </span>
        {iconPosition === "right" && (
          <span
            className={`${baseIcon} ${iconMargin} ${iconHoverClass}`}
            style={themeStyle}
          >
            {icon}
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`group ${className || ""}`}
      {...props}
      style={{ display: "flex", transform: "translateY(1px)" }}
    >
      {iconPosition === "left" && (
        <span
          className={`${baseIcon} ${iconMargin} ${iconHoverClass}`}
          style={themeStyle}
        >
          {icon}
        </span>
      )}
      <span className={` ${baseButton}  `} style={themeStyle}>
        {children}
      </span>
      {iconPosition === "right" && (
        <span
          className={`${baseIcon} ${iconMargin} ${iconHoverClass} `}
          style={{ ...themeStyle }}
        >
          {icon}
        </span>
      )}
    </button>
  );
}
