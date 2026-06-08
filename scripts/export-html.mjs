/**
 * 렌더된 웹 리포트를 단일 HTML 파일로 내보낸다(CSS 인라인, 스크립트 제거).
 *
 * 브라우저 없이도 결과물을 그대로 열어볼 수 있게, 실행 중인 서버의 SSR HTML 과
 * Tailwind CSS 를 하나로 합친다.
 *
 * 사용:
 *   npm run build && npm start        # 서버 기동
 *   node scripts/export-html.mjs SAMPLE [out.html]          # → /report/SAMPLE
 *   node scripts/export-html.mjs /manual/DEMO1980 [out.html] # 경로 직접 지정
 */
import { writeFileSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const arg = process.argv[2] ?? "SAMPLE";
// "/" 로 시작하면 경로 그대로, 아니면 /report/:id 로 해석
const path = arg.startsWith("/") ? arg : `/report/${arg}`;
const slug = arg.replace(/^\//, "").replace(/\//g, "-");
const out = process.argv[3] ?? `fortune-${slug}.html`;

const res = await fetch(`${base}${path}`);
if (!res.ok) {
  console.error(`[export] ${res.status} ${res.statusText}`);
  process.exit(1);
}
let html = await res.text();

// 스타일시트 <link> 들을 찾아 내용을 인라인
const linkRe = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g;
const hrefs = [...html.matchAll(linkRe)].map((m) => m[1]);
let css = "";
for (const href of hrefs) {
  const url = href.startsWith("http") ? href : base + href;
  const r = await fetch(url);
  if (r.ok) css += (await r.text()) + "\n";
}

html = html
  .replace(linkRe, "") // 외부 CSS 링크 제거
  .replace(/<script[\s\S]*?<\/script>/g, "") // Next 하이드레이션 스크립트 제거(정적 보기)
  .replace("</head>", `<style>${css}</style></head>`);

writeFileSync(out, html);
console.log(`[export] saved → ${out} (${(html.length / 1024).toFixed(0)} KB, css ${(css.length / 1024).toFixed(0)} KB)`);
