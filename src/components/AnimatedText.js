"use client";

import { useState, useEffect } from "react";

export default function AnimatedText({
  words,
  className = "",
  duration = 2000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300); // Half of transition duration
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  if (!words || words.length === 0) {
    return null;
  }

  return (
    <div className={`${className} h-16 flex items-center justify-center`}>
      <span
        className={`transition-all duration-600 ${
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4"
        }`}
      >
        {words[currentIndex]}
      </span>
    </div>
  );
}
