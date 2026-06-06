import { describe, expect, it } from "vitest";
import { computeFortune } from "./compute";
import type { Subject } from "@/types/report";

const A: Subject = { name: "최준혁", birth: { date: "1980-12-02", time: "08:30", calendar: "solar" }, gender: "male" };

describe("computeFortune (최준혁)", () => {
  const f = computeFortune(A);
  it("일간 己土, 순행 대운 시작은 戊子", () => {
    expect(f.dayMaster).toBe("기");
    expect(f.mainElement).toBe("토");
    expect(`${f.daewoon[0].stem}${f.daewoon[0].branch}`).toBe("무자");
  });
  it("대운은 10년 단위, 점수는 20~94", () => {
    expect(f.daewoon.length).toBeGreaterThanOrEqual(6);
    for (const d of f.daewoon) {
      expect(d.endAge - d.startAge).toBe(9);
      expect(d.score).toBeGreaterThanOrEqual(20);
      expect(d.score).toBeLessThanOrEqual(94);
    }
  });
  it("정확히 하나의 대운이 현재(current)", () => {
    expect(f.daewoon.filter((d) => d.current).length).toBe(1);
  });
  it("식상·관성 대운(경인/신묘)이 비겁 대운(기축)보다 점수 높음", () => {
    const score = (gz: string) => f.daewoon.find((d) => `${d.stem}${d.branch}` === gz)?.score ?? 0;
    expect(score("경인")).toBeGreaterThan(score("기축"));
    expect(score("신묘")).toBeGreaterThan(score("기축"));
  });
});
