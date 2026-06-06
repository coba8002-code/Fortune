/**
 * 만세력 계산 모듈 (격리 패키지).
 *
 * 검증된 lunar-javascript(6tail) 로 八字(사주 원국)를 계산한다.
 *   - 절기(節氣) 경계로 연주/월주를 정확히 가른다.
 *   - 일주는 정확한 간지 일진.
 *   - 음력 입력(윤달 포함)을 양력으로 변환해 처리한다.
 *
 * 진태양시(출생지 경도 보정)는 아직 적용하지 않는다 — 시(時) 경계가 민감한 경우를 위해
 * 추후 birthPlace 기반 보정을 이 모듈 안에 추가할 수 있다(인터페이스 불변).
 *
 * 이 모듈은 Subject → SajuChart 의 좁은 인터페이스만 노출한다.
 */
import { Lunar, Solar, type EightChar } from "lunar-javascript";
import type {
  Element,
  Pillar,
  SajuChart,
  Subject,
  TenGodCount,
} from "@/types/report";
import { BRANCH_ELEMENT, BRANCHES, STEM_ELEMENT, STEMS, tenGodCategory } from "./constants";

// 천간/지지 한자 → 한글 매핑(인덱스 동일 순서).
const GAN_CN = "甲乙丙丁戊己庚辛壬癸";
const ZHI_CN = "子丑寅卯辰巳午未申酉戌亥";

function toPillar(gan: string, zhi: string): Pillar {
  const stem = STEMS[GAN_CN.indexOf(gan)];
  const branch = BRANCHES[ZHI_CN.indexOf(zhi)];
  if (!stem || !branch) {
    throw new Error(`알 수 없는 간지: ${gan}${zhi}`);
  }
  return { stem, branch, element: STEM_ELEMENT[stem] };
}

function getLunar(subject: Subject): { lunar: Lunar; hasTime: boolean } {
  const [year, month, day] = subject.birth.date.split("-").map((n) => parseInt(n, 10));
  const hasTime = Boolean(subject.birth.time);
  const [hh, mm] = hasTime
    ? subject.birth.time!.split(":").map((n) => parseInt(n, 10))
    : [0, 0];

  if (subject.birth.calendar === "lunar") {
    // 윤달이면 month 를 음수로 전달(lunar-javascript 규약).
    const m = subject.birth.isLeapMonth ? -month : month;
    const lunar = hasTime
      ? Lunar.fromYmdHms(year, m, day, hh, mm, 0)
      : Lunar.fromYmd(year, m, day);
    return { lunar, hasTime };
  }

  const solar = hasTime
    ? Solar.fromYmdHms(year, month, day, hh, mm, 0)
    : Solar.fromYmd(year, month, day);
  return { lunar: solar.getLunar(), hasTime };
}

function computeTenGods(pillars: Pillar[], dayPillar: Pillar): TenGodCount {
  const dayElement = STEM_ELEMENT[dayPillar.stem];
  const count: TenGodCount = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  for (const p of pillars) {
    // 일간 자신(일주 천간)은 제외, 나머지 천간 + 모든 지지 본기를 집계.
    const elements: Element[] = [BRANCH_ELEMENT[p.branch]];
    if (p !== dayPillar) elements.push(STEM_ELEMENT[p.stem]);
    for (const el of elements) count[tenGodCategory(dayElement, el)] += 1;
  }
  return count;
}

export function calculateSaju(subject: Subject): SajuChart {
  const { lunar, hasTime } = getLunar(subject);
  const ec: EightChar = lunar.getEightChar();

  const year = toPillar(ec.getYearGan(), ec.getYearZhi());
  const month = toPillar(ec.getMonthGan(), ec.getMonthZhi());
  const day = toPillar(ec.getDayGan(), ec.getDayZhi());
  const hour = hasTime ? toPillar(ec.getTimeGan(), ec.getTimeZhi()) : undefined;

  const pillarsList = [year, month, day, ...(hour ? [hour] : [])];
  const tenGods = computeTenGods(pillarsList, day);

  return {
    pillars: { year, month, day, hour },
    dayMaster: day.stem,
    tenGods,
  };
}
