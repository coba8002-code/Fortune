/**
 * 데모 궁합 2: 최준혁 × 정소영.
 * 己土(중화신약) × 甲木 — 갑기합(천간합)으로 강한 끌림, 지지 충2(묘유·진술)로 역동·마찰.
 * 숫자/점수는 computeCompatibility, 근거·글은 손작성(실제로는 LLM).
 */
import type { CompatibilityReport, CompatBasisRow } from "@/types/compat";
import type { ReportSection, Subject } from "@/types/report";
import { computeCompatibility } from "./compute";

const A: Subject = { name: "최준혁", birth: { date: "1980-12-02", time: "08:30", calendar: "solar" }, gender: "male" };
const B: Subject = { name: "정소영", birth: { date: "1980-03-22", time: "20:00", calendar: "solar" }, gender: "female" };

const comp = computeCompatibility(A, B);

// 갑기합·충2를 반영한 근거(자동 basis 대신 직접 작성)
const basis: CompatBasisRow[] = [
  { label: "일간 관계", text: "己土 ↔ 甲木 — 갑기합(甲己合). 천간이 맞붙어 강하게 끌리는 ‘일간합’ 인연. 최준혁에겐 정소영이 관성(자극·이끎), 정소영에겐 최준혁이 재성(취함)." },
  { label: "동질 코드", text: "둘 다 1980 경신년 동갑 — 친구 같은 동지애가 바탕." },
  { label: "지지 합·충", text: "합 0 · 충 2(卯酉·辰戌) — 끌림만큼 부딪힘도 큰 ‘자극형’ 역동. 안정보다 긴장이 동력." },
  { label: "오행 보완", text: "최준혁의 비어 있는 목(木·추진)을 정소영이 강하게 공급. 단, 신약한 최준혁에겐 목(관성)이 자극이자 부담이 될 수 있음." },
  { label: "공통 과제", text: "두 사람 모두 화(火)가 약함 — 정서적 온기는 의식적으로 함께 키워야." },
  ...comp.extras, // 삼합·방합 / 형·해 / 배우자궁 / 공망 (자동 계산)
];

