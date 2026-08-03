import type { Config } from "tailwindcss";

/**
 * Design tokens live here and in app/globals.css (as CSS variables).
 * Tailwind consumes the variables so the same palette can be themed.
 * See DESIGN_SYSTEM.md for the rationale behind every value.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        ink: {
          DEFAULT: "var(--ink)",
          secondary: "var(--ink-secondary)",
          tertiary: "var(--ink-tertiary)",
          faint: "var(--ink-faint)",
        },
        accent: {
          exp: "var(--accent-exp)",
          ai: "var(--accent-ai)",
          product: "var(--accent-product)",
        },
        status: {
          win: "var(--status-win)",
          near: "var(--status-near)",
          flat: "var(--status-flat)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Tuned type scale - see DESIGN_SYSTEM.md
        eyebrow: ["11px", { lineHeight: "16px", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        card: "14px",
        node: "12px",
      },
      boxShadow: {
        // Elevation is a whisper - a hairline border does most of the work.
        card: "0 1px 1px rgba(20, 21, 24, 0.03), 0 1px 3px -1px rgba(20, 21, 24, 0.04)",
        raised:
          "0 1px 2px rgba(20, 21, 24, 0.04), 0 6px 20px -8px rgba(20, 21, 24, 0.10)",
        focus: "0 0 0 3px var(--focus-ring)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
