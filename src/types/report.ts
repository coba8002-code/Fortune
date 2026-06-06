/**
 * ReportData — Single Source of Truth.
 *
 * 분석 파이프라인이 만들고, 웹·PDF가 함께 소비하는 하나의 데이터 구조.
 * UI는 이 타입만 보고 렌더링한다(데이터와 표현의 분리).
 *
 * 설계 근거: docs/REPORT_MODEL.md
 */

// ── 오행 / 천간 / 지지 ────────────────────────────────────────────────
export type Element = "목" | "화" | "토" | "금" | "수";

export type HeavenlyStem =
  | "갑" | "을" | "병" | "정" | "무"
  | "기" | "경" | "신" | "임" | "계";

export type EarthlyBranch =
  | "자" | "축" | "인" | "묘" | "진" | "사"
  | "오" | "미" | "신" | "유" | "술" | "해";

// ── 입력값 ────────────────────────────────────────────────────────────
export interface Subject {
  /** 호칭용 이름 */
  name: string;
  birth: {
    /** 양력 기준으로 저장 (음력 입력은 변환 후 저장) "1995-03-21" */
    date: string;
    /** "13:40" — 모르면 생략(시주 제외) */
    time?: string;
    calendar: "solar" | "lunar";
    /** 음력 윤달 여부 */
    isLeapMonth?: boolean;
  };
  gender: "male" | "female";
  /** 진태양시 보정용(선택) */
  birthPlace?: string;
}

// ── 사주 원국 ──────────────────────────────────────────────────────────
export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  /** 해당 주(柱)의 대표 오행(천간 기준) */
  element: Element;
}

/** 십성 분포 (비겁/식상/재성/관성/인성) */
export interface TenGodCount {
  비겁: number;
  식상: number;
  재성: number;
  관성: number;
  인성: number;
}

export interface SajuChart {
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    /** 출생시각 미상이면 없음 */
    hour?: Pillar;
  };
  /** 일간(나를 대표하는 천간) = pillars.day.stem */
  dayMaster: HeavenlyStem;
  tenGods: TenGodCount;
}

// ── STEP1: SSR 캐릭터 카드 ────────────────────────────────────────────
export type CardRank = "SSR" | "SR" | "R" | "N";

export interface Skill {
  name: string;
  stars: 1 | 2 | 3 | 4 | 5;
  description?: string;
}

export interface CharacterCard {
  rank: CardRank;
  title: string; // "전략가"
  level: number; // 46
  mainElement: Element; // 주속성
  job: string; // "기획자"
  stats: {
    insight: number; // 통찰
    leadership: number; // 통솔
    creativity: number; // 창의
    stability: number; // 안정
    drive: number; // 추진
  };
  skills: {
    main: Skill;
    passive: Skill;
    weakness: Skill;
  };
}

// ── 오행 프로파일 (그래프용) ──────────────────────────────────────────
export interface ElementProfile {
  scores: Record<Element, number>;
  dominant: Element;
  lacking: Element;
}

// ── STEP2: 스크롤 리포트 본문 ─────────────────────────────────────────
export type SectionKey =
  | "love"
  | "money"
  | "career"
  | "relationship"
  | "fortune"
  | "summary";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; tone: "tip" | "warning" | "highlight"; text: string }
  | { type: "gauge"; label: string; value: number };

export interface ReportSection {
  key: SectionKey;
  title: string;
  emoji?: string;
  summary: string;
  body: ContentBlock[];
}

// ── STEP3 / STEP4: 산출물 메타 ────────────────────────────────────────
export interface PdfArtifact {
  status: "pending" | "ready" | "failed";
  url?: string;
  bytes?: number;
  generatedAt?: string;
}

export interface AvatarArtifact {
  status: "pending" | "ready" | "failed";
  videoUrl?: string;
  script?: string;
}

// ── 최상위 ────────────────────────────────────────────────────────────
export interface ReportData {
  id: string;
  createdAt: string;
  subject: Subject;
  saju: SajuChart;
  card: CharacterCard;
  elements: ElementProfile;
  sections: ReportSection[];
  pdf?: PdfArtifact;
  avatar?: AvatarArtifact;
}
