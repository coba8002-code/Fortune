import type { FortuneReport } from "@/types/fortune";
import { sampleFortune } from "./sampleFortune";

const STORE: Record<string, FortuneReport> = {
  [sampleFortune.id]: sampleFortune,
};

export async function getFortune(id: string): Promise<FortuneReport | null> {
  return STORE[id] ?? null;
}
