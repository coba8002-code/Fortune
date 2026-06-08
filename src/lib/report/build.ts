/**
 * 리포트 생성 오케스트레이터.
 *
 * 입력(Subject) → 사주 계산(결정론) → 오행/카드 파생(결정론) → LLM 본문 생성 → 병합 → ReportData.
 * 숫자(능력치·등급·오행)는 계산이, 글(섹션·카드 연출 텍스트)은 LLM 이 담당한다.
 */
import { nanoid } from "nanoid";
import type { ReportData, Subject } from "@/types/report";
import { calculateSaju } from "@/lib/saju/calculate";
import { buildCharacterCard, computeElementProfile } from "@/lib/report/buildCard";
import {
  generateReportContent,
  type GenerateOptions,
  type GeneratedContent,
} from "@/lib/llm/generateReport";

export interface BuildReportOptions {
  age?: number;
  /** LLM 생성 함수 주입(테스트/대체용). 기본은 Claude 호출. */
  generate?: (opts: GenerateOptions) => Promise<GeneratedContent>;
}

export async function buildReport(
  subject: Subject,
  options: BuildReportOptions = {},
): Promise<ReportData> {
  const generate = options.generate ?? generateReportContent;

  const saju = calculateSaju(subject);
  const elements = computeElementProfile(saju);
  const baseCard = buildCharacterCard({ saju, profile: elements, age: options.age });

  const { flavor, sections } = await generate({ subject, saju, elements });

  // 계산된 수치(등급·레벨·능력치·별점)는 유지하고, LLM 의 연출 텍스트만 덧입힌다.
  const card = {
    ...baseCard,
    title: flavor.title,
    job: flavor.job,
    skills: {
      main: { ...baseCard.skills.main, name: flavor.mainSkill },
      passive: { ...baseCard.skills.passive, name: flavor.passiveSkill },
      weakness: { ...baseCard.skills.weakness, name: flavor.weakness },
    },
  };

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    subject,
    saju,
    card,
    elements,
    sections,
    pdf: { status: "pending" },
  };
}
