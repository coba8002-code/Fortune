import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 리포트 계열 토큰 — 묘월의 마녀 라이트 파스텔로 리매핑
        // (의미: ink=배경, surface=카드, ivory=본문 텍스트, gold=포인트)
        ink: "#FBF7F1",
        surface: "#FFFFFF",
        ivory: "#2C2738",
        gold: "#7C6CD8",
        element: {
          wood: "#7C9A74",
          fire: "#C2705A",
          earth: "#C2A36B",
          metal: "#B4B7B2",
          water: "#6E8BA6",
        },
        // 묘월의 마녀 — 브랜드 팔레트
        witch: {
          violet: "#7C6CD8",
          violet2: "#A98BEE",
          mint: "#BFE6D2",
          peach: "#FAD7BE",
          cream: "#FBF7F1",
          ink: "#2C2738",
          muted: "#8C86A0",
          line: "#EAE4F6",
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
