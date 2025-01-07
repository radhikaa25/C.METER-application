import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "black", // Light gray background
        foreground: "hsl(220, 15%, 20%)", // Dark text
        card: {
          DEFAULT: "hsl(240, 10%, 98%)", // Soft white card background
          foreground: "hsl(220, 12%, 25%)", // Text color for cards
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 98%)", // Popover background
          foreground: "hsl(210, 10%, 30%)", // Popover text
        },
        primary: {
          DEFAULT: "hsl(204, 86%, 53%)", // Blue primary
          foreground: "hsl(0, 0%, 100%)", // White text
        },
        secondary: {
          DEFAULT: "hsl(34, 100%, 50%)", // Bright orange
          foreground: "hsl(0, 0%, 100%)", // White text
        },
        muted: {
          DEFAULT: "hsl(210, 10%, 80%)", // Muted gray
          foreground: "hsl(210, 10%, 40%)", // Muted text
        },
        accent: {
          DEFAULT: "hsl(160, 65%, 45%)", // Green accent
          foreground: "hsl(0, 0%, 100%)", // White text
        },
        destructive: {
          DEFAULT: "hsl(0, 75%, 55%)", // Bright red
          foreground: "hsl(0, 0%, 100%)", // White text
        },
        border: "hsl(210, 20%, 90%)", // Light border
        input: "hsl(210, 20%, 85%)", // Input field background
        ring: "hsl(204, 86%, 53%)", // Ring effect color
        chart: {
          "1": "hsl(204, 86%, 53%)",
          "2": "hsl(34, 100%, 50%)",
          "3": "hsl(160, 65%, 45%)",
          "4": "hsl(0, 75%, 55%)",
          "5": "hsl(45, 100%, 60%)", // Yellow for chart 5
        },
        "color-1": "hsl(280, 50%, 60%)", // Purple
        "color-2": "hsl(345, 60%, 50%)", // Pink
        "color-3": "hsl(220, 40%, 40%)", // Dark blue
        "color-4": "hsl(110, 50%, 40%)", // Dark green
        "color-5": "hsl(60, 100%, 50%)", // Yellow
      },
      borderRadius: {
        lg: "12px", // Larger rounded corners
        md: "8px", // Medium rounded corners
        sm: "4px", // Small rounded corners
      },
      animation: {
        rainbow: "rainbow 3s infinite linear", // Faster rainbow animation
        "shiny-text": "shiny-text 6s infinite", // Shiny text with slightly shorter loop
        gradient: "gradient 10s linear infinite", // Slower gradient animation
      },
      keyframes: {
        rainbow: {
          "0%": {
            "background-position": "0%",
          },
          "100%": {
            "background-position": "300%",
          },
        },
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shiny-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shiny-width)) 0",
          },
        },
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
