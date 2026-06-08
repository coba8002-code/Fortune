/**
 * 데모 운세 2: 정소영 (1980-03-22 20:00, 女).
 * 일간 甲木 중화신약 — 용신 인성(水)·비겁(木). 대운/점수는 computeFortune, 해석은 손작성.
 */
import type { FortuneReport, LifeEvent } from "@/types/fortune";
import type { Subject } from "@/types/report";
import { computeFortune } from "./compute";

const subject: Subject = {
  name: "정소영",
  birth: { date: "1980-03-22", time: "20:00", calendar: "solar" },
  gender: "female",
};

const c = computeFortune(subject);

// 대운 해석(간지 기준) — 일간 甲木 · 중화신약 (용신: 水 인성 · 木 비겁)
const NOTES: Record<string, { title: string; summary: string }> = {
  무인: { title: "씨앗을 품는 유년", summary: "재성(토)+비겁(목) — 환경에 적응하며 기질을 키우는 평이한 출발." },
  정축: { title: "힘에 부치던 시기", summary: "식상(화)+재성(토) — 빼가는 기운이 겹쳐 신약한 일간엔 다소 버거운 흐름." },
  병자: { title: "물을 만나 살아나는 흐름", summary: "자수(인성·용신)가 들어와 배움·안정이 받쳐주는 회복의 시작." },
  을해: { title: "전성기 — 나무가 물을 만나다", summary: "비겁(목)+인성(수)이 겹친 최길 대운. 역량과 인정이 함께 오는 절정." },
  갑술: { title: "자기 힘은 강해지나 현실은 과제 (현재)", summary: "갑목(비겁)으로 주도력↑, 술토(재성)로 돈·현실 부담 혼재 — 다지는 조정기." },
  계유: { title: "배움·명예로 안정", summary: "계수(인성·용신)가 받쳐주는 안정기. 문서·명예의 운이 좋음." },
  임신: { title: "지혜가 깊어지는 흐름", summary: "임수(인성)가 일간을 든든히 생조 — 내실과 신뢰가 무르익음." },
  신미: { title: "관록 속 조절의 후반", summary: "관성(금)+재성(토) — 책임은 늘되 힘은 부쳐 건강·여유 관리가 중요." },
};

const daewoon = c.daewoon.map((d) => {
  const key = `${d.stem}${d.branch}`;
  return { ...d, ...(NOTES[key] ?? {}) };
});

const events: LifeEvent[] = [
  { age: 26, year: 2005, title: "회복의 시작", text: "병자 대운 — 자수(인성·용신)가 들어와 배움과 안정이 받쳐주기 시작.", tone: "up" },
  { age: 36, year: 2015, title: "전성기 — 가장 빛나는 10년", text: "을해 대운(목+수) — 나무가 물을 만난 최길 흐름. 역량과 인정이 함께 옵니다.", tone: "up" },
  { age: 46, year: 2025, title: "주도력↑·현실 조정 (현재)", text: "갑술 대운 — 자기 힘은 강해지나 재성(현실·돈)이 혼재. 벌이기보다 다지기.", tone: "turn" },
  { age: 47, year: 2026, title: "병오년 — 활동은 늘되 소모 주의", text: "식상(화) 세운 — 표현·활동이 활발해지나 신약한 몸엔 에너지 관리가 필요.", tone: "turn" },
  { age: 56, year: 2035, title: "명예·안정의 회복기", text: "계유 대운 — 인성(수)이 받쳐줘 배움·명예가 안정되는 흐름.", tone: "up" },
];

export const sampleFortune2: FortuneReport = {
  id: "DEMO-JSY",
  createdAt: "2026-06-06T00:00:00.000Z",
  subject,
  dayMaster: c.dayMaster,
  mainElement: c.mainElement,
  strength: c.strength.label,
  currentAge: c.currentAge,
  currentYear: c.currentYear,
  intro: {
    title: "인생의 큰 흐름",
    summary: "물을 만날 때 솟구치는 나무 — 30대 후반 전성기, 50대 이후 안정으로 깊어지는 곡선.",
    paragraphs: [
      "일간 갑목(甲木)은 봄의 큰 나무처럼 위로 뻗는 사람입니다. 卯월에 태어나 뿌리는 있으나 식상·재성·관성으로 빠지는 기운이 많아 ‘중화신약’ — 용신은 일간을 적셔주는 인성(水)과 받쳐주는 비겁(木)입니다.",
      "유년·10대(무인·정축)는 적응과 분투의 시기, 20대 후반부터 수(水) 기운이 들어오며 살아납니다. 특히 30대 후반 을해 대운(목+수)은 나무가 물을 만난 최길 흐름으로 인생의 전성기입니다.",
      "현재 갑술 대운(46~55)은 자기 주도력이 강해지되 현실(재성)의 무게가 함께 오는 다지기 구간입니다. 이후 계유·임신 인성운에서 배움과 명예로 안정되며 깊어집니다. 평생의 키워드는 ‘물(배움·여유)을 곁에 두기’입니다.",
    ],
  },
  daewoon,
  yearly: c.yearly,
  events,
};
