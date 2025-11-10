"use client";

import { useState, useEffect } from "react";

export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  activeColor = "primary",
  className = "",
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

  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-11 h-6",
    lg: "w-14 h-8",
  };

  const thumbSizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const translateClasses = {
    sm: isChecked ? "translate-x-4" : "translate-x-0",
    md: isChecked ? "translate-x-5" : "translate-x-0",
    lg: isChecked ? "translate-x-6" : "translate-x-0",
  };

  const colorClasses = {
    primary: isChecked
      ? "bg-primary-950 focus:ring-primary-950"
      : "bg-gray-200",
    brand: isChecked ? "bg-brand-600 focus:ring-brand-600" : "bg-gray-200",
  };

  return (
    <button
      type="button"
      className={`
        relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
        focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        ${sizeClasses[size]}
        ${colorClasses[activeColor]}
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${className}
      `}
      onClick={handleToggle}
      disabled={disabled}
      aria-checked={isChecked}
      role="switch"
    >
      <span
        className={`
          pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 
          transition duration-200 ease-in-out
          ${thumbSizeClasses[size]}
          ${translateClasses[size]}
        `}
      />
    </button>
  );
}
