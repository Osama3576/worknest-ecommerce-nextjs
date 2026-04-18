import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/actions/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        sidebar: "rgb(var(--sidebar) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / 0.18)",
        },
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 24px 80px rgb(var(--shadow-glow) / 0.14)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "1.85rem",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgb(var(--accent-soft) / 0.16), transparent 35%), linear-gradient(180deg, rgb(var(--foreground) / 0.04), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
