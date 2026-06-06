/**
 * ReportData → UserManual 파생.
 *
 * 모델명/출고정보/등급/주속성은 결정론적으로 계산하고, 항목 문구(items)와
 * 경고(warning)는 LLM 이 채운다(데이터/표현 분리). 리포트와 동일한 단일 소스 위에 얹는다.
 */
import type { ReportData, HeavenlyStem, Element } from "@/types/report";
import type { ManualItem, UserManual } from "@/types/manual";

export interface ManualContent {
  items: ManualItem[];
  warning: string;
}

/** 천간 한글 → 한자 (모델명 표기용) */
const STEM_HANJA: Record<HeavenlyStem, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

const ELEMENT_HANJA: Record<Element, string> = {
  목: "木", 화: "火", 토: "土", 금: "金", 수: "水",
};

export interface BuildManualOptions {
  /** LLM 생성 함수 주입(테스트/대체용). */
  generate: (report: ReportData) => Promise<ManualContent>;
}

export async function buildUserManual(
  report: ReportData,
  { generate }: BuildManualOptions,
): Promise<UserManual> {
  const { card, saju, elements, subject } = report;
  const dm = saju.dayMaster;
  const modelName = `${card.title}형(${STEM_HANJA[dm]}${ELEMENT_HANJA[card.mainElement]})`;

  // 출고정보: 출생연도 + 상위 2개 오행
  const year = subject.birth.date.slice(0, 4);
  const top2 = (Object.entries(elements.scores) as [Element, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([e]) => e)
    .join("·");

  const { items, warning } = await generate(report);

  return {
    id: report.id,
    subjectName: subject.name,
    rank: card.rank,
    modelName,
    releaseInfo: `${year}년형 · 주성분 ${top2}`,
    mainElement: card.mainElement,
    warning,
    items,
  };
}
