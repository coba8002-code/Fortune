/**
 * 데모 운세: 최준혁 (1980-12-02 08:30, 男).
 * 대운/점수는 computeFortune 로 계산, 제목·해석·이벤트는 손작성(실제로는 LLM).
 */
import type { FortuneReport, LifeEvent } from "@/types/fortune";
import type { Subject } from "@/types/report";
import { computeFortune } from "./compute";

const subject: Subject = {
  name: "최준혁",
  birth: { date: "1980-12-02", time: "08:30", calendar: "solar" },
  gender: "male",
};

const c = computeFortune(subject);

// 대운별 해석(간지 기준) — 일간 己土 · 중화신약 (용신: 인성 화 · 비겁 토)
const NOTES: Record<string, { title: string; summary: string }> = {
  무자: { title: "뿌리를 내리는 유년", summary: "비겁(토)이 일간을 받쳐주나 자수(재성)가 빼감 — 평이하게 기초를 다지는 시기." },
  기축: { title: "또래의 힘으로 자라는 시기", summary: "비겁(토)운 — 신약한 일간을 동료·기반이 받쳐줘 안정적으로 성장." },
  경인: { title: "힘에 부치는 도전기", summary: "식상(금)+관성(목) — 일은 많고 신약한 몸엔 부담. 재능은 분출하나 소진 주의." },
  신묘: { title: "가장 버거운 구간 — 번아웃 주의", summary: "식상+관성으로 설기·극이 겹침. 실력은 쌓이나 체력·건강 관리가 핵심." },
  임진: { title: "버티며 전환 (현재)", summary: "재성(수)으로 현실 압박이 크나 진토(비겁)가 버팀목. 무리보다 정비의 때." },
  계사: { title: "숨통이 트이는 회복기", summary: "사화(인성·조후)가 들어와 따뜻해짐 — 신약을 보강하는 반가운 전환." },
  갑오: { title: "화운 본격 — 중년 전성기", summary: "오화(인성·조후)가 일간을 든든히 생조. 명예·안정이 무르익는 회복·도약." },
  을미: { title: "안정 속에 누리는 후반", summary: "미토(비겁)가 받쳐줘 편안. 관성은 적당히 다스리며 결실을 누림." },
};

const daewoon = c.daewoon.map((d) => {
  const key = `${d.stem}${d.branch}`;
  return { ...d, ...(NOTES[key] ?? {}) };
});

const events: LifeEvent[] = [
  { age: 13, year: 2012, title: "기반을 다지는 성장기", text: "기축 비겁 대운 — 신약한 일간을 또래·환경이 받쳐줘 안정적으로 자라는 시기.", tone: "up" },
  { age: 23, year: 2002, title: "도전과 과부하의 시작", text: "경인 대운 — 식상·관성이 겹쳐 일은 많아지나 신약한 몸엔 부담. 무리·소진을 경계할 출발점.", tone: "down" },
  { age: 33, year: 2012, title: "가장 버거운 10년 · 건강 관리", text: "신묘 대운 — 설기와 극이 겹치는 최대 고비. 실력은 쌓이되 번아웃·건강을 반드시 챙길 구간.", tone: "down" },
  { age: 47, year: 2026, title: "병오년 — 숨통과 정비", text: "조후(화) 인성운 — 신약을 보강하는 따뜻한 해. 무리한 확장보다 내실·배움·재충전.", tone: "turn" },
  { age: 53, year: 2032, title: "회복기 진입", text: "계사 대운 — 사화(인성)가 들어와 기운이 살아나는 전환. 안정과 명예가 함께 오기 시작.", tone: "up" },
  { age: 63, year: 2042, title: "중년 전성기 — 화운 본격", text: "갑오 대운 — 오화가 일간을 든든히 생조. 평생 가장 안정적이고 빛나는 회복·도약기.", tone: "up" },
];

export const sampleFortune: FortuneReport = {
  id: "DEMO1980",
  createdAt: "2026-06-06T00:00:00.000Z",
  subject,
  dayMaster: c.dayMaster,
  mainElement: c.mainElement,
  strength: c.strength.label,
  currentAge: c.currentAge,
  currentYear: c.currentYear,
  intro: {
    title: "인생의 큰 흐름",
    summary: "또래의 힘으로 자라다 청년기에 힘에 부치고, 화(火) 들어오는 중년 이후 회복·전성으로 깊어지는 곡선.",
    paragraphs: [
      "일간 기토(己土)는 亥월(겨울·수왕)에 태어나 실령했고, 강한 금(식상)이 기운을 빼가 ‘중화신약’입니다. 그래서 용신은 일간을 받쳐주는 인성(화)과 비겁(토) — 화·토 기운이 들어오는 시기에 힘이 살아납니다.",
      "유년~10대(기축 비겁운)는 또래·기반이 받쳐주는 안정기, 20~30대(경인·신묘)는 식상·관성이 겹쳐 일은 많고 몸은 부치는 가장 버거운 구간입니다. 재능은 쌓이지만 소진·번아웃을 경계해야 합니다.",
      "전환점은 화(火)입니다. 50대 계사부터 사화·오화(인성·조후)가 들어오며 숨통이 트이고, 60대 갑오 대운에서 가장 안정적이고 빛나는 회복·전성기를 맞습니다. 평생의 키워드는 ‘따뜻함을 곁에 두기’입니다.",
    ],
  },
  daewoon,
  yearly: c.yearly,
  events,
};
