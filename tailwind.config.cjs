/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // UI theme (pastel purple/blue like the provided reference screens)
        accent: "#6D5DFE",
        accentPink: "#EC4899",
        accentBlue: "#60A5FA",
      },
      boxShadow: {
        card: "0 14px 44px rgba(15, 23, 42, 0.12)",
        soft: "0 12px 34px rgba(109, 93, 254, 0.22)",
      },
    },
  },
  plugins: [],
};
