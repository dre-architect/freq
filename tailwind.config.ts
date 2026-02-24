import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        freq: {
          bg: "#0A0E1A",
          card: "#111827",
          purple: "#7C3AED",
          teal: "#06B6D4",
          "purple-light": "#8B5CF6",
          "teal-light": "#22D3EE",
          border: "#1F2937",
          muted: "#9CA3AF",
          text: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
