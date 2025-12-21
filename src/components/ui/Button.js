"use client";

import React from "react";

export default function Button({
  children,
  icon,
  iconPosition = "left",
  theme = "dark",
  onClick,
  ...props
}) {
  const baseButton =
    "inline-flex items-center justify-center rounded-full h-[46px] px-8 font-medium leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const baseIcon =
    "inline-flex items-center justify-center rounded-full text-2xl w-[46px] h-[46px] p-0";

  const baseStyleCommon = { boxSizing: "border-box" };

  const themes = {
    light: {
      background: "var(--gb_box_neutral)",
      color: "var(--content_brand)",
      border: "1px solid var(--content_brand)",
    },
    dark: {
      background: "var(--background)",
      color: "var(--foreground)",
      border: "1px solid var(--foreground)",
    },
  };
  const themeStyle = { ...baseStyleCommon, ...(themes[theme] || themes.light) };

  const iconMargin = iconPosition === "left" ? "-mr-[1px]" : "-ml-[1px]";

  return (
    <button onClick={onClick} {...props} style={{ display: "flex" }}>
      {iconPosition === "left" && (
        <span className={`${baseIcon} ${iconMargin}`} style={themeStyle}>
          {icon}
        </span>
      )}
      <span className={` ${baseButton}  `} style={themeStyle}>
        {children}
      </span>
      {iconPosition !== "left" && (
        <span className={`${baseIcon} ${iconMargin}`} style={themeStyle}>
          {icon}
        </span>
      )}
    </button>
  );
}
