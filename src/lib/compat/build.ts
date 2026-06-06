/**
 * 궁합 리포트 오케스트레이터 — 계산(숫자/근거) + LLM(글) 병합.
 */
import { nanoid } from "nanoid";
import type { Subject } from "@/types/report";
import type { CompatibilityReport } from "@/types/compat";
import { computeCompatibility, type CompatComputation } from "./compute";
import { generateCompatContent, type CompatContent } from "./generate";

export interface BuildCompatOptions {
  generate?: (comp: CompatComputation) => Promise<CompatContent>;
}

export async function buildCompatReport(
  subjA: Subject,
  subjB: Subject,
  options: BuildCompatOptions = {},
): Promise<CompatibilityReport> {
  const generate = options.generate ?? generateCompatContent;
  const comp = computeCompatibility(subjA, subjB);
  const { tagline, sections, manual } = await generate(comp);

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    a: comp.a,
    b: comp.b,
    tagline,
    score: comp.score,
    basis: comp.basis,
    timeline: comp.timeline,
    areas: comp.areas,
    sections,
    manual,
  };
}
