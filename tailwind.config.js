/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#1f2a3a",
        bg: "#f3f6fb",
        card: "#ffffff",
        accent: "#ff2e63",
        muted: "#8b97a7"
      },
      boxShadow: {
        card: "0 10px 30px rgba(31,42,58,0.08)",
      }
    },
  },
  plugins: [],
}
