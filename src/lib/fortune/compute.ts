/**
 * 운세 계산 (결정론) — 10년 대운 산출 + 흐름 점수(인생 그래프).
 * 대운은 검증된 lunar-javascript(getYun)로 계산. 점수는 억부 용신(신강) 휴리스틱.
 */
import { Solar, Lunar } from "lunar-javascript";
import type { Element, Subject } from "@/types/report";
import type { Daewoon } from "@/types/fortune";
import { STEM_ELEMENT, BRANCH_ELEMENT, STEMS, BRANCHES, tenGodCategory } from "@/lib/saju/constants";

const GAN_CN = "甲乙丙丁戊己庚辛壬癸";
const ZHI_CN = "子丑寅卯辰巳午未申酉戌亥";

/**
 * 억부 용신 휴리스틱: 최준혁(己土, 토금 과다 신강)처럼
 * 일간을 ‘빼주고 다스리는’ 식상(금)·재성(수)·관성(목)은 길(+),
 * 보태는 인성(화)·비겁(토)은 흉(−)으로 본다.
 * 일반화: 일간 오행 D 기준으로 각 오행의 십성 역할로 가중.
 */
function favorByElement(dayElement: Element): Record<Element, number> {
  const fav: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  (Object.keys(fav) as Element[]).forEach((e) => {
    const cat = tenGodCategory(dayElement, e);
    fav[e] = cat === "비겁" ? -2 : cat === "인성" ? -1 : cat === "식상" ? 2 : cat === "재성" ? 2 : 2; // 관성 +2
  });
  return fav;
}

const clamp = (n: number, lo = 20, hi = 94) => Math.max(lo, Math.min(hi, Math.round(n)));

export function computeFortune(subject: Subject): {
  dayMaster: Daewoon["stem"];
  mainElement: Element;
  currentAge: number;
  currentYear: number;
  daewoon: Daewoon[];
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
  const fav = favorByElement(dayElement);

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

  return { dayMaster, mainElement: dayElement, currentAge, currentYear, daewoon };
}
