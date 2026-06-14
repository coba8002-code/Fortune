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
        // 베이지 럭셔리 브랜드 팔레트(랜딩) — 깔끔·심플·고급
        brand: {
          cream: "#FBF7F1",
          sand: "#F2EBDF",
          beige: "#E8DECE",
          taupe: "#CDBFA8",
          bronze: "#A88B5C",
          coffee: "#6B6051",
          ink: "#3A3329",
          muted: "#938875",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        round: ["var(--font-round)"],
      },
      boxShadow: {
        soft: "0 18px 44px -20px rgba(120, 100, 70, 0.28)",
        card: "0 12px 32px -16px rgba(120, 100, 70, 0.22)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
