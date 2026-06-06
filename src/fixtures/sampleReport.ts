/**
 * 더미 ReportData 픽스처.
 *
 * saju/elements/card 는 실제 계산·파생 로직으로 생성하고,
 * sections(본문 산문)은 LLM 단계를 대신해 손으로 작성한 플레이스홀더다.
 * → UI(STEP1~3)는 분석 파이프라인 완성을 기다리지 않고 이 데이터로 개발 가능.
 */
import type { ReportData, ReportSection, Subject } from "@/types/report";
import { calculateSaju } from "@/lib/saju/calculate";
import { buildCharacterCard, computeElementProfile } from "@/lib/report/buildCard";

const subject: Subject = {
  name: "김운명",
  birth: { date: "1991-10-08", time: "13:40", calendar: "solar" },
  gender: "female",
  birthPlace: "서울",
};

const saju = calculateSaju(subject);
const elements = computeElementProfile(saju);
const card = buildCharacterCard({ saju, profile: elements, age: 33 });

const sections: ReportSection[] = [
  {
    key: "love",
    title: "연애 분석",
    emoji: "💗",
    summary: "끌림은 빠르지만, 신뢰가 쌓여야 마음을 여는 타입.",
    body: [
      {
        type: "paragraph",
        text: "당신은 첫인상에서 강한 끌림을 느끼지만, 그 감정을 곧바로 표현하기보다 상대를 오래 관찰하는 편입니다. 안정(土)의 기운이 강해 ‘이 사람이 내 일상에 들어와도 흔들리지 않을까’를 먼저 확인합니다.",
      },
      {
        type: "list",
        items: [
          "잘 맞는 결: 솔직하고 일관된 사람",
          "지치는 결: 감정 기복이 큰 사람",
          "관계의 분기점: 신뢰가 확인되는 3개월차",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "표현을 아끼다 오해를 살 수 있어요. 작은 호감이라도 말로 한 번 더 확인해 주세요.",
      },
      { type: "gauge", label: "연애 적극성", value: 58 },
    ],
  },
  {
    key: "money",
    title: "돈 분석",
    emoji: "💰",
    summary: "한 방보다 누적. 꾸준함이 곧 자산이 되는 구조.",
    body: [
      {
        type: "paragraph",
        text: "재성의 흐름이 안정적이라 단기 베팅보다 시간을 들인 누적형 자산에서 성과가 큽니다. 충동 소비는 적지만, 사람·관계에 쓰는 비용은 과감한 편입니다.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "‘좋은 사람’에게 거절을 못 해 돈이 새는 패턴을 경계하세요.",
      },
      { type: "gauge", label: "재무 안정성", value: 72 },
    ],
  },
  {
    key: "career",
    title: "직업 분석",
    emoji: "🧭",
    summary: "판을 설계하고 사람을 모으는 자리에서 강하다.",
    body: [
      {
        type: "paragraph",
        text: "통찰력과 사람을 모으는 힘이 함께 높아, 실행 현장보다 ‘구조를 짜고 방향을 정하는’ 기획·전략 포지션에서 두각을 보입니다.",
      },
      {
        type: "list",
        items: ["잘 맞는 역할: 기획/전략/PM", "성장 키워드: 위임", "주의: 모든 책임을 혼자 지려는 경향"],
      },
    ],
  },
  {
    key: "relationship",
    title: "인간관계 분석",
    emoji: "🤝",
    summary: "넓게 알고 깊게 남긴다. 사람의 중심이 되는 유형.",
    body: [
      {
        type: "paragraph",
        text: "토의 기운은 사람들을 끌어모으는 구심점이 됩니다. 다만 모두를 챙기려다 정작 자신을 돌보지 못할 수 있습니다.",
      },
      { type: "gauge", label: "관계 구심력", value: 81 },
    ],
  },
  {
    key: "fortune",
    title: "올해 운세",
    emoji: "🔮",
    summary: "벌이기보다 다지는 해. 하반기에 결실의 문이 열린다.",
    body: [
      {
        type: "paragraph",
        text: "올해는 새로 벌이기보다 그동안 쌓아온 것을 정리하고 다지는 흐름입니다. 하반기로 갈수록 그간의 신뢰가 기회로 돌아옵니다.",
      },
      {
        type: "callout",
        tone: "highlight",
        text: "9~11월: 미뤄둔 제안을 다시 꺼내기 좋은 시기.",
      },
    ],
  },
  {
    key: "summary",
    title: "총평",
    emoji: "✨",
    summary: "조용히 판을 설계하는 전략가. 신뢰가 당신의 무기.",
    body: [
      {
        type: "paragraph",
        text: "당신은 앞에 나서서 빛나기보다, 사람과 구조를 안정적으로 엮어 결과를 만드는 사람입니다. 책임을 조금 나누는 법을 익히면, 지금의 강점이 훨씬 멀리 갑니다.",
      },
    ],
  },
];

export const sampleReport: ReportData = {
  id: "SAMPLE",
  createdAt: "2026-06-05T00:00:00.000Z",
  subject,
  saju,
  card,
  elements,
  sections,
  pdf: { status: "pending" },
};
