import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 오행(五行) 색상 팔레트
        element: {
          wood: "#3DAE5B", // 목
          fire: "#E0533D", // 화
          earth: "#C9A24B", // 토
          metal: "#B7BCC4", // 금
          water: "#3A6EA5", // 수
        },
        rank: {
          SSR: "#F4C95D",
          SR: "#B57BE0",
          R: "#5B8FE0",
          N: "#9AA0A6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
