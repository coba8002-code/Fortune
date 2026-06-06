import { describe, expect, it } from "vitest";
import { computeCompatibility, dayRelation } from "./compute";
import type { Subject } from "@/types/report";

const A: Subject = { name: "최준혁", birth: { date: "1980-12-02", time: "08:30", calendar: "solar" }, gender: "male" };
const B: Subject = { name: "김은경", birth: { date: "1980-09-04", time: "16:00", calendar: "solar" }, gender: "female" };
const C: Subject = { name: "정소영", birth: { date: "1980-03-22", time: "20:00", calendar: "solar" }, gender: "female" };

describe("dayRelation", () => {
  it("土→金 은 식상, 金→土 는 인성", () => {
    expect(dayRelation("토", "금")).toBe("식상");
    expect(dayRelation("금", "토")).toBe("인성");
  });
});

describe("computeCompatibility (최준혁 × 김은경)", () => {
  const c = computeCompatibility(A, B);
  it("일간 관계: 土生金 (A→B 식상, B→A 인성)", () => {
    expect(c.aToB).toBe("식상");
    expect(c.bToA).toBe("인성");
  });
  it("동년주(1980 경신) 동갑 인식", () => {
    expect(c.sharedYearPillar).toBe(true);
  });
  it("충 없음, 합 1개 이상, 상호 보완 존재", () => {
    expect(c.chungs.length).toBe(0);
    expect(c.haps.length).toBeGreaterThanOrEqual(1);
    expect(c.complement).toBeGreaterThan(0);
  });
  it("점수 0~100, 등급은 SSR/SR/R/N 중 하나", () => {
    expect(c.score.total).toBeGreaterThanOrEqual(0);
    expect(c.score.total).toBeLessThanOrEqual(100);
    expect(["SSR", "SR", "R", "N"]).toContain(c.score.grade);
  });
  it("김은경과는 일간합 아님(천간합 己甲은 존재)", () => {
    expect(c.dayStemHarmony).toBe(false);
    expect(c.stemHaps.length).toBeGreaterThanOrEqual(1);
  });
});

describe("천간합 — 최준혁(己) × 정소영(甲)", () => {
  const c = computeCompatibility(A, C);
  it("갑기합 = 일간합으로 판정", () => {
    expect(c.dayStemHarmony).toBe(true);
  });
  it("일간합 가산으로 끌림 점수가 높다", () => {
    expect(c.score.breakdown.attraction).toBeGreaterThanOrEqual(85);
  });
  it("충 2개(묘유·진술) 감지", () => {
    expect(c.chungs.length).toBe(2);
  });
});
