/**
 * 인라인 JobQueue 어댑터.
 *
 * 별도 워커 인프라 없이 같은 프로세스에서 PDF 작업을 처리한다.
 * render 가 주입되면 즉시 렌더 → 스토리지 저장 → store 상태 갱신.
 * render 가 없으면(기본) 상태만 'pending' 으로 두고, 실제 렌더는
 * 외부 워커(scripts/generate-pdf.ts)가 맡는다 — 운영에선 SQS/Cloud Tasks 로 교체.
 */
import type { JobQueue, PdfStorage, ReportStore } from "@/lib/ports";

export interface InlineJobQueueDeps {
  store: ReportStore;
  storage: PdfStorage;
  /** report/:id?print=1 을 PDF 바이트로 렌더(Playwright 워커). 미주입 시 비동기 워커에 위임. */
  render?: (reportId: string) => Promise<Buffer>;
}

export function createInlineJobQueue({
  store,
  storage,
  render,
}: InlineJobQueueDeps): JobQueue {
  return {
    async enqueuePdf(reportId) {
      if (!render) {
        await store.setPdf(reportId, { status: "pending" });
        return;
      }
      try {
        const bytes = await render(reportId);
        const { url, bytes: size } = await storage.put(reportId, bytes);
        await store.setPdf(reportId, {
          status: "ready",
          url,
          bytes: size,
          generatedAt: new Date().toISOString(),
        });
      } catch {
        await store.setPdf(reportId, { status: "failed" });
      }
    },
  };
}
