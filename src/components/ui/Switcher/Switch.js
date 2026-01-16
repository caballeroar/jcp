"use client";

export default function Switch({ checked, onToggle, disabled = false }) {
  const PAD = 1;
  const THUMB_W = 20;
  const THUMB_H = 20;

  const thumbStyle = {
    position: "absolute",
    top: PAD,
    left: checked ? `${PAD}px` : `calc(100% - ${PAD}px - ${THUMB_W}px)`,
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: 4,
    background: "var(--content_dark)",
    transition: "left 200ms ease-in-out",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onToggle()}
      className={`
        relative grid grid-cols-2 items-center w-[48px] h-[24px]
        rounded-[6px] cursor-pointer select-none
        disabled:cursor-not-allowed disabled:opacity-50
      `}
      style={{
        border: "1px solid var(--content_dark)",
        boxSizing: "border-box",
        paddingLeft: checked ? 1 : 2,
      }}
    >
      <span
        className="flex items-center justify-center font-semibold text-xs"
        style={{
          width: 20,
          height: 20,
          transform: "translateY(1px)",
        }}
      >
        EN
      </span>
      <span
        className="flex items-center justify-center font-semibold text-xs"
        style={{
          width: 20,
          height: 20,
          transform: "translateY(1px)",
        }}
      >
        NL
      </span>

      <span aria-hidden style={thumbStyle} />
    </button>
  );
}
