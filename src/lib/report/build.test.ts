import { describe, expect, it } from "vitest";
import { buildReport } from "./build";
import { normalize } from "@/lib/llm/generateReport";
import type { GeneratedContent } from "@/lib/llm/generateReport";
import type { Subject } from "@/types/report";

const subject: Subject = {
  name: "김운명",
  birth: { date: "1991-10-08", time: "13:40", calendar: "solar" },
  gender: "female",
};

// 섹션이 뒤섞여 들어와도 정렬·병합되는지 검증하기 위한 스텁
const stub: GeneratedContent = {
  flavor: {
    title: "전략가",
    job: "기획자",
    mainSkill: "통찰력",
    passiveSkill: "사람을 모으는 힘",
    weakness: "과도한 책임감",
  },
  sections: [
    { key: "summary", title: "총평", emoji: "✨", summary: "s", body: [] },
    { key: "love", title: "연애", emoji: "💗", summary: "l", body: [
      { type: "gauge", label: "적극성", value: 250 }, // 범위 초과 → 보정 대상
    ] },
    { key: "career", title: "직업", emoji: "🧭", summary: "c", body: [] },
  ],
};

describe("buildReport (LLM 주입)", () => {
  it("계산 수치는 유지하고 LLM 연출 텍스트만 병합한다", async () => {
    const report = await buildReport(subject, {
      age: 33,
      generate: async () => stub,
    });

    // LLM 연출 텍스트 반영
    expect(report.card.title).toBe("전략가");
    expect(report.card.skills.main.name).toBe("통찰력");
    // 계산된 수치는 유지(별점/등급은 숫자 계산 결과)
    expect(report.card.skills.main.stars).toBeGreaterThanOrEqual(1);
    expect(["SSR", "SR", "R", "N"]).toContain(report.card.rank);

    // 사주/오행은 결정론적으로 채워짐
    expect(report.saju.dayMaster).toBeTruthy();
    expect(report.elements.dominant).toBeTruthy();

    expect(report.id).toHaveLength(10);
  });

  it("normalize: 섹션 순서를 고정하고 gauge 값을 0~100으로 보정", () => {
    const out = normalize(stub);
    expect(out.sections.map((s) => s.key)).toEqual(["love", "career", "summary"]);
    const loveGauge = out.sections[0].body[0];
    expect(loveGauge.type === "gauge" && loveGauge.value).toBe(100);
  });
});
