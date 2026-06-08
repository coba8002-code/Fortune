import type { FortuneReport } from "@/types/fortune";
import { sampleFortune } from "./sampleFortune";
import { sampleFortune2 } from "./sampleFortune2";

const STORE: Record<string, FortuneReport> = {
  [sampleFortune.id]: sampleFortune,
  [sampleFortune2.id]: sampleFortune2,
};

export async function getFortune(id: string): Promise<FortuneReport | null> {
  return STORE[id] ?? null;
}
