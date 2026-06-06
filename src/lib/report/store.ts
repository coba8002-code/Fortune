/**
 * 리포트 저장소 (스텁).
 *
 * 지금은 샘플 픽스처만 반환한다. 실제 구현에서는 PostgreSQL 등에서
 * 토큰(id)으로 ReportData 를 조회한다(ARCHITECTURE.md §4).
 */
import type { ReportData } from "@/types/report";
import { sampleReport } from "@/fixtures/sampleReport";

export async function getReport(id: string): Promise<ReportData | null> {
  // TODO: DB 조회로 교체. 현재는 모든 id 에 대해 샘플 반환.
  if (id === "SAMPLE" || id === sampleReport.id) return sampleReport;
  // 데모 단계: 알 수 없는 id 도 샘플로 응답(라우팅 확인용)
  return { ...sampleReport, id };
}
