import { NextResponse } from "next/server";
import { getReport } from "@/lib/report/store";

/**
 * STEP3 — PDF 상태/다운로드 엔드포인트.
 *
 * 설계(ARCHITECTURE.md §3): PDF 는 비동기 워커(scripts/generate-pdf.ts)가
 * report/:id?print=1 을 Playwright 로 렌더해 스토리지에 올리고, 그 URL 을 여기서 돌려준다.
 * 요청 경로에서 직접 Playwright 를 띄우지 않는다(메모리/타임아웃 회피).
 *
 * 데모 단계에서는 아직 워커 연동이 없으므로 생성 상태(JSON)를 반환한다.
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
    // 실제로는 스토리지의 PDF 로 리다이렉트
    return NextResponse.redirect(pdf.url);
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
