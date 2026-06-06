/**
 * 파일 기반 ReportStore 어댑터 (의존성 없음).
 *
 * 인메모리의 한계(프로세스 재시작 시 소실)를 개선한 기본 영속 어댑터.
 * data/reports/{id}.json 에 ReportData 를 저장한다. 단일 노드/개발용 — 다중 인스턴스
 * 운영에서는 Postgres 등 어댑터로 교체(포트 동일).
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { PdfArtifact, ReportData } from "@/types/report";
import type { ReportStore } from "@/lib/ports";

export function createFileReportStore(
  baseDir = path.resolve(process.cwd(), "data", "reports"),
  seed: ReportData[] = [],
): ReportStore {
  mkdirSync(baseDir, { recursive: true });
  const file = (id: string) => path.join(baseDir, `${encodeURIComponent(id)}.json`);

  const read = (id: string): ReportData | null => {
    const p = file(id);
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, "utf8")) as ReportData;
  };
  const write = (report: ReportData) =>
    writeFileSync(file(report.id), JSON.stringify(report, null, 2), "utf8");

  // 시드: 없을 때만 기록(기존 데이터 보존).
  for (const r of seed) if (!existsSync(file(r.id))) write(r);

  return {
    async save(report) {
      write(report);
    },
    async get(id) {
      return read(id);
    },
    async setPdf(id, pdf: PdfArtifact) {
      const existing = read(id);
      if (existing) write({ ...existing, pdf });
    },
  };
}
