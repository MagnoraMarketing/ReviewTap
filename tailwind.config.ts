import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bed0fd",
          300: "#92b3fb",
          400: "#5f8bf7",
          500: "#3a63f0",
          600: "#2745e3",
          700: "#2136c4",
          800: "#212f9e",
          900: "#212c7d",
          950: "#161b4d",
        },
        ink: {
          900: "#0b0f1a",
          800: "#141a2a",
          700: "#1e2740",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
        soft: "0 4px 24px rgba(16, 24, 40, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
