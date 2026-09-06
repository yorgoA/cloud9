import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F2EFE6",
        "latte-beige": "#D6C7B3",
        ivory: "#F7F3EA",
        "sky-blue": "#839BAE",
        "powder-blue": "#BED4E5",
        "soft-white": "#FAF8F3",
        "coffee-brown": "#53443D",
        "coffee-brown-light": "#6B584F",
        "coffee-hover": "#EAE2D3",
        "dusty-blue": "#839BAE",
        sand: "#D6C7B3",
        espresso: "#53443D",
        cloud: {
          50: "#FAF8F3",
          100: "#F2EFE6",
          200: "#E9E2D3",
          300: "#D6C7B3",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-haze":
          "linear-gradient(135deg, rgba(242,239,230,0.9) 0%, rgba(190,212,229,0.3) 50%, rgba(242,239,230,0.9) 100%)",
        "gradient-cloud":
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(131,155,174,0.2), transparent 70%)",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(0,0,0,0.06), 0 8px 48px -8px rgba(0,0,0,0.04)",
        glass: "0 8px 32px rgba(0,0,0,0.06)",
        hard: "4px 4px 0 0 #53443D",
        "hard-sm": "3px 3px 0 0 #53443D",
        "hard-lg": "7px 7px 0 0 #53443D",
        "hard-blue": "4px 4px 0 0 #839BAE",
        "hard-none": "0 0 0 0 #53443D",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
