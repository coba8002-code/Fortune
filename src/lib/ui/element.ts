import type { CardRank, Element } from "@/types/report";

/** 오행 → 색상(HEX). 웹과 SVG(PDF) 양쪽에서 동일하게 사용. */
export const ELEMENT_COLOR: Record<Element, string> = {
  목: "#3DAE5B",
  화: "#E0533D",
  토: "#C9A24B",
  금: "#B7BCC4",
  수: "#3A6EA5",
};

export const ELEMENT_LABEL: Record<Element, string> = {
  목: "목(木)",
  화: "화(火)",
  토: "토(土)",
  금: "금(金)",
  수: "수(水)",
};

export const RANK_COLOR: Record<CardRank, string> = {
  SSR: "#F4C95D",
  SR: "#B57BE0",
  R: "#5B8FE0",
  N: "#9AA0A6",
};

export function stars(n: number): string {
  return "★".repeat(n) + "☆".repeat(5 - n);
}
