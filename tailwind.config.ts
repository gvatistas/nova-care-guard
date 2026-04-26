import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        serif: ["Newsreader", "Times New Roman", "serif"],
      },
      colors: {
        // shadcn aliases
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

        // Certa surface
        ink: "hsl(var(--certa-ink))",
        carbon: "hsl(var(--certa-carbon))",
        obsidian: "hsl(var(--certa-obsidian))",
        bone: "hsl(var(--certa-bone))",
        cloud: "hsl(var(--certa-cloud))",

        // Certa ink (text)
        fg: "hsl(var(--certa-fg))",
        graphite: "hsl(var(--certa-graphite))",
        rule: "hsl(var(--certa-rule))",
        "rule-strong": "hsl(var(--certa-rule-strong))",

        // Signals
        "signal-green": "hsl(var(--signal-green))",
        "signal-amber": "hsl(var(--signal-amber))",
        "signal-red": "hsl(var(--signal-red))",
        "signal-blue": "hsl(var(--signal-blue))",

        // Segments
        "seg-purple": "hsl(var(--seg-purple))",
        "seg-blue": "hsl(var(--seg-blue))",
        "seg-cyan": "hsl(var(--seg-cyan))",
        "seg-amber": "hsl(var(--seg-amber))",
        "seg-brown": "hsl(var(--seg-brown))",
        "seg-slate": "hsl(var(--seg-slate))",

        // legacy gray ramp
        gray: {
          950: "hsl(var(--gray-950))",
          900: "hsl(var(--gray-900))",
          800: "hsl(var(--gray-800))",
          700: "hsl(var(--gray-700))",
          600: "hsl(var(--gray-600))",
          500: "hsl(var(--gray-500))",
          400: "hsl(var(--gray-400))",
          300: "hsl(var(--gray-300))",
          200: "hsl(var(--gray-200))",
        },
        teal: "hsl(var(--teal))",
        blue: "hsl(var(--blue))",
        warm: "hsl(var(--warm))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        none: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
      },
      maxWidth: {
        content: "1440px",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
        out: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scan-line": "scan-line 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
