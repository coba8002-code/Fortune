import { describe, expect, it } from "vitest";
import { buildUserManual } from "./buildManual";
import { sampleReport } from "@/fixtures/sampleReport";

describe("buildUserManual", () => {
  it("모델명/출고정보는 계산하고, 항목/경고는 생성기에서 병합", async () => {
    const manual = await buildUserManual(sampleReport, {
      generate: async () => ({
        items: [{ icon: "⚡", label: "전원", text: "테스트" }],
        warning: "주의 한 줄",
      }),
    });

    // 결정론적 파생
    expect(manual.modelName).toContain(sampleReport.card.title);
    expect(manual.modelName).toMatch(/형\(.+\)$/); // "전략가형(辛土)" 꼴
    expect(manual.releaseInfo).toMatch(/^\d{4}년형 · 주성분 /);
    expect(manual.rank).toBe(sampleReport.card.rank);
    expect(manual.mainElement).toBe(sampleReport.card.mainElement);

    // 생성기 병합
    expect(manual.warning).toBe("주의 한 줄");
    expect(manual.items[0].text).toBe("테스트");
  });
});
