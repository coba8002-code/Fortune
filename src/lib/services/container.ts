/**
 * 컴포지션 루트 — 포트에 어댑터를 끼우는 단일 지점.
 *
 * 스택 교체는 여기서만 일어난다(나머지 코드는 포트만 의존).
 * 예: createMemoryReportStore → createPostgresReportStore 로 바꾸면 끝.
 *
 * 주의: 인메모리/로컬 어댑터는 단일 프로세스 기준. 서버리스 다중 인스턴스에서는
 * 영속 어댑터로 교체해야 인스턴스 간 상태가 공유된다.
 */
import type { JobQueue, PaymentGateway, PdfStorage, ReportStore } from "@/lib/ports";
import { createMemoryReportStore } from "@/lib/adapters/memoryReportStore";
import { createFileReportStore } from "@/lib/adapters/fileReportStore";
import { createLocalPdfStorage } from "@/lib/adapters/localPdfStorage";
import { createStubPayment } from "@/lib/adapters/stubPayment";
import { createInlineJobQueue } from "@/lib/adapters/inlineJobQueue";
import { sampleReport } from "@/fixtures/sampleReport";

export interface Services {
  reportStore: ReportStore;
  pdfStorage: PdfStorage;
  payment: PaymentGateway;
  jobQueue: JobQueue;
}

// HMR/재평가에도 단일 인스턴스를 유지하기 위해 globalThis 에 보관.
const globalForServices = globalThis as unknown as { __fortuneServices?: Services };

function build(): Services {
  // FORTUNE_STORE=file → 파일 영속(재시작에도 유지), 기본은 인메모리.
  // 운영에선 createPostgresReportStore 등으로 교체(이 한 줄만 바뀐다).
  const reportStore =
    process.env.FORTUNE_STORE === "file"
      ? createFileReportStore(undefined, [sampleReport])
      : createMemoryReportStore([sampleReport]); // 데모: 샘플 시드
  const pdfStorage = createLocalPdfStorage();
  const payment = createStubPayment();
  const jobQueue = createInlineJobQueue({ store: reportStore, storage: pdfStorage });
  return { reportStore, pdfStorage, payment, jobQueue };
}

export function getServices(): Services {
  if (!globalForServices.__fortuneServices) {
    globalForServices.__fortuneServices = build();
  }
  return globalForServices.__fortuneServices;
}
