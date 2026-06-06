/**
 * 궁합 계산 (결정론) — 두 사주에서 일간 관계·지지 합충·오행 보완·점수를 산출한다.
 * 글(섹션/설명서)은 LLM 이, 숫자/근거는 이 모듈이 담당한다.
 */
import type { EarthlyBranch, Element, HeavenlyStem, Subject } from "@/types/report";
import type { CompatBasisRow, CompatPerson, CompatScore } from "@/types/compat";
import { calculateSaju } from "@/lib/saju/calculate";
import { GENERATES, CONTROLS, ELEMENTS, STEM_ELEMENT } from "@/lib/saju/constants";
import { ELEMENT_HANJA } from "@/lib/ui/element";
import { buildCharacterCard, computeElementProfile } from "@/lib/report/buildCard";

// 지지 육합 / 충
const SIX_HARMONY: Record<EarthlyBranch, EarthlyBranch> = {
  자: "축", 축: "자", 인: "해", 해: "인", 묘: "술", 술: "묘",
  진: "유", 유: "진", 사: "신", 신: "사", 오: "미", 미: "오",
};
const CLASH: Record<EarthlyBranch, EarthlyBranch> = {
  자: "오", 오: "자", 축: "미", 미: "축", 인: "신", 신: "인",
  묘: "유", 유: "묘", 진: "술", 술: "진", 사: "해", 해: "사",
};

// 천간 오합(五合): 갑기·을경·병신·정임·무계
const STEM_HARMONY: Record<HeavenlyStem, HeavenlyStem> = {
  갑: "기", 기: "갑", 을: "경", 경: "을", 병: "신", 신: "병", 정: "임", 임: "정", 무: "계", 계: "무",
};

const STEM_HANJA: Record<string, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

export type RelationCategory = "비겁" | "식상" | "재성" | "관성" | "인성";

/** 일간(주체) 오행 D 기준, 상대 오행 X 의 관계 */
export function dayRelation(D: Element, X: Element): RelationCategory {
  if (X === D) return "비겁";
  if (GENERATES[D] === X) return "식상";
  if (CONTROLS[D] === X) return "재성";
  if (CONTROLS[X] === D) return "관성";
  return "인성"; // GENERATES[X] === D
}

function toPerson(subject: Subject): CompatPerson {
  const saju = calculateSaju(subject);
  const elements = computeElementProfile(saju);
  const card = buildCharacterCard({ saju, profile: elements });
  return { subject, saju, elements, title: card.title, mainElement: card.mainElement };
}

function branchesOf(p: CompatPerson): EarthlyBranch[] {
  const pl = p.saju.pillars;
  return [pl.year.branch, pl.month.branch, pl.day.branch, ...(pl.hour ? [pl.hour.branch] : [])];
}
function stemsOf(p: CompatPerson): HeavenlyStem[] {
  const pl = p.saju.pillars;
  return [pl.year.stem, pl.month.stem, pl.day.stem, ...(pl.hour ? [pl.hour.stem] : [])];
}

const dayEl = (p: CompatPerson): Element => STEM_ELEMENT[p.saju.dayMaster];
const stemHanja = (p: CompatPerson): string =>
  `${STEM_HANJA[p.saju.dayMaster]}${ELEMENT_HANJA[dayEl(p)]}`;
const relName = (r: RelationCategory): string =>
  ({ 비겁: "비겁(동질)", 식상: "식상(생함)", 재성: "재성(취함)", 관성: "관성(통제)", 인성: "인성(받쳐줌)" })[r];

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const grade = (t: number): CompatScore["grade"] =>
  t >= 90 ? "SSR" : t >= 80 ? "SR" : t >= 65 ? "R" : "N";

export interface CompatComputation {
  a: CompatPerson;
  b: CompatPerson;
  aToB: RelationCategory;
  bToA: RelationCategory;
  haps: string[];
  chungs: string[];
  /** 천간합 쌍(한자) */
  stemHaps: string[];
  /** 일간합(두 일간이 천간합) */
  dayStemHarmony: boolean;
  complement: number;
  sharedYearPillar: boolean;
  score: CompatScore;
  basis: CompatBasisRow[];
}

