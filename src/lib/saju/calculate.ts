/**
 * 만세력 계산 모듈 (격리 패키지).
 *
 * ⚠️ 정확도 주의 — docs/ARCHITECTURE.md 2절:
 *   - 일주(日柱)는 율리우스적일수(JDN) 기반으로 정확히 계산한다.
 *   - 연주/월주/시주는 절기(節氣)·진태양시를 단순화한 "근사" 구현이다.
 *     (입춘≈2/4, 각 절기는 고정 근사일 사용) 추후 정밀 절기표/진태양시 보정으로 교체 예정.
 *   - 모든 출력은 calculate.test.ts 의 스냅샷 테스트로 고정한다.
 *
 * 이 모듈은 입력→SajuChart 의 좁은 인터페이스만 노출한다.
 * 정확도 요구가 커지면 이 파일만 Python 마이크로서비스로 떼어낼 수 있다.
 */
import type {
  EarthlyBranch,
  Element,
  HeavenlyStem,
  Pillar,
  SajuChart,
  Subject,
  TenGodCount,
} from "@/types/report";
import {
  BRANCH_ELEMENT,
  BRANCHES,
  STEM_ELEMENT,
  STEMS,
  tenGodCategory,
} from "./constants";

// ── 율리우스적일수 (Gregorian → JDN, 정오 기준) ──────────────────────
export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * 일주(日柱). 앵커: 2000-01-07 = 갑자일(甲子日, 간지 인덱스 0).
 * 핵심 불변식 = 하루마다 간지 인덱스가 1씩 증가한다. (앵커 출력은 테스트로 고정)
 */
const ANCHOR_JDN = gregorianToJDN(2000, 1, 7); // 갑자일
function dayPillar(year: number, month: number, day: number): Pillar {
  const jdn = gregorianToJDN(year, month, day);
  const idx = (((jdn - ANCHOR_JDN) % 60) + 60) % 60;
  const stem = STEMS[idx % 10];
  const branch = BRANCHES[idx % 12];
  return { stem, branch, element: STEM_ELEMENT[stem] };
}

/**
 * 연주(年柱). 입춘(≈2/4) 이후가 해당 간지년.
 * 연 간지 인덱스 = (Y - 4) mod 60 → 0 = 갑자(서기 4년 기준). 1984 → 갑자년.
 */
function yearPillar(year: number, month: number, day: number): Pillar {
  let y = year;
  // 입춘 근사: 2월 4일 이전이면 전년도 간지 사용
  if (month < 2 || (month === 2 && day < 4)) y -= 1;
  const idx = (((y - 4) % 60) + 60) % 60;
  const stem = STEMS[idx % 10];
  const branch = BRANCHES[idx % 12];
  return { stem, branch, element: STEM_ELEMENT[stem] };
}

/**
 * 절기 근사표 — 각 절기의 시작 근사일(양력). 월지(月支)를 정하는 12절기.
 * index 0 = 입춘(인월 시작). 실제 절기는 해마다 ±1~2일 변동하나 여기서는 고정 근사.
 */
const SOLAR_TERMS: { month: number; day: number; branch: EarthlyBranch }[] = [
  { month: 2, day: 4, branch: "인" }, // 입춘
  { month: 3, day: 6, branch: "묘" }, // 경칩
  { month: 4, day: 5, branch: "진" }, // 청명
  { month: 5, day: 6, branch: "사" }, // 입하
  { month: 6, day: 6, branch: "오" }, // 망종
  { month: 7, day: 7, branch: "미" }, // 소서
  { month: 8, day: 8, branch: "신" }, // 입추
  { month: 9, day: 8, branch: "유" }, // 백로
  { month: 10, day: 8, branch: "술" }, // 한로
  { month: 11, day: 7, branch: "해" }, // 입동
  { month: 12, day: 7, branch: "자" }, // 대설
  { month: 1, day: 6, branch: "축" }, // 소한
];

/** 오호둔(五虎遁): 연간 → 인월(寅月) 천간 시작 인덱스. */
function monthStartStemIndex(yearStem: HeavenlyStem): number {
  // 갑/기년→병인, 을/경년→무인, 병/신년→경인, 정/임년→임인, 무/계년→갑인
  const yStemIdx = STEMS.indexOf(yearStem);
  const table = [2, 4, 6, 8, 0]; // 갑→병(2), 을→무(4), 병→경(6), 정→임(8), 무→갑(0)
  return table[yStemIdx % 5];
}

