import { describe, expect, it } from "vitest";
import { calculateSaju } from "./calculate";
import type { Subject } from "@/types/report";

function subject(date: string, time?: string): Subject {
  return {
    name: "테스트",
    birth: { date, time, calendar: "solar" },
    gender: "male",
  };
}

describe("일주(日柱) — 정확도", () => {
  it("2000-01-07 은 갑자일(甲子日)", () => {
    const s = calculateSaju(subject("2000-01-07"));
    expect(s.pillars.day.stem).toBe("갑");
    expect(s.pillars.day.branch).toBe("자");
  });

  it("하루 뒤면 간지가 정확히 1 진행 (갑자 → 을축)", () => {
    const s = calculateSaju(subject("2000-01-08"));
    expect(s.pillars.day.stem).toBe("을");
    expect(s.pillars.day.branch).toBe("축");
  });

  it("60일 주기는 동일 간지로 되돌아온다", () => {
    const a = calculateSaju(subject("2000-01-07")).pillars.day;
    const b = calculateSaju(subject("2000-03-07")).pillars.day; // +60일
    expect(b.stem).toBe(a.stem);
    expect(b.branch).toBe(a.branch);
  });
});

describe("연주(年柱) — 절기(입춘) 경계", () => {
  it("1984 년은 갑자년(甲子年)", () => {
    const s = calculateSaju(subject("1984-06-01"));
    expect(s.pillars.year.stem).toBe("갑");
    expect(s.pillars.year.branch).toBe("자");
  });

  it("입춘 이전은 전년도 간지(계해), 이후는 갑자", () => {
    const before = calculateSaju(subject("1984-02-03")).pillars.year;
    const after = calculateSaju(subject("1984-02-05")).pillars.year;
    expect(before.branch).toBe("해"); // 1983 계해년
    expect(after.branch).toBe("자"); // 1984 갑자년
  });
});

describe("calculateSaju — 구조/스냅샷", () => {
  it("시각 미상이면 시주가 없다", () => {
    const s = calculateSaju(subject("1995-03-21"));
    expect(s.pillars.hour).toBeUndefined();
  });

  it("전체 원국 스냅샷 (1995-03-21 13:40) — 을해/기묘/신해/을미", () => {
    const s = calculateSaju(subject("1995-03-21", "13:40"));
    expect(s).toMatchInlineSnapshot(`
      {
        "dayMaster": "신",
        "pillars": {
          "day": {
            "branch": "해",
            "element": "금",
            "stem": "신",
          },
          "hour": {
            "branch": "미",
            "element": "목",
            "stem": "을",
          },
          "month": {
            "branch": "묘",
            "element": "토",
            "stem": "기",
          },
          "year": {
            "branch": "해",
            "element": "목",
            "stem": "을",
          },
        },
        "tenGods": {
          "관성": 0,
          "비겁": 0,
          "식상": 2,
          "인성": 2,
          "재성": 3,
        },
      }
    `);
  });

  it("음력 입력을 양력으로 변환해 동일 원국을 낸다 (음 1991-9-1 = 양 1991-10-08)", () => {
    const fromLunar = calculateSaju({
      name: "x",
      birth: { date: "1991-09-01", calendar: "lunar" },
      gender: "female",
    });
    const fromSolar = calculateSaju({
      name: "x",
      birth: { date: "1991-10-08", calendar: "solar" },
      gender: "female",
    });
    expect(fromLunar.pillars.day).toEqual(fromSolar.pillars.day);
    expect(fromLunar.pillars.year).toEqual(fromSolar.pillars.year);
  });
});
