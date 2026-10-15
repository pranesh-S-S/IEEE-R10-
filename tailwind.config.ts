import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0908",
        panel: "#161311",
        line: "#2E2723",
        signal: "#FF6A1F",
        signalDim: "#4A2510",
        ieee: "#FF6A1F",
        amber: "#FFA94D",
        text: "#F3EFE9",
        muted: "#9C948A"
      },
      fontFamily: {
        display: ["'General Sans'", "var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        circuit:
          "radial-gradient(circle at 1px 1px, rgba(255,106,31,0.18) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;