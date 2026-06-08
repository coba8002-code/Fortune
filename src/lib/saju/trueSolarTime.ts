/**
 * 진태양시(眞太陽時) 보정.
 *
 * 한국 표준시(KST)는 동경 135°E 기준이지만 실제 출생지 경도와 다르고,
 * 지구 공전 궤도/자전축 때문에 태양의 실제 남중 시각은 평균시와도 어긋난다.
 * 사주의 시주(時柱)는 2시간 단위 시진(時辰)이라, 이 보정이 경계 근처에서 시주를 바꾼다.
 *
 *   진태양시 = 시계시각 + 경도보정 + 균시차(Equation of Time)
 *
 * - 경도보정(분) = (출생지경도 - 표준자오선135) × 4
 * - 균시차(분)   = 근사식(아래)
 */

/** 한국 주요 도시 경도(°E) — birthPlace 문자열 매칭용. */
export const KOREAN_CITY_LONGITUDE: Record<string, number> = {
  서울: 126.98,
  인천: 126.71,
  수원: 127.03,
  춘천: 127.73,
  강릉: 128.9,
  대전: 127.38,
  청주: 127.49,
  전주: 127.15,
  광주: 126.85,
  대구: 128.6,
  포항: 129.36,
  부산: 129.08,
  울산: 129.31,
  창원: 128.68,
  제주: 126.53,
};

const STANDARD_MERIDIAN = 135; // KST

/** 출생지/경도 입력에서 경도(°E)를 해석. 없으면 undefined(보정 안 함). */
export function resolveLongitude(input: {
  birthLongitude?: number;
  birthPlace?: string;
}): number | undefined {
  if (typeof input.birthLongitude === "number") return input.birthLongitude;
  if (input.birthPlace) {
    for (const [city, lon] of Object.entries(KOREAN_CITY_LONGITUDE)) {
      if (input.birthPlace.includes(city)) return lon;
    }
  }
  return undefined;
}

/** 균시차(분) 근사식. N = 1월 1일부터의 일수(1~366). */
export function equationOfTimeMinutes(year: number, month: number, day: number): number {
  const n = dayOfYear(year, month, day);
  const b = (2 * Math.PI * (n - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function dayOfYear(year: number, month: number, day: number): number {
  const start = Date.UTC(year, 0, 0);
  const cur = Date.UTC(year, month - 1, day);
  return Math.floor((cur - start) / 86400000);
}

/** 시계시각에 더해야 할 총 보정(분). longitude 없으면 0. */
export function solarTimeCorrectionMinutes(
  date: { year: number; month: number; day: number },
  longitude?: number,
): number {
  if (typeof longitude !== "number") return 0;
  const longitudeCorrection = (longitude - STANDARD_MERIDIAN) * 4;
  const eot = equationOfTimeMinutes(date.year, date.month, date.day);
  return longitudeCorrection + eot;
}
