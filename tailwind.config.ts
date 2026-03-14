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
        cream: "#FDF8F3",
        "latte-beige": "#E8DED4",
        ivory: "#F5F0E8",
        "sky-blue": "#A8D4E6",
        "powder-blue": "#C5E3F0",
        "soft-white": "#FAF9F7",
        "coffee-brown": "#5D4037",
        "coffee-brown-light": "#6F4E37",
        "coffee-hover": "#EDE4DC",
        cloud: {
          50: "#FDFBFA",
          100: "#F8F4F0",
          200: "#F0E9E2",
          300: "#E5DCD2",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-haze":
          "linear-gradient(135deg, rgba(248,244,240,0.9) 0%, rgba(197,227,240,0.3) 50%, rgba(248,244,240,0.9) 100%)",
        "gradient-cloud":
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(168,212,230,0.25), transparent 70%)",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(0,0,0,0.06), 0 8px 48px -8px rgba(0,0,0,0.04)",
        glass: "0 8px 32px rgba(0,0,0,0.06)",
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
