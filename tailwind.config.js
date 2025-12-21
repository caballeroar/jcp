/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-fustat)", "Arial", "Helvetica", "sans-serif"],
        fustat: ["var(--font-fustat)", "sans-serif"],
      },
      fontWeight: {
        extralight: 200,
        light: 200,
        normal: 400,
        semibold: 600,
      },
      animation: {
        "spin-slow": "spin 120s linear infinite",
      },
    },
  },
  plugins: [],
};
