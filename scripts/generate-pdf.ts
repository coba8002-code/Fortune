/**
 * STEP3 — PDF 생성 워커 (Playwright).
 *
 * 웹 리포트 페이지(report/:id?print=1)를 헤드리스 Chromium 으로 렌더해 PDF 로 굽는다.
 * 웹과 동일한 컴포넌트를 그대로 인쇄하므로 디자인 소스는 하나(Single Source of Truth).
 *
 * 사용:
 *   npm run dev               # 다른 터미널에서 서버 기동
 *   npm run pdf -- SAMPLE     # report/SAMPLE 을 PDF 로 저장
 *
 * 환경변수:
 *   BASE_URL  (기본 http://localhost:3000)
 *   OUT_DIR   (기본 ./tmp)
 *
 * 실제 서비스에서는 결제→분석 완료 이벤트가 이 워커를 큐로 호출하고,
 * 산출물을 객체 스토리지에 업로드한 뒤 ReportData.pdf.url 을 갱신한다.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

async function main() {
  const id = process.argv[2] ?? "SAMPLE";
  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const outDir = process.env.OUT_DIR ?? path.resolve(process.cwd(), "tmp");
  const url = `${baseUrl}/report/${id}?print=1`;

  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${id}.pdf`);

  console.log(`[pdf] rendering ${url}`);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    // 인쇄 미디어 쿼리(@media print)를 적용한 상태로 PDF 생성
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
    });
    console.log(`[pdf] saved → ${outPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("[pdf] failed:", err);
  process.exit(1);
});
