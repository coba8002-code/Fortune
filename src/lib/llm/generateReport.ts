/**
 * LLM 생성 단계 — 사주 원국을 받아 리포트 본문(sections)과 카드 연출 텍스트(flavor)를
 * Claude 로 생성한다.
 *
 * 모델: claude-opus-4-8 / adaptive thinking / 구조화 출력(output_config.format).
 * 숫자(능력치·등급)는 결정론적 계산이 담당하고, LLM 은 "글"만 만든다(데이터/표현 분리).
 *
 * ANTHROPIC_API_KEY 환경변수 필요. 키가 없으면 호출 측에서 폴백 처리.
 */
import Anthropic from "@anthropic-ai/sdk";
import type {
  ElementProfile,
  ReportSection,
  SajuChart,
  Subject,
} from "@/types/report";
import { ELEMENT_LABEL } from "@/lib/ui/element";

export interface GeneratedContent {
  flavor: {
    title: string;
    job: string;
    mainSkill: string;
    passiveSkill: string;
    weakness: string;
  };
  sections: ReportSection[];
}

const SECTION_KEYS = [
  "love",
  "money",
  "career",
  "relationship",
  "fortune",
  "summary",
] as const;

// 구조화 출력 JSON 스키마 (structured outputs 제약 준수: additionalProperties:false,
// 수치 제약 없음, anyOf/const/enum 사용 가능).
const blockSchema = {
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: { type: { const: "paragraph" }, text: { type: "string" } },
      required: ["type", "text"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { const: "list" },
        items: { type: "array", items: { type: "string" } },
      },
      required: ["type", "items"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { const: "callout" },
        tone: { type: "string", enum: ["tip", "warning", "highlight"] },
        text: { type: "string" },
      },
      required: ["type", "tone", "text"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { const: "gauge" },
        label: { type: "string" },
        value: { type: "integer" },
      },
      required: ["type", "label", "value"],
    },
  ],
};

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flavor: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        job: { type: "string" },
        mainSkill: { type: "string" },
        passiveSkill: { type: "string" },
        weakness: { type: "string" },
      },
      required: ["title", "job", "mainSkill", "passiveSkill", "weakness"],
    },
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
  },
  required: ["flavor", "sections"],
};

const SYSTEM_PROMPT = `당신은 사주(명리)와 심리를 결합해 운명 리포트를 쓰는 전문 작가입니다.
사주 원국(천간·지지·오행·십성)을 근거로, 따뜻하지만 통찰력 있는 한국어 리포트를 작성합니다.

규칙:
- 점술적 단정("반드시 ~한다")보다, 경향과 가능성으로 서술합니다.
- 각 섹션은 사주 데이터에 근거해 구체적으로, 충분한 분량으로 씁니다(오행 편중, 강한 십성, 조후 등).
- 분량 기준: 각 섹션은 paragraph 3개 이상 + list 1개 이상 + callout 1~2개로 깊이 있게 풉니다.
  (짧은 요약형 금지 — 근거 → 해석 → 실용 조언의 흐름으로 충실하게.)
- 섹션 순서는 연애 → 돈 → 직업 → 인간관계 → 운세 → 총평 고정입니다.
- 본문은 paragraph/list/callout/gauge 블록으로 구조화합니다. gauge value 는 0~100.
- 이모지를 절대 쓰지 않습니다(고급스러운 톤 유지).
- flavor 는 캐릭터 카드용 짧은 텍스트입니다: title(별명, 예 "전략가"), job(직업 비유),
  mainSkill/passiveSkill/weakness(스킬 이름, 4~8자).
- 담백하고 품격 있게. 과장 금지.`;

function describeSaju(saju: SajuChart, elements: ElementProfile): string {
  const p = saju.pillars;
  const pillar = (label: string, x?: { stem: string; branch: string }) =>
    x ? `${label}: ${x.stem}${x.branch}` : `${label}: (없음)`;
  const elementLine = (Object.keys(elements.scores) as (keyof typeof elements.scores)[])
    .map((e) => `${ELEMENT_LABEL[e]} ${elements.scores[e]}`)
    .join(", ");
  const tg = saju.tenGods;
  return [
    `일간(나): ${saju.dayMaster}`,
    pillar("연주", p.year),
    pillar("월주", p.month),
    pillar("일주", p.day),
    pillar("시주", p.hour),
    `오행 분포: ${elementLine}`,
    `주된 기운: ${ELEMENT_LABEL[elements.dominant]} / 부족한 기운: ${ELEMENT_LABEL[elements.lacking]}`,
    `십성: 비겁 ${tg.비겁}, 식상 ${tg.식상}, 재성 ${tg.재성}, 관성 ${tg.관성}, 인성 ${tg.인성}`,
  ].join("\n");
}

export interface GenerateOptions {
  subject: Subject;
  saju: SajuChart;
  elements: ElementProfile;
  /** 테스트용 주입(미지정 시 환경변수로 클라이언트 생성) */
  client?: Anthropic;
}

export async function generateReportContent({
  subject,
  saju,
  elements,
  client,
}: GenerateOptions): Promise<GeneratedContent> {
  const anthropic = client ?? new Anthropic();

  const userPrompt = `다음 사람의 사주를 분석해 리포트를 작성하세요.

이름: ${subject.name} (호칭용)
성별: ${subject.gender === "male" ? "남성" : "여성"}

[사주 원국]
${describeSaju(saju, elements)}

6개 섹션(love, money, career, relationship, fortune, summary)을 모두, 각 섹션을 충분한 분량(문단 3개 이상)으로 작성하세요.`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
    output_config: { format: { type: "json_schema", schema: outputSchema } },
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("LLM 응답에 텍스트 블록이 없습니다.");
  }
  const parsed = JSON.parse(text.text) as GeneratedContent;
  return normalize(parsed);
}

/** 섹션 순서 고정 + gauge value 범위 보정 등 방어적 정규화. */
export function normalize(content: GeneratedContent): GeneratedContent {
  const byKey = new Map(content.sections.map((s) => [s.key, s]));
  const ordered = SECTION_KEYS.map((k) => byKey.get(k)).filter(
    (s): s is ReportSection => Boolean(s),
  );
  for (const section of ordered) {
    for (const block of section.body) {
      if (block.type === "gauge") {
        block.value = Math.max(0, Math.min(100, Math.round(block.value)));
      }
    }
  }
  return { flavor: content.flavor, sections: ordered };
}
