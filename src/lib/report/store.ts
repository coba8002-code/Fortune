/**
 * 리포트 조회 헬퍼 — 컴포지션 루트의 ReportStore 포트에 위임한다.
 *
 * (이전 스텁은 모든 id 에 샘플을 반환했지만, 이제 저장소 기반.
 *  샘플은 container 에서 시드되어 /report/SAMPLE 데모가 계속 동작한다.)
 */
import type { ReportData } from "@/types/report";
import { getServices } from "@/lib/services/container";

export async function getReport(id: string): Promise<ReportData | null> {
  return getServices().reportStore.get(id);
}
