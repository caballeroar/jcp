/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ppmori: ["PPMori", "Arial", "Helvetica", "sans-serif"],
        sans: ["PPMori", "Arial", "Helvetica", "sans-serif"],
      },
      fontWeight: {
        extralight: 200,
        light: 200, // Add alias for extralight
        normal: 400,
        semibold: 600,
      },
    },
  },
  plugins: [],
};