const sections: ReportSection[] = [
  {
    key: "love",
    title: "첫 끌림",
    summary: "정반대 기질이 천간합으로 강하게 끌어당긴다.",
    body: [
      { type: "paragraph", text: "己土와 甲木의 갑기합 — 사주 궁합에서 가장 강한 끌림 중 하나입니다. 단단히 다지는 흙(최준혁)과 위로 뻗는 나무(정소영), 정반대 기질이라 서로에게 ‘나에게 없는 것’으로 강하게 빠집니다. 같은 1980 경신년 동갑이라 편안함까지 깔려 있습니다." },
      { type: "list", items: ["최준혁이 끌리는 점: 정소영의 추진력과 새로움을 여는 에너지", "정소영이 끌리는 점: 최준혁의 흔들림 없는 안정감과 받쳐주는 힘"] },
      { type: "callout", tone: "highlight", text: "끌림 자체는 최상급입니다. 문제는 끌림이 아니라 ‘부딪힘을 어떻게 다루느냐’입니다." },
    ],
  },
  {
    key: "relationship",
    title: "소통 · 성향",
    summary: "직진하는 나무와 신중한 흙 — 속도차가 충(沖)으로 드러난다.",
    body: [
      { type: "paragraph", text: "정소영은 목(木)답게 방향이 정해지면 직진하고, 최준혁은 토(土)답게 신중하게 다집니다. 지지에 충이 둘(卯酉·辰戌)이라 대화가 쉽게 부딪히고, 한쪽이 밀면 한쪽이 버티는 구도가 됩니다." },
      { type: "callout", tone: "tip", text: "정소영은 ‘결론 재촉’을 한 박자 늦추고, 최준혁은 ‘반응’을 한 박자 당기면 충이 시너지로 바뀝니다." },
    ],
  },
  {
    key: "career",
    title: "애정 표현",
    summary: "둘 다 화(火)가 약해 표현이 서툰 편.",
    body: [
      { type: "paragraph", text: "정소영이 좀 더 적극적으로 다가가고, 최준혁은 행동으로 챙깁니다. 둘 다 따뜻한 말·감정 표현이 약한 편이라, 끌림이 큰 만큼 ‘표현 부족’으로 인한 서운함도 커질 수 있습니다." },
      { type: "list", items: ["정소영: 추진하되 최준혁의 속도를 기다려 주기", "최준혁: 마음을 ‘말로’ 먼저 건네기"] },
    ],
  },
  {
    key: "money",
    title: "가치관 · 돈",
    summary: "현실 감각은 맞지만 주관이 둘 다 강하다.",
    body: [
      { type: "paragraph", text: "정소영은 재성(현실·재물 감각)이 또렷하고 최준혁은 누적형이라 ‘함께 모으는’ 결은 맞습니다. 다만 둘 다 비겁이 강해 각자 방식을 고수하기 쉬우니, 공동재정은 ‘규칙’으로 묶어야 합니다." },
      { type: "gauge", label: "재정 합", value: 74 },
    ],
  },
  {
    key: "fortune",
    title: "갈등 포인트",
    summary: "충 2개가 핵심 — 방식·영역 충돌과 ‘몰아붙임’.",
    body: [
      { type: "paragraph", text: "卯酉충은 가치관·방식의 충돌, 辰戌충은 고집·영역의 충돌로 드러납니다. 특히 정소영의 강한 추진(목·관성)이 신약한 최준혁을 몰아붙이면, 최준혁은 입을 닫고 버티며 냉전이 길어집니다. 이 커플의 최대 위험 구간입니다." },
      { type: "callout", tone: "warning", text: "‘다름’을 ‘틀림’으로 받는 순간 충은 소모가 됩니다. 다름을 자극(성장)으로 돌리는 합의가 필요합니다." },
    ],
  },
  {
    key: "summary",
    title: "장기 전망",
    summary: "끌림·성장은 크고 안정은 낮은, 노력형 관계.",
    body: [
      { type: "paragraph", text: "갑기합의 끌림과 상호 보완(정소영이 최준혁의 부족한 추진을 채움)으로 성장 잠재력은 큽니다. 그러나 충 2개로 안정성은 낮아, ‘서로의 속도 존중 + 온기 보강’이라는 숙제를 풀어야 오래갑니다. 풀면 서로를 가장 크게 키워주는 짝입니다." },
      { type: "list", items: ["순풍: 강한 끌림(갑기합)·상호 보완·동지애", "변수: 충(부딪힘)을 자극으로 쓸지, 소모로 둘지"] },
    ],
  },
];

export const sampleCompat2: CompatibilityReport = {
  id: "DEMO2",
  createdAt: "2026-06-06T00:00:00.000Z",
  a: comp.a,
  b: comp.b,
  tagline: "강하게 끌리고, 강하게 부딪히는 — 자극으로 자라는 사이.",
  score: comp.score,
  basis,
  timeline: comp.timeline,
  areas: comp.areas,
  sections,
  manual: {
    items: [
      { label: "함께 충전하는 법", text: "정소영이 새로운 자극(여행·새 시도)을 제안하고, 최준혁이 그것을 안정적으로 받쳐 실행하는 조합이 둘 다 살아납니다." },
      { label: "피해야 할 지뢰", text: "정소영의 ‘빨리 결정해’ 몰아붙임 + 최준혁의 ‘내 방식이 맞아’ 버팀. 충이 정면으로 부딪히는 순간입니다." },
      { label: "화해 프로토콜", text: "둘 다 자존심이 세고 표현이 서툽니다. 식힐 시간을 준 뒤, 정소영은 먼저 말로·최준혁은 행동으로 손 내밀면 빠르게 풀립니다." },
      { label: "오래 가는 비결", text: "충(다름)을 성장 동력으로 합의하고, 서로의 속도를 존중하며, 부족한 화(따뜻한 표현)를 함께 채울 것." },
    ],
    warning: "충이 둘이라 끌림이 식으면 마찰만 남기 쉽습니다. ‘다름’을 자극으로 쓰는 동안엔 최고의 성장 파트너지만, 소모로 두면 가장 지치는 관계가 됩니다.",
  },
};
