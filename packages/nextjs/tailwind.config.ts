import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  daisyui: {
    themes: [
      {
        light: {
          primary: "#93BBFB",
          "primary-content": "#2A3655",
          secondary: "#8B45FD",
          "secondary-content": "#7800FF",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#ffffff",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
        },
      },
      {
        dark: {
          primary: "#212638",
          "primary-content": "#DAE8FF",
          secondary: "#8b45fd",
          "secondary-content": "#0FF",
          accent: "#4969A6",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#1C223B",
          "base-200": "#2A3655",
          "base-300": "#141a30",
          "base-content": "#F9FBFF",
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "gradient-light":
          "linear-gradient(270deg, #A7ECFF -17.42%, #E8B6FF 109.05%)",
        "gradient-dark":
          "var(--gradient, linear-gradient(90deg, #42D2F1 0%, #B248DD 100%))",
        "gradient-vertical":
          "linear-gradient(180deg, #3457D1 0%, #8A45FC 100%)",
        "gradient-icon":
          "var(--gradient, linear-gradient(90deg, #42D2F1 0%, #B248DD 100%))",

        // 🌟 FONDO DEGRADADO SOLICITADO
        "gradient-starklotto":
          "linear-gradient(135deg, #3A0909 0%, #000000 100%)",
      },
    },
  },
};

export default config;
