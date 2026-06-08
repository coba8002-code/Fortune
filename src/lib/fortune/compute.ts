/**
 * 운세 계산 (결정론) — 10년 대운 산출 + 흐름 점수(인생 그래프).
 * 대운은 검증된 lunar-javascript(getYun)로 계산. 점수는 억부 용신(신강) 휴리스틱.
 */
import { Solar, Lunar } from "lunar-javascript";
import type { Element, Subject } from "@/types/report";
import type { Daewoon, YearPoint } from "@/types/fortune";
import { STEM_ELEMENT, BRANCH_ELEMENT, STEMS, BRANCHES, tenGodCategory } from "@/lib/saju/constants";
import { calculateSaju } from "@/lib/saju/calculate";
import type { SajuChart } from "@/types/report";

const GAN_CN = "甲乙丙丁戊己庚辛壬癸";
const ZHI_CN = "子丑寅卯辰巳午未申酉戌亥";

export interface BodyStrength {
  strong: boolean;
  label: string; // 신강 / 중화신강 / 중화신약 / 신약
  support: number;
  drain: number;
}

/**
 * 신강/신약 추정 — 일간을 돕는 세력(비겁+인성) vs 빼는 세력(식상+재성+관성),
 * 월령(月令) 가중 포함. 정밀 격국 분석은 아니나 용신 방향을 잡는 휴리스틱.
 */
export function estimateStrength(saju: SajuChart): BodyStrength {
  const dayEl = STEM_ELEMENT[saju.dayMaster];
  const tg = saju.tenGods;
  let support = tg.비겁 + tg.인성;
  let drain = tg.식상 + tg.재성 + tg.관성;
  const monthCat = tenGodCategory(dayEl, BRANCH_ELEMENT[saju.pillars.month.branch]);
  if (monthCat === "비겁" || monthCat === "인성") support += 2;
  else drain += 2; // 실령(월령이 빼는 오행)이면 약화
  const diff = support - drain;
  const strong = diff > 0;
  const label = Math.abs(diff) <= 3 ? (strong ? "중화신강" : "중화신약") : strong ? "신강" : "신약";
  return { strong, label, support, drain };
}

/**
 * 억부 용신 휴리스틱(신강/신약에 따라 방향이 반대).
 * - 신강: 일간을 빼주는 식상·재성·관성이 길(+), 보태는 인성·비겁이 흉(−).
 * - 신약: 일간을 돕는 인성·비겁이 길(+), 빼가는 식상·재성·관성이 흉(−).
 */
function favorByElement(dayElement: Element, strong: boolean): Record<Element, number> {
  const fav: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  (Object.keys(fav) as Element[]).forEach((e) => {
    const cat = tenGodCategory(dayElement, e);
    if (strong) {
      fav[e] = cat === "비겁" ? -2 : cat === "인성" ? -1 : 2; // 식상/재성/관성 +2
    } else {
      // 신약: 인성(생조)이 최우선 용신, 비겁(부조) 보조
      fav[e] = cat === "인성" ? 3 : cat === "비겁" ? 1 : cat === "관성" ? -1 : -2; // 식상/재성 -2
    }
  });
  return fav;
}

const clamp = (n: number, lo = 20, hi = 94) => Math.max(lo, Math.min(hi, Math.round(n)));

/** 세운(연 간지) — 연도에서 직접 산출. 1984 → 갑자. */
function yearGanzhi(year: number) {
  const s = (((year - 4) % 10) + 10) % 10;
  const b = (((year - 4) % 12) + 12) % 12;
  return { stem: STEMS[s], branch: BRANCHES[b] };
}

