/**
 * 취급설명서(User Manual) — 공유 밈 포맷.
 *
 * 사주를 "이 사람 다루는 법" 설명서로 번역한 카드. 연인·친구에게 보내는 공유 포맷.
 * 단일 소스(ReportData) 위에 얹는 파생 콘텐츠 — 수치/모델명은 계산, 문구는 LLM.
 */
import type { CardRank, Element } from "@/types/report";

export interface ManualItem {
  /** 섹션 아이콘(이모지) */
  icon: string;
  /** 설명서 항목명 (예: "전원 켜는 법") */
  label: string;
  /** 본문 한두 줄 */
  text: string;
}

export interface UserManual {
  id: string;
  /** 호칭 (예: "1980.12.02생") */
  subjectName: string;
  rank: CardRank;
  /** 모델명 (예: "장인형(己土)") */
  modelName: string;
  /** 출고 정보 (예: "1980년형 · 주성분 토·금") */
  releaseInfo: string;
  mainElement: Element;
  /** 한 줄 취급주의 경고 */
  warning: string;
  items: ManualItem[];
}
