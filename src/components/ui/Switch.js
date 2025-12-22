"use client";

import { useState, useEffect } from "react";

export default function Switch({
  checked = false,
  onChange,
  disabled = false,
}) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const PAD = 2;

  const trackStyle = {
    border: "1px solid var(--content_dark)",
    color: "var(--content_dark)",
  };
  const thumbStyle = {
    position: "absolute",
    top: PAD,
    left: isChecked ? `${PAD}px` : `calc(50% + ${PAD}px)`,
    width: `calc(50% - ${PAD * 2}px)`,
    height: `calc(100% - ${PAD * 2}px)`,
    borderRadius: 6,
    background: "var(--content_dark)",
    transition: "left 200ms ease-in-out",
  };

  return (
    <button
      type="button"
      className={`
        text-sm relative grid grid-cols-2 items-center cursor-pointer select-none
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50 w-[60px] h-[28px] p-[2px] rounded-[8px]
      `}
      onClick={handleToggle}
      disabled={disabled}
      aria-checked={isChecked}
      role="switch"
      style={{ ...trackStyle, boxSizing: "border-box" }}
    >
      <span
        className={` h-full flex items-center justify-center font-semibold`}
        style={{
          height: `calc(100% - ${PAD * 2}px)`,
          lineHeight: `calc(100% - ${PAD * 2}px)`,
          transform: "translateY(1px)",
        }}
      >
        EN
      </span>
      <span
        className={` h-full flex items-center justify-center font-semibold `}
        style={{
          height: `calc(100% - ${PAD * 2}px)`,
          lineHeight: `calc(100% - ${PAD * 2}px)`,
          transform: "translateY(1px)",
        }}
      >
        NL
      </span>

      <span aria-hidden style={thumbStyle} />
    </button>
  );
}
