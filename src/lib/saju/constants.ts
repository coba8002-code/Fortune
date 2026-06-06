/**
 * 천간(天干)·지지(地支)·오행(五行) 상수와 관계 함수.
 * 사주 계산의 기반이 되는 격리된 데이터 테이블.
 */
import type { EarthlyBranch, Element, HeavenlyStem } from "@/types/report";

/** 천간 10개 (순서 고정: 인덱스 % 10) */
export const STEMS: HeavenlyStem[] = [
  "갑", "을", "병", "정", "무", "기", "경", "신", "임", "계",
];

/** 지지 12개 (순서 고정: 인덱스 % 12, 0 = 자) */
export const BRANCHES: EarthlyBranch[] = [
  "자", "축", "인", "묘", "진", "사",
  "오", "미", "신", "유", "술", "해",
];

/** 천간 → 오행 */
export const STEM_ELEMENT: Record<HeavenlyStem, Element> = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

/** 지지 → 오행 (대표 오행, 본기 기준) */
export const BRANCH_ELEMENT: Record<EarthlyBranch, Element> = {
  인: "목", 묘: "목",
  사: "화", 오: "화",
  진: "토", 술: "토", 축: "토", 미: "토",
  신: "금", 유: "금",
  자: "수", 해: "수",
};

/** 오행 상생 순환: key 가 value 를 생(生)한다. 목→화→토→금→수→목 */
export const GENERATES: Record<Element, Element> = {
  목: "화", 화: "토", 토: "금", 금: "수", 수: "목",
};

/** 오행 상극 순환: key 가 value 를 극(剋)한다. 목→토→수→화→금→목 */
export const CONTROLS: Record<Element, Element> = {
  목: "토", 토: "수", 수: "화", 화: "금", 금: "목",
};

export const ELEMENTS: Element[] = ["목", "화", "토", "금", "수"];

/** 천간이 양(陽)인가 — 인덱스 짝수(갑·병·무·경·임)가 양 */
export function isYangStem(stem: HeavenlyStem): boolean {
  return STEMS.indexOf(stem) % 2 === 0;
}

/**
 * 십성(十星) 5대 분류: 일간(day master) 오행 D 기준으로 상대 오행 X 의 관계.
 * 비겁(같음) / 식상(D가 X를 생) / 재성(D가 X를 극) / 관성(X가 D를 극) / 인성(X가 D를 생)
 */
export type TenGodCategory = "비겁" | "식상" | "재성" | "관성" | "인성";

export function tenGodCategory(dayElement: Element, other: Element): TenGodCategory {
  if (other === dayElement) return "비겁";
  if (GENERATES[dayElement] === other) return "식상";
  if (CONTROLS[dayElement] === other) return "재성";
  if (CONTROLS[other] === dayElement) return "관성";
  if (GENERATES[other] === dayElement) return "인성";
  // 위 5개로 모든 경우가 분류됨 (방어용)
  return "비겁";
}
