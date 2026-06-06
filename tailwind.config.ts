import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0b09",
        surface: "#16140f",
        ivory: "#ece6d8",
        gold: "#c4a35a",
        element: {
          wood: "#7C9A74",
          fire: "#C2705A",
          earth: "#C2A36B",
          metal: "#B4B7B2",
          water: "#6E8BA6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};

export default config;