/** 영역별(금전·연애·건강) 오행 길흉 가중. 신약/신강·성별 반영. */
function domainFavor(
  dayElement: Element,
  gender: "male" | "female",
  domain: "money" | "love" | "health",
  strong: boolean,
): Record<Element, number> {
  const f: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  (Object.keys(f) as Element[]).forEach((e) => {
    const cat = tenGodCategory(dayElement, e);
    if (domain === "health") {
      // 건강 = 일간 강약(용신) — 신약이면 인성/비겁이 길
      f[e] = strong
        ? cat === "비겁" ? -2 : cat === "인성" ? -1 : 2
        : cat === "인성" ? 3 : cat === "비겁" ? 1 : cat === "관성" ? -1 : -2;
    } else if (domain === "money") {
      // 재물 = 식상생재 라인(식상·재성), 비겁은 감당
      f[e] = cat === "식상" ? 2 : cat === "재성" ? 2 : cat === "비겁" ? 1 : -1;
    } else {
      // 연애 = 배우자성(남=재성, 여=관성) 활성 + 매력(식상), 비겁은 경쟁
      if (gender === "male") f[e] = cat === "재성" ? 3 : cat === "식상" ? 1 : cat === "비겁" ? -2 : cat === "관성" ? -1 : 0;
      else f[e] = cat === "관성" ? 3 : cat === "식상" ? 1 : cat === "비겁" ? -2 : cat === "재성" ? -1 : 0;
    }
  });
  return f;
}

export function computeFortune(subject: Subject): {
  dayMaster: Daewoon["stem"];
  mainElement: Element;
  strength: BodyStrength;
  currentAge: number;
  currentYear: number;
  daewoon: Daewoon[];
  yearly: YearPoint[];
} {
  const [y, mo, d] = subject.birth.date.split("-").map((n) => parseInt(n, 10));
  const [hh, mm] = (subject.birth.time ?? "12:00").split(":").map((n) => parseInt(n, 10));

  const lunar =
    subject.birth.calendar === "lunar"
      ? Lunar.fromYmdHms(y, subject.birth.isLeapMonth ? -mo : mo, d, hh, mm, 0)
      : Solar.fromYmdHms(y, mo, d, hh, mm, 0).getLunar();
  const ec = lunar.getEightChar();
  const dayMaster = STEMS[GAN_CN.indexOf(ec.getDayGan())];
  const dayElement = STEM_ELEMENT[dayMaster];
  const strength = estimateStrength(calculateSaju(subject));
  const fav = favorByElement(dayElement, strength.strong);

  const gender = subject.gender === "male" ? 1 : 0;
  const list = ec.getYun(gender).getDaYun();
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - y + 1; // 세는나이

  const daewoon: Daewoon[] = [];
  for (const dy of list) {
    const gz = dy.getGanZhi();
    if (!gz || gz.length < 2) continue; // 대운 시작 전 구간 제외
    const stem = STEMS[GAN_CN.indexOf(gz[0])];
    const branch = BRANCHES[ZHI_CN.indexOf(gz[1])];
    const stemElement = STEM_ELEMENT[stem];
    const branchElement = BRANCH_ELEMENT[branch];
    const startAge = dy.getStartAge();
    const startYear = dy.getStartYear();
    const score = clamp(50 + fav[stemElement] * 8 + fav[branchElement] * 8);
    daewoon.push({
      index: daewoon.length,
      startAge,
      endAge: startAge + 9,
      startYear,
      endYear: startYear + 9,
      stem,
      branch,
      stemElement,
      branchElement,
      tenGod: tenGodCategory(dayElement, stemElement),
      score,
      current: currentAge >= startAge && currentAge <= startAge + 9,
    });
  }

  // ── 연도별(세운) 금전·연애·건강 운 ───────────────────────
  const favMoney = domainFavor(dayElement, subject.gender, "money", strength.strong);
  const favLove = domainFavor(dayElement, subject.gender, "love", strength.strong);
  const favHealth = domainFavor(dayElement, subject.gender, "health", strength.strong);
  const yearly: YearPoint[] = [];
  for (let yr = currentYear - 2; yr <= currentYear + 12; yr++) {
    const { stem, branch } = yearGanzhi(yr);
    const se = STEM_ELEMENT[stem];
    const be = BRANCH_ELEMENT[branch];
    const sc = (f: Record<Element, number>) => clamp(50 + f[se] * 7 + f[be] * 7);
    yearly.push({ year: yr, age: yr - y + 1, money: sc(favMoney), love: sc(favLove), health: sc(favHealth) });
  }

  return { dayMaster, mainElement: dayElement, strength, currentAge, currentYear, daewoon, yearly };
}
