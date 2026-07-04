import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "var(--bg-primary)",
          bgSecondary: "var(--bg-secondary)",
          bgElevated: "var(--bg-elevated)",
          gold: "var(--gold-primary)",
          goldBright: "var(--gold-bright)",
          goldMuted: "var(--gold-muted)",
          goldDeep: "var(--gold-deep)",
          text: "var(--text-primary)",
          textMuted: "var(--text-secondary)",
          onGold: "var(--text-on-gold)",
        },
      },
      boxShadow: {
        goldGlow: "var(--shadow-glow)",
        deep: "var(--shadow-deep)",
      },
      borderColor: {
        subtle: "var(--border-subtle)",
        strong: "var(--border-strong)",
      },
    },
  },
  plugins: [],
};

export default config;