function monthPillar(
  year: number,
  month: number,
  day: number,
  yearStem: HeavenlyStem,
): Pillar {
  // 현재 날짜가 속한 절기 구간(월지)을 찾는다.
  // 절기는 입춘(인월)부터 순서대로. 가장 최근에 시작된 절기를 채택.
  let chosen = 11; // 기본: 소한(축월) — 1월 6일~입춘 전
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const t = SOLAR_TERMS[i];
    const started =
      month > t.month || (month === t.month && day >= t.day);
    // 12번째(소한)은 1월이라 연초로 래핑되므로 별도 처리
    if (t.branch === "축") continue;
    if (started) chosen = i;
  }
  // 소한(축월) 보정: 1/6 ~ 2/3
  if ((month === 1 && day >= 6) || (month === 2 && day < 4)) chosen = 11;

  const branch = SOLAR_TERMS[chosen].branch;
  // 인월 인덱스에서 (월지 - 인) 만큼 천간 진행
  const branchOrderFromIn = BRANCHES.indexOf(branch) - BRANCHES.indexOf("인");
  const offset = ((branchOrderFromIn % 12) + 12) % 12;
  const stemIdx = (monthStartStemIndex(yearStem) + offset) % 10;
  const stem = STEMS[stemIdx];
  return { stem, branch, element: STEM_ELEMENT[stem] };
}

/** 시지(時支): 시각 → 지지. 자시(子時)=23:00~00:59. */
function hourBranchIndex(hour: number): number {
  // 23~0시 → 자(0), 1~2 → 축(1), ... 2시간 단위
  return Math.floor(((hour + 1) % 24) / 2);
}

/** 오자둔(五子遁): 일간 → 자시(子時) 천간 시작 인덱스. */
function hourStartStemIndex(dayStem: HeavenlyStem): number {
  // 갑/기일→갑자, 을/경일→병자, 병/신일→무자, 정/임일→경자, 무/계일→임자
  const dStemIdx = STEMS.indexOf(dayStem);
  const table = [0, 2, 4, 6, 8];
  return table[dStemIdx % 5];
}

function hourPillar(time: string, dayStem: HeavenlyStem): Pillar {
  const [hh] = time.split(":").map((n) => parseInt(n, 10));
  const bIdx = hourBranchIndex(hh);
  const branch = BRANCHES[bIdx];
  const stemIdx = (hourStartStemIndex(dayStem) + bIdx) % 10;
  const stem = STEMS[stemIdx];
  return { stem, branch, element: STEM_ELEMENT[stem] };
}

// ── 십성 분포 ─────────────────────────────────────────────────────────
function computeTenGods(
  pillars: Pillar[],
  dayStem: HeavenlyStem,
): TenGodCount {
  const dayElement = STEM_ELEMENT[dayStem];
  const count: TenGodCount = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  for (const p of pillars) {
    // 일간 자신(일주 천간)은 제외하고, 나머지 천간 + 모든 지지 본기를 집계
    const elements: Element[] = [BRANCH_ELEMENT[p.branch]];
    if (!(p === pillars[2])) elements.push(STEM_ELEMENT[p.stem]); // pillars[2] = 일주
    for (const el of elements) {
      count[tenGodCategory(dayElement, el)] += 1;
    }
  }
  return count;
}

// ── 공개 진입점 ───────────────────────────────────────────────────────
export function calculateSaju(subject: Subject): SajuChart {
  if (subject.birth.calendar === "lunar") {
    // 음력 변환은 별도 단계(미구현). 현재는 양력 입력만 정확.
    throw new Error("음력 입력은 아직 지원하지 않습니다. 양력으로 변환 후 호출하세요.");
  }
  const [year, month, day] = subject.birth.date
    .split("-")
    .map((n) => parseInt(n, 10));

  const yp = yearPillar(year, month, day);
  const mp = monthPillar(year, month, day, yp.stem);
  const dp = dayPillar(year, month, day);
  const hp = subject.birth.time ? hourPillar(subject.birth.time, dp.stem) : undefined;

  const pillarsList = [yp, mp, dp, ...(hp ? [hp] : [])];
  const tenGods = computeTenGods(pillarsList, dp.stem);

  return {
    pillars: { year: yp, month: mp, day: dp, hour: hp },
    dayMaster: dp.stem,
    tenGods,
  };
}
