import { NextResponse } from "next/server";
import { buildReport } from "@/lib/report/build";
import type { Subject } from "@/types/report";

/**
 * POST /api/reports — 입력을 받아 리포트를 생성한다.
 *
 * 설계(ARCHITECTURE.md §4): 실제로는 결제 → 분석 큐 → DB 저장 흐름이지만,
 * 데모 단계에서는 동기 생성 후 ReportData 를 그대로 반환한다.
 * (저장소 연동 전까지는 영속화하지 않으므로 id 는 재조회되지 않음 — store.ts 스텁 참고)
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

  try {
    const report = await buildReport(body as Subject);
    return NextResponse.json({ id: report.id, report }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
