import { NextResponse } from "next/server";
import { getReport } from "@/lib/report/store";

/**
 * STEP3 — PDF 상태/다운로드 엔드포인트.
 *
 * PDF 는 비동기 워커(scripts/generate-pdf.ts)가 report/:id?print=1 을 렌더해
 * PdfStorage 에 올리고 ReportStore.setPdf 로 상태를 'ready' + url 로 갱신한다.
 * 여기서는 그 상태를 읽어 준비됐으면 URL 로, 아니면 진행 상태(JSON)를 반환한다.
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const report = await getReport(params.id);
  if (!report) {
    return NextResponse.json({ error: "report not found" }, { status: 404 });
  }

  const pdf = report.pdf ?? { status: "pending" as const };

  if (pdf.status === "ready" && pdf.url) {
    return NextResponse.json({
      id: report.id,
      status: "ready",
      url: pdf.url,
      bytes: pdf.bytes,
      filename: `${report.subject.name}_운명리포트.pdf`,
    });
  }

  return NextResponse.json(
    {
      id: report.id,
      status: pdf.status,
      message:
        "PDF 를 준비 중입니다. 워커(`npm run pdf`)가 생성을 완료하면 다운로드 링크가 활성화됩니다.",
      filename: `${report.subject.name}_운명리포트.pdf`,
    },
    { status: pdf.status === "failed" ? 500 : 202 },
  );
}
