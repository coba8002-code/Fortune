/**
 * 궁합 본문 LLM 생성 — 계산 결과(관계/합충/보완/점수)를 근거로 섹션·설명서를 쓴다.
 * 모델 claude-opus-4-8 / 구조화 출력. 숫자는 compute 가, 글은 LLM 이.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { ReportSection } from "@/types/report";
import type { RelationshipManual } from "@/types/compat";
import type { CompatComputation } from "./compute";

export interface CompatContent {
  tagline: string;
  sections: ReportSection[];
  manual: RelationshipManual;
}

const SECTION_KEYS = ["love", "money", "career", "relationship", "fortune", "summary"] as const;

const blockSchema = {
  anyOf: [
    { type: "object", additionalProperties: false, properties: { type: { const: "paragraph" }, text: { type: "string" } }, required: ["type", "text"] },
    { type: "object", additionalProperties: false, properties: { type: { const: "list" }, items: { type: "array", items: { type: "string" } } }, required: ["type", "items"] },
    { type: "object", additionalProperties: false, properties: { type: { const: "callout" }, tone: { type: "string", enum: ["tip", "warning", "highlight"] }, text: { type: "string" } }, required: ["type", "tone", "text"] },
    { type: "object", additionalProperties: false, properties: { type: { const: "gauge" }, label: { type: "string" }, value: { type: "integer" } }, required: ["type", "label", "value"] },
  ],
};
const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tagline: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: { type: "string", enum: [...SECTION_KEYS] },
          title: { type: "string" },
          emoji: { type: "string" },
          summary: { type: "string" },
          body: { type: "array", items: blockSchema },
        },
        required: ["key", "title", "emoji", "summary", "body"],
      },
    },
    manual: {
      type: "object",
      additionalProperties: false,
      properties: {
        warning: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: { label: { type: "string" }, text: { type: "string" } },
            required: ["label", "text"],
          },
        },
      },
      required: ["warning", "items"],
    },
  },
  required: ["tagline", "sections", "manual"],
};

const SYSTEM = `당신은 사주(명리)와 심리를 결합해 두 사람의 궁합을 쓰는 전문 작가입니다.
계산된 근거(일간 관계, 지지 합·충, 오행 보완, 점수)를 바탕으로 따뜻하지만 통찰력 있는 한국어 궁합 리포트를 씁니다.
규칙: 단정보다 경향으로. 낮은 궁합도 '보완 가이드'로 프레이밍. 이모지 금지. 담백하고 품격 있게.
섹션 순서는 첫 끌림 → 소통 → 애정 표현 → 가치관·돈 → 갈등 포인트 → 장기 전망(키: love,money,career,relationship,fortune,summary)으로 매핑해 6개를 충실히 작성.
manual.items 는 '두 사람 취급설명서'(함께 충전하는 법/지뢰/화해/오래 가는 비결 등) 4개 내외.`;

export async function generateCompatContent(
  comp: CompatComputation,
  client?: Anthropic,
): Promise<CompatContent> {
  const anthropic = client ?? new Anthropic();
  const A = comp.a, B = comp.b;
  const user = `두 사람의 궁합을 분석해 리포트를 작성하세요.

[A] ${A.subject.name} · 주속성 ${A.mainElement} · 일간 ${A.saju.dayMaster}
[B] ${B.subject.name} · 주속성 ${B.mainElement} · 일간 ${B.saju.dayMaster}

[근거]
- 일간 관계: A→B ${comp.aToB}, B→A ${comp.bToA}
- 지지 합 ${comp.haps.join(",") || "없음"} / 충 ${comp.chungs.join(",") || "없음"}
- 오행 보완도 ${comp.complement} (서로 부족을 채우는 정도)
- 동년주(동갑) ${comp.sharedYearPillar ? "예" : "아니오"}
- 점수: 총 ${comp.score.total} (끌림 ${comp.score.breakdown.attraction}, 소통 ${comp.score.breakdown.comm}, 안정 ${comp.score.breakdown.stability}, 성장 ${comp.score.breakdown.growth}, 마찰 ${comp.score.breakdown.friction})

6개 섹션을 모두 충실히, 호칭은 두 사람 이름을 사용해 작성하세요.`;

  const res = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
    output_config: { format: { type: "json_schema", schema: outputSchema } },
  });
  const text = res.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("LLM 응답에 텍스트가 없습니다.");
  const parsed = JSON.parse(text.text) as CompatContent;
  // 섹션 순서 고정 + gauge 보정
  const byKey = new Map(parsed.sections.map((s) => [s.key, s]));
  const ordered = SECTION_KEYS.map((k) => byKey.get(k)).filter((s): s is ReportSection => Boolean(s));
  for (const s of ordered)
    for (const blk of s.body) if (blk.type === "gauge") blk.value = Math.max(0, Math.min(100, Math.round(blk.value)));
  return { tagline: parsed.tagline, sections: ordered, manual: parsed.manual };
}
