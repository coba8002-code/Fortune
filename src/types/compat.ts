/**
 * 궁합(Compatibility) 리포트 타입.
 * 두 사람의 SajuChart 를 입력으로, 관계(케미)를 단일 소스로 표현한다.
 */
import type { Element, ElementProfile, ReportSection, SajuChart, Subject } from "@/types/report";

export interface CompatPerson {
  subject: Subject;
  saju: SajuChart;
  elements: ElementProfile;
  /** 캐릭터 카드 타이틀(별명) */
  title: string;
  mainElement: Element;
}

export interface CompatScore {
  total: number; // 0~100
  grade: "SSR" | "SR" | "R" | "N";
  breakdown: {
    attraction: number; // 끌림
    comm: number; // 소통
    stability: number; // 안정
    growth: number; // 성장
    friction: number; // 마찰(높을수록 충돌↑)
  };
}

export interface CompatBasisRow {
  label: string;
  text: string;
}

export interface CompatArea {
  key: "family" | "children";
  label: string;
  score: number;
  text: string;
}

export interface RelationshipManual {
  items: { label: string; text: string }[];
  warning: string;
}

export interface CompatibilityReport {
  id: string;
  createdAt: string;
  a: CompatPerson;
  b: CompatPerson;
  tagline: string;
  score: CompatScore;
  basis: CompatBasisRow[];
  /** 연도별 관계 흐름(세운) */
  timeline: { year: number; score: number }[];
  /** 가족운·자식운 */
  areas: CompatArea[];
  sections: ReportSection[];
  manual: RelationshipManual;
}
