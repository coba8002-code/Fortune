import { NextResponse } from "next/server";
import { buildReport } from "@/lib/report/build";
import { getServices } from "@/lib/services/container";
import type { Subject } from "@/types/report";

/**
 * POST /api/reports — 입력을 받아 결제 → 분석 → 저장 → PDF 큐 흐름을 실행한다.
 *
 * 설계(ARCHITECTURE.md §3): 결제 → 분석(ReportData 생성) → DB 저장 → 웹 즉시 제공 +
 * PDF 비동기 생성. 현재는 스텁 결제 + 인메모리 저장 + 인라인 큐(상태만 pending) 어댑터.
 */
export async function POST(req: Request) {
  let body: Partial<Subject>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (!body.name || !body.birth?.date || !body.gender) {
    return NextResponse.json(
      { error: "name, birth.date, gender 는 필수입니다." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY 가 설정되지 않아 리포트를 생성할 수 없습니다." },
      { status: 503 },
    );
  }

  const { payment, reportStore, jobQueue } = getServices();

  try {
    // 1) 결제 (스텁: 즉시 승인)
    const checkout = await payment.createCheckout({ amount: 9900, currency: "KRW" });
    if (!(await payment.verifyPaid(checkout.id))) {
      return NextResponse.json({ error: "결제가 확인되지 않았습니다." }, { status: 402 });
    }

    // 2) 분석 → ReportData 생성
    const report = await buildReport(body as Subject);

    // 3) 저장 (웹 리포트 즉시 열람 가능)
    await reportStore.save(report);

    // 4) PDF 비동기 생성 작업 등록
    await jobQueue.enqueuePdf(report.id);

    return NextResponse.json(
      { id: report.id, reportUrl: `/report/${report.id}`, report },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
