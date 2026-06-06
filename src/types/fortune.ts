/**
 * 운세(Fortune Timeline) 리포트 — 10년 대운 + 인생 그래프 + 주요 이벤트.
 */
import type { Element, HeavenlyStem, EarthlyBranch, Subject } from "@/types/report";
import type { TenGodCategory } from "@/lib/saju/constants";

export interface Daewoon {
  index: number;
  startAge: number; // 세는나이 기준 시작
  endAge: number;
  startYear: number;
  endYear: number;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemElement: Element;
  branchElement: Element;
  /** 천간 기준 십성 */
  tenGod: TenGodCategory;
  /** 흐름 점수(0~100, 인생 그래프용) */
  score: number;
  current: boolean;
  title?: string;
  summary?: string;
}

export interface LifeEvent {
  age: number;
  year: number;
  title: string;
  text: string;
  tone?: "up" | "down" | "turn";
}

export interface FortuneReport {
  id: string;
  createdAt: string;
  subject: Subject;
  dayMaster: HeavenlyStem;
  mainElement: Element;
  /** 신강/신약 판정 라벨 (용신 방향 근거) */
  strength: string;
  currentAge: number;
  currentYear: number;
  intro: { title: string; summary: string; paragraphs: string[] };
  daewoon: Daewoon[];
  events: LifeEvent[];
}
