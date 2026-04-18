import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    "#b7102a",
        "primary-dark": "#8c0c20",
        "primary-container": "#db313f",
        secondary:  "#485f84",
        "secondary-container": "#d0dff7",
        "on-surface":  "#001e2e",
        "on-surface-variant": "#3a5068",
        surface:    "#f6faff",
        "surface-lowest": "#ffffff",
        "surface-low":  "#eef4fb",
        "surface-high": "#ddeeff",
        "surface-highest": "#c7e7ff",
        "outline-variant": "rgba(72,95,132,0.18)",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body:    ["'Manrope'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        ambient: "0 4px 24px rgba(72,95,132,0.07)",
        "ambient-lg": "0 8px 40px rgba(72,95,132,0.10)",
      },
      letterSpacing: {
        display: "-0.04em",
        headline: "-0.02em",
        logbook: "0.10em",
      },
    },
  },
  plugins: [],
};

export default config;
