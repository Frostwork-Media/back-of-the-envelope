import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        background: "#fafafa",
        foreground: "#171023",
        neutral: {
          50: "#fafafa",
          100: "#f5f4f7",
          200: "#e6e5ea",
          300: "#d5d3db",
          400: "#a4a1ab",
          500: "#74707c",
          600: "#55515f",
          700: "#423d4d",
          800: "#292434",
          900: "#1b1426",
        },
        brand: {
          DEFAULT: "#8b68ee",
          50: "#f5f3ff",
          100: "#eeeaff",
          200: "#dfd9ff",
          300: "#c6bafd",
          400: "#a892f7",
          500: "#8b68ee",
          600: "#7a48e6",
          700: "#6b33d5",
          800: "#5926b4",
          900: "#4b1e96",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
