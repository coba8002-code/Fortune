/**
 * 인메모리 ReportStore 어댑터.
 *
 * 단일 프로세스 데모용. 서버리스/멀티 인스턴스에서는 인스턴스 간 공유되지 않으므로
 * 운영에서는 Postgres 등 영속 어댑터로 교체한다(포트 동일).
 */
import type { PdfArtifact, ReportData } from "@/types/report";
import type { ReportStore } from "@/lib/ports";

export function createMemoryReportStore(seed: ReportData[] = []): ReportStore {
  const map = new Map<string, ReportData>();
  for (const r of seed) map.set(r.id, r);

  return {
    async save(report) {
      map.set(report.id, report);
    },
    async get(id) {
      return map.get(id) ?? null;
    },
    async setPdf(id, pdf: PdfArtifact) {
      const existing = map.get(id);
      if (existing) map.set(id, { ...existing, pdf });
    },
  };
}
