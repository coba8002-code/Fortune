/**
 * lunar-javascript 최소 타입 선언 (사용하는 메서드만).
 * 원본: https://github.com/6tail/lunar-javascript
 */
declare module "lunar-javascript" {
  export interface EightChar {
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    /** 대운. gender: 1=남, 0=여 */
    getYun(gender: number, sect?: number): Yun;
  }
  export interface DaYun {
    getGanZhi(): string;
    getStartAge(): number;
    getStartYear(): number;
    getEndYear(): number;
  }
  export interface Yun {
    getDaYun(): DaYun[];
  }
  export interface Lunar {
    getEightChar(): EightChar;
    getSolar(): Solar;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
  }
  export interface Solar {
    getLunar(): Lunar;
    toYmd(): string;
  }
  export const Solar: {
    fromYmd(year: number, month: number, day: number): Solar;
    fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Solar;
  };
  export const Lunar: {
    /** month < 0 이면 윤달 */
    fromYmd(year: number, month: number, day: number): Lunar;
    fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Lunar;
  };
}
