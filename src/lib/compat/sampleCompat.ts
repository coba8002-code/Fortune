/**
 * 데모 궁합: 최준혁 × 김은경.
 * 숫자/근거는 computeCompatibility 로 계산, 글은 손으로 작성(실제로는 LLM).
 */
import type { CompatibilityReport } from "@/types/compat";
import type { ReportSection, Subject } from "@/types/report";
import { computeCompatibility } from "./compute";

const A: Subject = { name: "최준혁", birth: { date: "1980-12-02", time: "08:30", calendar: "solar" }, gender: "male", birthPlace: "" };
const B: Subject = { name: "김은경", birth: { date: "1980-09-04", time: "16:00", calendar: "solar" }, gender: "female" };

const comp = computeCompatibility(A, B);

const sections: ReportSection[] = [
  {
    key: "love",
    title: "첫 끌림",
    summary: "받쳐주는 흙과 단단한 금, 동갑의 편안함에서 시작된다.",
    body: [
      { type: "paragraph", text: "土生金의 인연이라 최준혁이 먼저 챙기고, 김은경은 그 안정감에 기댑니다. 같은 1980 경신년생이라 ‘오래 안 친구’ 같은 편안함이 바탕에 깔려, 화려한 불꽃보다 잔잔하고 든든하게 가까워집니다." },
      { type: "list", items: ["최준혁이 끌리는 점: 김은경의 단단한 줏대와 결단력", "김은경이 끌리는 점: 최준혁의 흔들림 없는 안정감과 챙김"] },
      { type: "callout", tone: "highlight", text: "먼저 다가가 품는 쪽은 최준혁, 그 안에서 빛나는 쪽은 김은경입니다." },
    ],
  },
  {
    key: "relationship",
    title: "소통 · 성향",
    summary: "둘 다 직설·실용형 — 군더더기 없지만 온기가 과제.",
    body: [
      { type: "paragraph", text: "두 사람 모두 금(金) 기운이 강해 말이 직설적이고 실용적입니다. 돌려 말하지 않아 깔끔하지만, 화(火)가 약해 ‘따뜻한 감정 표현’이 서로 부족할 수 있습니다. 사실 전달은 잘 되는데, 마음 전달이 덜 됩니다." },
      { type: "callout", tone: "tip", text: "‘그래서 고맙다/좋다’ 한마디를 붙이는 습관이 이 커플의 최고 윤활유입니다." },
    ],
  },
  {
    key: "career",
    title: "애정 표현",
    summary: "말보다 행동으로 사랑하는, 닮은 두 사람.",
    body: [
      { type: "paragraph", text: "둘 다 표현이 서툰 편이라 챙김·실용적 헌신으로 사랑을 보여줍니다. 방식이 닮아 서로 이해하기 쉽지만, 동시에 ‘표현 부족’이 둘 다라 애정이 식은 것처럼 느껴질 위험도 같이 큽니다." },
      { type: "list", items: ["공통 과제: 마음을 ‘말과 스킨십’으로 한 번 더", "해법: 한 명이 ‘온기 담당’을 자처하면 균형이 잡힘"] },
    ],
  },
  {
    key: "money",
    title: "가치관 · 돈",
    summary: "실리 감각이 잘 맞는, 현실적인 살림 궁합.",
    body: [
      { type: "paragraph", text: "김은경은 재성(현실·재물 감각)이 또렷하고, 최준혁은 기술·결과물로 버는 누적형입니다. 돈을 대하는 결이 맞아 ‘함께 모으는’ 합이 좋습니다. 다만 둘 다 주관이 강해 각자 방식을 고수하기 쉬우니 공동재정 규칙이 필요합니다." },
      { type: "gauge", label: "재정 합", value: 82 },
    ],
  },
  {
    key: "fortune",
    title: "갈등 포인트",
    summary: "두 고집의 충돌 — 식으면 냉전이 길어진다.",
    body: [
      { type: "paragraph", text: "최준혁(토)과 김은경(금) 둘 다 자기 줏대가 강합니다. ‘내가 맞다’가 부딪히면 자존심 싸움이 되고, 화(火)가 약해 먼저 풀려는 ‘온기’가 부족해 냉전이 길어질 수 있습니다. 충(沖)이 없어 폭발하진 않지만, 침묵이 위험합니다." },
      { type: "callout", tone: "warning", text: "둘 다 사과에 서툽니다 — 먼저 손 내미는 사람이 ‘지는 게 아니라 이기는’ 구조임을 기억하세요." },
    ],
  },
  {
    key: "summary",
    title: "장기 전망",
    summary: "오래갈수록 단단해지는, 동지형 관계.",
    body: [
      { type: "paragraph", text: "충이 없고 서로의 결핍을 메우며 동갑의 동지애까지 있어 시간이 지날수록 안정됩니다. 관계의 수명을 결정하는 단 하나의 변수는 ‘정서적 온도’입니다. 따뜻함을 의식적으로 더하는 만큼 오래, 깊게 갑니다." },
      { type: "list", items: ["순풍: 안정·상호보완·동지애", "변수: 표현·온기를 꾸준히 채우는 노력"] },
    ],
  },
];

export const sampleCompat: CompatibilityReport = {
  id: "DEMO",
  createdAt: "2026-06-06T00:00:00.000Z",
  a: comp.a,
  b: comp.b,
  tagline: "흙이 길러낸 금 — 받쳐주고, 빛나는 사이.",
  score: comp.score,
  basis: comp.basis,
  timeline: comp.timeline,
  sections,
  manual: {
    items: [
      { label: "함께 충전하는 법", text: "시끌벅적함보다, 조용히 같이 정리·만들기·여행계획 같은 ‘실용 데이트’에서 둘 다 편안하게 충전됩니다." },
      { label: "피해야 할 지뢰", text: "서로의 ‘내가 맞다’ 고집을 정면으로 누르는 말 + 무표정·무반응. 자존심을 건드리면 둘 다 닫힙니다." },
      { label: "화해 프로토콜", text: "둘 다 사과가 서툽니다. 한 명이 ‘온기 담당’을 자처해 작은 표현(사과·고마움)을 먼저 내밀어야 냉전이 짧아집니다." },
      { label: "오래 가는 비결", text: "의식적으로 따뜻한 말·스킨십으로 부족한 화(火)를 보강하고, 공동재정 규칙을 정하고, 서로의 영역을 존중할 것." },
    ],
    warning: "이 궁합의 강점(닮은 실용성·강한 줏대)이 곧 약점입니다. 둘 다 차갑게 식으면 누구도 먼저 데우지 않아요 — ‘온기’는 둘 중 누구의 일도 아닌, 함께 지킬 약속으로 두세요.",
  },
};
