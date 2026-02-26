import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0e1a",
        foreground: "#f0f2f5",
        surface: "#111827",
        "surface-raised": "#1a2235",
        border: "#1e2d45",
        accent: {
          DEFAULT: "#c9a84c",
          hover: "#dbb95c",
          muted: "#c9a84c1a",
        },
        text: {
          primary: "#f0f2f5",
          secondary: "#8a9bb0",
          muted: "#4a5a70",
        },
        error: "#e05252",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderColor: {
        DEFAULT: "var(--border-color)",
      },
    },
  },
  plugins: [],
};
export default config;
