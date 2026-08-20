/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // antd owns the global reset; Tailwind preflight would fight it
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#21BF96",
          light: "#2ADFB2",
          dark: "#189D7B",
          faint: "rgba(33, 191, 150, 0.12)",
        },
        ink: {
          DEFAULT: "#0B0E14",
          raised: "#12161F",
          overlay: "#1A2029",
          border: "#232B38",
        },
        fg: {
          DEFAULT: "#E6EAF2",
          muted: "#94A3B8",
        },
        accent: "#38BDF8",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 24px rgba(0, 0, 0, 0.35)",
        glow: "0 0 24px rgba(33, 191, 150, 0.25)",
      },
    },
  },
  plugins: [],
};
