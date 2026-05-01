import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#B8730A",
          hover: "#9A5E08",
        },
        ink: "#1C1410",
        body: "#4A3A2A",
        muted: "#8A7A6A",
        surface: {
          DEFAULT: "#F8F5EF",
          2: "#EDE6D8",
          dark: "#1A1008",
        },
        line: "#DDD0BC",
        gold: "#D4AF37",
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-serif", "Georgia", "serif"],
        display: ["var(--font-heading)", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
