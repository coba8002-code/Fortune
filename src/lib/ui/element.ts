import type { CardRank, Element } from "@/types/report";

/**
 * 럭셔리 팔레트 — 채도를 낮춘 오행색 + 금(金) 액센트.
 * 강한 원색 대신 먹빛 배경에 어울리는 절제된 톤으로 고급감을 낸다.
 */
export const ELEMENT_COLOR: Record<Element, string> = {
  목: "#7C9A74", // 세이지
  화: "#C2705A", // 테라코타
  토: "#C2A36B", // 황토/샴페인
  금: "#B4B7B2", // 실버그레이
  수: "#6E8BA6", // 슬레이트 블루
};

export const ELEMENT_LABEL: Record<Element, string> = {
  목: "목 木",
  화: "화 火",
  토: "토 土",
  금: "금 金",
  수: "수 水",
};

/** 천간/오행 한자 (장식·각인용) */
export const ELEMENT_HANJA: Record<Element, string> = {
  목: "木", 화: "火", 토: "土", 금: "金", 수: "水",
};

export const RANK_COLOR: Record<CardRank, string> = {
  SSR: "#D8BD7E", // 골드
  SR: "#C2B49A", // 샴페인
  R: "#9FB0C0", // 페일 블루
  N: "#9A968B", // 토프
};

/** 금박 액센트 */
export const GOLD = "#C4A35A";
export const GOLD_SOFT = "rgba(196,163,90,0.16)";

/** 5단계 스킬 미터를 채움 개수로 표현(이모지 대신 세그먼트). */
export function meterFill(stars: number): boolean[] {
  return [1, 2, 3, 4, 5].map((i) => i <= stars);
}