export function computeCompatibility(subjA: Subject, subjB: Subject): CompatComputation {
  const a = toPerson(subjA);
  const b = toPerson(subjB);
  const aDay = dayEl(a);
  const bDay = dayEl(b);
  const aToB = dayRelation(aDay, bDay);
  const bToA = dayRelation(bDay, aDay);

  const ab = branchesOf(a);
  const bb = branchesOf(b);
  const haps: string[] = [];
  const chungs: string[] = [];
  for (const x of ab)
    for (const y of bb) {
      if (SIX_HARMONY[x] === y) haps.push(x + y);
      if (CLASH[x] === y) chungs.push(x + y);
    }

  // 천간합 (오합) — 두 사주 천간 간 교차
  const aStems = stemsOf(a);
  const bStems = stemsOf(b);
  const stemHaps: string[] = [];
  for (const x of aStems)
    for (const y of bStems) if (STEM_HARMONY[x] === y) stemHaps.push(`${STEM_HANJA[x]}${STEM_HANJA[y]}`);
  const dayStemHarmony = STEM_HARMONY[a.saju.dayMaster] === b.saju.dayMaster;

  let complement = 0;
  for (const e of ELEMENTS) {
    if (a.elements.scores[e] === 0 && b.elements.scores[e] > 0) complement++;
    if (b.elements.scores[e] === 0 && a.elements.scores[e] > 0) complement++;
  }

  const sharedYearPillar =
    a.saju.pillars.year.stem === b.saju.pillars.year.stem &&
    a.saju.pillars.year.branch === b.saju.pillars.year.branch;

  const relPull: Record<RelationCategory, number> = {
    재성: 86, 관성: 84, 식상: 80, 인성: 78, 비겁: 70,
  };
  // 천간합 가산: 일간합은 강한 끌림(+10), 그 외 천간합도 소폭 가산
  const harmonyBonus = (dayStemHarmony ? 10 : 0) + Math.min(stemHaps.length, 3) * 2;
  const attraction = clamp((relPull[aToB] + relPull[bToA]) / 2 + complement * 2 + harmonyBonus);
  const fireSum = a.elements.scores["화"] + b.elements.scores["화"];
  const comm = clamp(58 + fireSum * 6 - chungs.length * 4);
  const stability = clamp(70 + haps.length * 8 - chungs.length * 12 + (sharedYearPillar ? 8 : 0) + (dayStemHarmony ? 3 : 0));
  const growth = clamp(64 + complement * 7);
  const biSum = a.saju.tenGods.비겁 + b.saju.tenGods.비겁;
  const friction = clamp(28 + biSum * 3 + chungs.length * 10 - haps.length * 3);
  const total = clamp(
    0.25 * attraction + 0.15 * comm + 0.3 * stability + 0.3 * growth - 0.08 * friction + 4,
  );

  const score: CompatScore = {
    total,
    grade: grade(total),
    breakdown: { attraction, comm, stability, growth, friction },
  };

  const basis: CompatBasisRow[] = [
    {
      label: "일간 관계",
      text: `${stemHanja(a)} → ${stemHanja(b)}, ${relName(aToB)} — ${a.subject.name}이(가) ${b.subject.name}을(를) ${aToB === "식상" || aToB === "재성" ? "이끄는" : "받쳐주는"} 결.`,
    },
    sharedYearPillar
      ? { label: "동질 코드", text: "같은 해(년주)에 태어난 동갑·동기 — 친구 같은 동지애가 바탕." }
      : { label: "오행 주속성", text: `${ELEMENT_HANJA[a.mainElement]}(${a.mainElement}) × ${ELEMENT_HANJA[b.mainElement]}(${b.mainElement})의 만남.` },
    {
      label: "지지 합·충",
      text: `합(合) ${haps.length} · 충(沖) ${chungs.length} — ${chungs.length === 0 ? "큰 파국 없이 안정적으로 묶이는 구조." : "끌림과 긴장이 함께 있는 역동."}`,
    },
    {
      label: "오행 보완",
      text: complement > 0 ? "서로의 부족한 기운을 채워주는 상생 구조." : "비슷한 기운이라 편안하지만 새 자극은 적은 편.",
    },
  ];
  // 천간합 근거 (일간합 우선)
  if (dayStemHarmony) {
    basis.splice(1, 0, {
      label: "천간합",
      text: `${stemHanja(a).slice(0, 1)}${stemHanja(b).slice(0, 1)}合 (일간합) — 두 일간이 천간으로 맞붙어 강하게 끌리는 인연. 끌림의 핵심 동력.`,
    });
  } else if (stemHaps.length) {
    basis.splice(1, 0, {
      label: "천간합",
      text: `${[...new Set(stemHaps)].join(", ")} — 천간이 어우러져 정서적으로 부드럽게 묶이는 면이 있음.`,
    });
  }

  const bothLack = ELEMENTS.filter((e) => a.elements.scores[e] === 0 && b.elements.scores[e] === 0);
  if (bothLack.length) {
    basis.push({
      label: "공통 과제",
      text: `두 사람 모두 ${bothLack.map((e) => `${ELEMENT_HANJA[e]}(${e})`).join("·")} 기운이 비어 있음 — 그 영역을 의식적으로 보완해야.`,
    });
  }

  return { a, b, aToB, bToA, haps, chungs, stemHaps, dayStemHarmony, complement, sharedYearPillar, score, basis };
}
