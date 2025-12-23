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

  const PAD = 1;
  const THUMB_W = 20; // max thumb width in px
  const THUMB_H = 20; // max thumb height in px

  const thumbStyle = {
    position: "absolute",
    top: PAD,
    left: isChecked ? `${PAD}px` : `calc(100% - ${PAD}px - ${THUMB_W}px)`,

    width: `${THUMB_W}px`,
    height: `${THUMB_H}px`,
    borderRadius: 4,
    background: "var(--content_dark)",
    transition: "left 200ms ease-in-out",
  };

  return (
    <button
      type="button"
      className={`
        flex justify-between text-xs relative grid grid-cols-2 items-center cursor-pointer select-none
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50 w-[48px] h-[24px] p-[1px] rounded-[6px] tracking-normal
      `}
      onClick={handleToggle}
      disabled={disabled}
      aria-checked={isChecked}
      role="switch"
      style={{
        border: "1px solid var(--content_dark)",
        boxSizing: "border-box",
        paddingLeft: isChecked ? 1 : 2,
        letterSpacing: "normal",
      }}
    >
      <span
        className={` h-full flex items-center justify-center font-semibold`}
        style={{
          height: 20,
          width: 20,
          transform: "translateY(1px)",
        }}
      >
        EN
      </span>
      <span
        className={` h-full flex items-center justify-center font-semibold `}
        style={{
          height: 20,
          width: 20,
          transform: "translateY(1px)",
        }}
      >
        NL
      </span>

      <span aria-hidden style={thumbStyle} />
    </button>
  );
}
