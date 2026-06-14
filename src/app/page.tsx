import Link from "next/link";

/** 서비스 9종 — 아이콘: public/brand/menu/*.png */
const SERVICES = [
  { icon: "saju", label: "사주", href: "/report/SAMPLE" },
  { icon: "unse", label: "운세", href: "/fortune/DEMO1980" },
  { icon: "gunghap", label: "궁합", href: "/compat/DEMO" },
  { icon: "couple", label: "연애", href: "/compat/DEMO2" },
  { icon: "health", label: "건강", href: "/report/SAMPLE" },
  { icon: "admission", label: "입시", href: "/report/SAMPLE" },
  { icon: "strategy", label: "전략", href: "/manual/SAMPLE" },
  { icon: "family", label: "가족", href: "/report/SAMPLE" },
  { icon: "child", label: "자녀", href: "/report/SAMPLE" },
];

/** 이벤트 3종 — 배경: public/brand/events/*.png */
const EVENTS = [
  { img: "launch", title: "런칭 기념", desc: "첫 리포트 무료 체험", href: "/report/SAMPLE" },
  { img: "gunghap", title: "궁합 스페셜", desc: "커플 리포트 20% 할인", href: "/compat/DEMO" },
  { img: "consult", title: "1:1 상담", desc: "전문가 심층 상담", href: "/manual/SAMPLE" },
];

/* ── 아이콘(인라인 SVG) ─────────────────────────────────────── */
const Ico = {
  bell: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  home: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  doc: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M6 2h8l4 4v16H6z" /><path d="M14 2v4h4M9 13h6M9 17h6" />
    </svg>
  ),
  heart: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  ),
  gift: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M4 9h16v11H4zM2 9h20v3H2zM12 9v11M12 9S9 9 8 7a2 2 0 0 1 4-1 2 2 0 0 1 4 1c-1 2-4 2-4 2z" />
    </svg>
  ),
  user: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
};

const TABS = [
  { key: "home", label: "홈", href: "/", icon: Ico.home, active: true },
  { key: "report", label: "리포트", href: "/report/SAMPLE", icon: Ico.doc },
  { key: "compat", label: "궁합", href: "/compat/DEMO", icon: Ico.heart },
  { key: "event", label: "이벤트", href: "#events", icon: Ico.gift },
  { key: "my", label: "MY", href: "/report/SAMPLE", icon: Ico.user },
];

export default function Home() {
  return (
    <div className="app-stage">
      <main className="app">
        {/* 상태바(목업) */}
        <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-brand-ink/70">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border border-current" />
            <span className="inline-block h-2.5 w-3.5 rounded-[3px] border border-current" />
          </span>
        </div>

        {/* 앱바 */}
        <header className="flex items-center justify-between px-6 pt-4">
          <div>
            <p className="text-sm text-[color:var(--a-muted)]">안녕하세요 👋</p>
            <h1 className="app-serif text-xl font-extrabold text-[color:var(--a-ink)]">
              운명연구소
            </h1>
          </div>
          <button className="app-press grid h-11 w-11 place-items-center rounded-full border border-[color:var(--a-line)] bg-white text-[color:var(--a-ink)] shadow-sm">
            <Ico.bell className="h-5 w-5" />
          </button>
        </header>

        {/* 피처 카드 */}
        <section className="px-5 pt-5">
          <Link href="/report/SAMPLE" className="app-feature app-press relative block overflow-hidden p-6">
            <div className="relative z-10 max-w-[58%]">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white">
                오늘의 운세
              </span>
              <p className="mt-3 text-xl font-extrabold leading-snug text-white">
                나를 읽는
                <br />
                가장 우아한 방법
              </p>
              <span className="app-btn app-btn-light mt-4">
                내 리포트 열기
                <span aria-hidden>→</span>
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/char-hero.png"
              alt="한복 안내자"
              className="app-float pointer-events-none absolute -bottom-2 -right-3 z-0 h-[150px] w-[150px] rounded-3xl object-cover opacity-95"
            />
          </Link>
        </section>

        {/* 서비스 그리드 */}
        <section className="px-5 pt-7">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-bold text-[color:var(--a-ink)]">전체 서비스</h2>
            <span className="text-xs text-[color:var(--a-muted)]">9가지 리포트</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SERVICES.map((s) => (
              <Link key={s.icon} href={s.href} className="app-card app-press flex flex-col items-center gap-2 py-4">
                <span className="app-tile-ico grid h-14 w-14 place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/menu/${s.icon}.png`} alt={s.label} className="h-11 w-11 object-contain" />
                </span>
                <span className="text-sm font-semibold text-[color:var(--a-ink)]">{s.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 이벤트 카루셀 */}
        <section id="events" className="pt-8">
          <div className="mb-3 flex items-baseline justify-between px-5">
            <h2 className="text-base font-bold text-[color:var(--a-ink)]">진행 중인 이벤트</h2>
            <span className="text-xs text-[color:var(--a-muted)]">전체보기</span>
          </div>
          <div className="app-scroll px-5 pb-1">
            {EVENTS.map((e) => (
              <Link
                key={e.img}
                href={e.href}
                className="app-card app-press w-[230px] shrink-0 overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/events/${e.img}.png`} alt={e.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-[color:var(--a-ink)]">{e.title}</p>
                  <p className="mt-0.5 text-xs text-[color:var(--a-muted)]">{e.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 시작 CTA */}
        <section className="px-5 pt-8">
          <div className="app-card flex items-center justify-between gap-4 p-5">
            <div>
              <p className="app-serif text-base font-bold text-[color:var(--a-ink)]">
                나의 운명 프로파일
              </p>
              <p className="mt-1 text-xs text-[color:var(--a-muted)]">
                생년월일만으로 시작하는 한 권의 리포트
              </p>
            </div>
            <Link href="/report/SAMPLE" className="app-btn app-btn-primary shrink-0">
              시작
            </Link>
          </div>
        </section>

        {/* 하단 탭바 */}
        <nav className="app-tabbar">
          {TABS.map((t) => {
            const I = t.icon;
            return (
              <Link key={t.key} href={t.href} data-active={t.active ? "true" : "false"} className="app-tab">
                <I className="h-[22px] w-[22px]" />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
