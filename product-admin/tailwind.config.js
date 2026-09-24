/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B1F2A",
        paper: "#F7F7F5",
        line: "#DEDEDA",
        accent: "#2F5D50",
        accentSoft: "#E4EDE9",
        warn: "#9A3B2E",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
