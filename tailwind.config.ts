import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Design tokens extracted from the live MVP stylesheet (index-*.css):
 * brand #3984f5, ink #243149, body #57667c, quiet #738196, line #e9edf3, canvas #f8faff,
 * radius .8rem, font Plus Jakarta Sans.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        brand: { DEFAULT: "#3984f5", dark: "#2672df", pale: "#edf5ff" },
        ink: "#243149",
        "body-text": "#57667c",
        quiet: "#738196",
        line: "#e9edf3",
        canvas: "#f8faff",
        success: { DEFAULT: "#16a34a", soft: "#e8f7ee", ink: "#15803d" },
        warning: { DEFAULT: "#d97706", soft: "#fff6e5" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(36,49,73,.04), 0 4px 16px rgba(36,49,73,.04)",
        pop: "0 8px 30px rgba(36,49,73,.10)",
      },
    },
  },
  plugins: [animate],
};
export default config;

