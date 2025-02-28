import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        border: "var(--border)",
        input: "var(--input)",
        "card-bg": "var(--card-bg)",
        "card-border": "var(--card-border)",
        "card-shadow": "var(--card-shadow)",
        "card-shadow-hover": "var(--card-shadow-hover)",
        spade: "var(--spade)",
        heart: "var(--heart)",
        diamond: "var(--diamond)",
        club: "var(--club)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "calc(var(--radius) + 0.25rem)",
        md: "calc(var(--radius) - 0.125rem)",
        sm: "calc(var(--radius) - 0.25rem)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      boxShadow: {
        card: "0 2px 8px var(--card-shadow)",
        "card-hover": "0 4px 12px var(--card-shadow-hover)",
      },
      minHeight: {
        '10': '2.5rem',
      },
      minWidth: {
        '10': '2.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
