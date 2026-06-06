import type { CompatibilityReport } from "@/types/compat";
import { sampleCompat } from "./sampleCompat";

const STORE: Record<string, CompatibilityReport> = {
  [sampleCompat.id]: sampleCompat,
};

export async function getCompat(id: string): Promise<CompatibilityReport | null> {
  return STORE[id] ?? null;
}
