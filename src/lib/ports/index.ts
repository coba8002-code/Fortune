/**
 * 포트(추상 인터페이스) — 결제·영속·저장소·큐.
 *
 * 스택 미정 상태에서 외부 인프라를 인터페이스로만 고정한다.
 * 지금은 인메모리/로컬 어댑터를 끼우고(src/lib/adapters), 나중에
 * Postgres·Stripe·S3 등 실제 벤더 어댑터로 교체한다(나머지 코드는 불변).
 *
 * 설계: docs/ARCHITECTURE.md §3 (결제 → 분석 큐 → 웹/PDF)
 */
import type { PdfArtifact, ReportData } from "@/types/report";

/** 리포트 영속(현재 인메모리 → 향후 Postgres). */
export interface ReportStore {
  save(report: ReportData): Promise<void>;
  get(id: string): Promise<ReportData | null>;
  /** PDF 생성 상태/URL 갱신(워커가 호출). */
  setPdf(id: string, pdf: PdfArtifact): Promise<void>;
}

/** PDF 바이너리 저장(현재 로컬 FS → 향후 객체 스토리지). */
export interface PdfStorage {
  put(id: string, bytes: Buffer): Promise<{ url: string; bytes: number }>;
  getUrl(id: string): Promise<string | null>;
}

/** 분석/PDF 작업 큐(현재 인라인 → 향후 SQS/Cloud Tasks/워커). */
export interface JobQueue {
  /** 리포트 PDF 생성 작업 등록. */
  enqueuePdf(reportId: string): Promise<void>;
}
