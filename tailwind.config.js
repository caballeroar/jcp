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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#050303",
        },
        brand: {
          50: "#fef5f2",
          100: "#fde8e1",
          200: "#fbd5c8",
          300: "#f7b8a1",
          400: "#f2916a",
          500: "#ec6e3d",
          600: "#df4d20",
          700: "#c03d18",
          800: "#9f3318",
          900: "#822d1a",
          950: "#46140b",
        },
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
