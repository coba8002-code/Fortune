import Link from "next/link";

/**
 * 리포트 계열 페이지 상단 내비 — 앱(홈)으로 복귀 동선.
 * no-print 로 PDF/인쇄에는 출력되지 않는다.
 */
export default function ReportNav({ title = "묘월의 마녀" }: { title?: string }) {
  return (
    <div className="no-print sticky top-0 z-30 border-b border-gold/15 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          aria-label="홈으로"
          className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-ivory transition hover:bg-gold/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <span className="font-display text-sm font-bold text-ivory">{title}</span>
        <Link href="/" className="text-xs font-semibold text-ivory/55 transition hover:text-ivory">홈</Link>
      </div>
    </div>
  );
}
