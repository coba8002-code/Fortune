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

// 대운별 해석(간지 기준) — 일간 己土
const NOTES: Record<string, { title: string; summary: string }> = {
  무자: { title: "토대를 다지는 유년", summary: "비겁(토)운 — 자기 기질이 굳어가는 시기. 평이하나 고집의 씨앗." },
  기축: { title: "버티며 쌓는 시기", summary: "비겁 과다 — 경쟁·비교 속에 끈기를 배우는 다소 답답한 흐름." },
  경인: { title: "재능이 깨어나는 상승기", summary: "식상(금)+관성(목) — 전문성과 사회적 자리가 함께 열리는 도약." },
  신묘: { title: "전성기 — 실력이 평판이 되다", summary: "식상+관성 — 결과물이 쌓여 ‘이름값’이 만들어지는 커리어 정점." },
  임진: { title: "거두는 시기 (현재)", summary: "재성(수)운 — 그동안의 실력이 재물·결실로. 단 토운 혼재로 정리가 과제." },
  계사: { title: "명예와 배움의 회복", summary: "재성+인성(화) — 조후가 보강되며 따뜻해지는 안정·명예의 흐름." },
  갑오: { title: "관록과 여유", summary: "관성(목)+인성(화) — 권위와 명예가 무르익는 시기, 기복은 관리 대상." },
  을미: { title: "내려놓고 누리는 흐름", summary: "관성+비겁 — 책임을 나누고 결실을 누리는 후반." },
};

const daewoon = c.daewoon.map((d) => {
  const key = `${d.stem}${d.branch}`;
  return { ...d, ...(NOTES[key] ?? {}) };
});

const events: LifeEvent[] = [
  { age: 23, year: 2002, title: "사회 진입 · 전문성 개화", text: "경인 대운 시작 — 식상과 관성이 함께 들어와 실력으로 자리를 잡기 시작하는 출발점.", tone: "up" },
  { age: 33, year: 2012, title: "커리어 정점 구간 진입", text: "신묘 대운 — 결과물이 평판으로 누적되는 전성기. ‘무엇을 만들어 냈는가’가 빛나는 10년.", tone: "up" },
  { age: 43, year: 2022, title: "거두기로 전환", text: "임진 대운 — 재성운으로 결실·재물의 시기. 벌이기보다 정리·관리가 핵심.", tone: "turn" },
  { age: 47, year: 2026, title: "병오년 — 정비와 배움", text: "조후(화) 인성운 — 내실·자격·명예를 다지기 좋은 해. 하반기 결과가 평판으로 회수.", tone: "turn" },
  { age: 53, year: 2032, title: "명예·안정의 회복기", text: "계사 대운 — 따뜻함이 더해지며 안정과 명예가 함께 오는 흐름.", tone: "up" },
];

export const sampleFortune: FortuneReport = {
  id: "DEMO1980",
  createdAt: "2026-06-06T00:00:00.000Z",
  subject,
  dayMaster: c.dayMaster,
  mainElement: c.mainElement,
  currentAge: c.currentAge,
  currentYear: c.currentYear,
  intro: {
    title: "인생의 큰 흐름",
    summary: "토대를 다지다 20~40대에 실력으로 솟구치고, 이후 거두며 깊어지는 곡선.",
    paragraphs: [
      "일간 기토(己土)는 토대를 다지며 천천히 무르익는 사람입니다. 유년의 비겁(토)운에서 자기 기질을 굳히고, 20대 중반부터 식상·관성의 금·목 대운을 만나며 ‘실력으로 인정받는’ 상승 곡선을 그립니다.",
      "30대(신묘)는 결과물이 평판이 되는 전성기, 40대(임진·현재)는 그 실력을 재물과 결실로 거두는 시기입니다. 이후 화(火) 기운이 더해지며 명예와 안정이 따뜻하게 회복됩니다.",
      "삶의 변수는 한결같이 ‘온기와 시작(목·화)’입니다. 부족한 그 기운이 들어오는 대운·세운마다 한 단계씩 도약합니다.",
    ],
  },
  daewoon,
  events,
};
