import type { CompatibilityReport } from "@/types/compat";
import { sampleCompat } from "./sampleCompat";
import { sampleCompat2 } from "./sampleCompat2";

const STORE: Record<string, CompatibilityReport> = {
  [sampleCompat.id]: sampleCompat,
  [sampleCompat2.id]: sampleCompat2,
};

export async function getCompat(id: string): Promise<CompatibilityReport | null> {
  return STORE[id] ?? null;
}
