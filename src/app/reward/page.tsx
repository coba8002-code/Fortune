import Link from "next/link";
import AppTabBar from "@/components/AppTabBar";

const TIERS = [
  { name: "입문", emoji: "🌱" },
  { name: "견습", emoji: "🔮" },
  { name: "정식", emoji: "🌙" },
  { name: "대마녀", emoji: "👑" },
];
const CURRENT_TIER = 0;
const TIER_PROGRESS = 35; // %

const STAMP_TOTAL = 20;
const STAMP_FILLED = 15;

const COUPONS = [
  { title: "첫 리포트 50% 할인", sub: "사주 운명 프로파일", due: "D-5", href: "/report/SAMPLE" },
  { title: "궁합 리포트 3,000원 할인", sub: "커플 케미 리포트", due: "D-12", href: "/compat/DEMO" },
  { title: "오늘의 운세 프리미엄 1회", sub: "심층 타로 해석", due: "D-3", href: "/today" },
];

export default function Reward() {
  return (
    <div className="app-stage">
      <main className="app">
        {/* 상태바 */}
        <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-witch-ink/70">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border border-current" />
            <span className="inline-block h-2.5 w-3.5 rounded-[3px] border border-current" />
          </span>
        </div>

        {/* 헤더 + 등급 카드 */}
        <header className="app-hero px-5 pb-6 pt-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="app-press grid h-10 w-10 place-items-center rounded-full border border-witch-line bg-white/70 text-witch-ink" aria-label="홈으로">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 18l-6-6 6-6" /></svg>
            </Link>
            <span className="app-serif text-base font-extrabold text-witch-ink">마법사</span>
            <span className="h-10 w-10" />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-witch-line bg-white/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/char-emblem.png" alt="마법사 아바타" className="h-14 w-14 object-contain" />
            </span>
            <div>
              <p className="text-xs text-witch-muted">소연 마법사</p>
              <p className="app-serif text-2xl font-extrabold leading-tight text-witch-ink">입문 마법사 🌱</p>
              <p className="mt-0.5 text-xs text-witch-violet">다음 등급(견습)까지 65P</p>
            </div>
          </div>

          {/* 등급 진행바 */}
          <div className="relative mt-4 h-2 rounded-full bg-white/70">
            <div className="absolute left-0 top-0 h-2 rounded-full" style={{ width: `${TIER_PROGRESS}%`, background: "linear-gradient(90deg,#7c6cd8,#a98bee)" }} />
          </div>
          <div className="mt-2 flex justify-between">
            {TIERS.map((t, i) => (
              <span key={t.name} className={`text-xs font-semibold ${i === CURRENT_TIER ? "text-witch-violet" : "text-witch-muted"}`}>
                {t.emoji} {t.name}
              </span>
            ))}
          </div>
        </header>

        {/* 포인트/쿠폰 요약 */}
        <section className="px-5 pt-5">
          <div className="flex gap-3">
            <div className="app-card flex flex-1 flex-col items-center py-4">
              <p className="text-xs text-witch-muted">포인트</p>
              <p className="mt-1 app-serif text-xl font-extrabold text-witch-ink">1,250P</p>
            </div>
            <div className="app-card flex flex-1 flex-col items-center py-4">
              <p className="text-xs text-witch-muted">쿠폰</p>
              <p className="mt-1 app-serif text-xl font-extrabold text-witch-ink">3장</p>
            </div>
            <div className="app-card flex flex-1 flex-col items-center py-4">
              <p className="text-xs text-witch-muted">연속 출석</p>
              <p className="mt-1 app-serif text-xl font-extrabold text-witch-ink">5일🔥</p>
            </div>
          </div>
        </section>

        {/* 출석 현황 */}
        <section className="px-5 pt-5">
          <div className="app-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-witch-ink">이번 주 출석</p>
              <Link href="/today" className="text-xs font-semibold text-witch-violet">오늘 출석하기 →</Link>
            </div>
            <div className="mt-4 flex justify-between">
              {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => {
                const done = i <= 4; // 금요일까지 출석
                return (
                  <div key={d} className="flex flex-col items-center gap-1.5">
                    <span className={`grid h-9 w-9 place-items-center rounded-full text-sm ${done ? "text-white" : "border border-witch-line bg-white text-witch-muted"}`} style={done ? { background: "linear-gradient(135deg,#7c6cd8,#a98bee)" } : undefined}>
                      {done ? "✓" : ""}
                    </span>
                    <span className="text-[11px] text-witch-muted">{d}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-center text-xs text-witch-muted">5일 연속 출석 달성! 보너스 스탬프를 받았어요 🎁</p>
          </div>
        </section>

        {/* 스탬프 보드 */}
        <section className="px-5 pt-5">
          <div className="app-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-witch-ink">스탬프 보드</p>
              <span className="text-xs text-witch-muted">{STAMP_FILLED} / {STAMP_TOTAL}</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {Array.from({ length: STAMP_TOTAL }).map((_, i) => {
                const filled = i < STAMP_FILLED;
                const milestone = (i + 1) % 5 === 0;
                return (
                  <div
                    key={i}
                    className={`grid aspect-square place-items-center rounded-2xl text-lg ${
                      filled
                        ? "text-white"
                        : "border border-dashed border-witch-line bg-witch-cream text-witch-muted/50"
                    }`}
                    style={filled ? { background: milestone ? "linear-gradient(135deg,#f0b27a,#fad7be)" : "linear-gradient(135deg,#7c6cd8,#a98bee)" } : undefined}
                  >
                    {milestone ? "🎁" : filled ? "✦" : ""}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 rounded-2xl bg-witch-mint/30 px-4 py-2.5 text-center text-xs font-semibold text-witch-ink">
              앞으로 5개만 더 모으면 쿠폰을 받을 수 있어요!
            </p>
            <ul className="mt-3 space-y-1 text-[11px] leading-relaxed text-witch-muted">
              <li>· 출석체크 1회마다 스탬프 1개가 지급돼요.</li>
              <li>· 5개 단위(🎁)마다 보너스 쿠폰을 드려요.</li>
              <li>· 20개를 모으면 등급이 한 단계 올라가요.</li>
            </ul>
          </div>
        </section>

        {/* 쿠폰함 */}
        <section className="px-5 pt-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-bold text-witch-ink">내 쿠폰함</h2>
            <span className="text-xs text-witch-muted">{COUPONS.length}장</span>
          </div>
          <div className="space-y-3">
            {COUPONS.map((c) => (
              <div key={c.title} className="app-card flex items-center gap-4 overflow-hidden p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: "linear-gradient(135deg,#f1ecfd,#fdf5ef)" }}>🎟️</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-witch-ink">{c.title}</p>
                  <p className="truncate text-xs text-witch-muted">{c.sub} · <span className="text-witch-violet">{c.due}</span></p>
                </div>
                <Link href={c.href} className="app-btn app-btn-primary shrink-0 !px-4 !py-2 text-xs">사용</Link>
              </div>
            ))}
          </div>
        </section>

        <AppTabBar active="reward" />
      </main>
    </div>
  );
}
