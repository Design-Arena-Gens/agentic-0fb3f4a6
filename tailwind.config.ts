import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222, 47%, 11%)",
        surface: "hsl(222, 45%, 18%)",
        accent: "hsl(199, 89%, 48%)"
      }
    }
  },
  plugins: []
};

export default config;
