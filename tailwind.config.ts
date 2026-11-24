import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8d48b",
          dark: "#8b6914",
        },
        cream: "#f5f0e1",
        blood: {
          DEFAULT: "#8b0000",
          light: "#c41e3a",
        },
        charcoal: "#1a1a1a",
        ash: "#2a2a2a",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        typewriter: ["var(--font-special-elite)", "Courier New", "monospace"],
      },
      transitionDuration: {
        "800": "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
