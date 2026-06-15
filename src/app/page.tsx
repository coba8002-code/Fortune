import Link from "next/link";
import AppTabBar from "@/components/AppTabBar";
import OnboardingGate from "@/components/OnboardingGate";

/** 서비스 9종 — 아이콘: public/brand/menu/*.png */
const SERVICES = [
  { icon: "saju", label: "사주", href: "/report/SAMPLE" },
  { icon: "unse", label: "운세", href: "/fortune/DEMO1980" },
  { icon: "gunghap", label: "궁합", href: "/compat/DEMO" },
  { icon: "couple", label: "연애", href: "/compat/DEMO2" },
  { icon: "health", label: "건강", href: "/report/SAMPLE" },
  { icon: "admission", label: "학업", href: "/report/SAMPLE" },
  { icon: "strategy", label: "재물", href: "/manual/SAMPLE" },
  { icon: "family", label: "가족", href: "/report/SAMPLE" },
  { icon: "child", label: "자녀", href: "/report/SAMPLE" },
];

const EVENTS = [
  { img: "launch", title: "런칭 기념", desc: "첫 리포트 무료 체험", href: "/report/SAMPLE" },
  { img: "gunghap", title: "궁합 스페셜", desc: "커플 리포트 20% 할인", href: "/compat/DEMO" },
  { img: "consult", title: "오늘의 운세", desc: "출석하고 스탬프 받기", href: "/today" },
];

/** 마법사 등급(게이미피케이션) */
const TIERS = ["입문", "견습", "정식", "대마녀"];
const CURRENT_TIER = 0; // 입문
const TIER_PROGRESS = 35; // %

const Ico = {
  bell: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={p.className}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  star: (p: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M12 2.5l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.9 6.4 19.5l1.5-6.3L3 9l6.4-.5z" />
    </svg>
  ),
};

export default function Home() {
  return (
    <div className="app-stage">
      <OnboardingGate />
      <main className="app">
        {/* 상태바(목업) */}
        <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-witch-ink/70">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border border-current" />
            <span className="inline-block h-2.5 w-3.5 rounded-[3px] border border-current" />
          </span>
        </div>

        {/* 그라데이션 헤더 */}
        <header className="app-hero px-6 pb-6 pt-4">
          <div className="flex items-center justify-between">
            <span className="app-serif text-lg font-extrabold text-witch-ink">묘월의 마녀</span>
            <button className="app-press grid h-10 w-10 place-items-center rounded-full border border-witch-line bg-white/70 text-witch-ink">
              <Ico.bell className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-witch-line bg-white/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/char-emblem.png" alt="마법사 아바타" className="h-12 w-12 object-contain" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="app-pill"><Ico.star className="h-3 w-3" /> 입문 마법사</span>
              </div>
              <p className="mt-1 app-serif text-xl font-extrabold leading-tight text-witch-ink">
                안녕, 소연 마법사 🌙
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="flex flex-1 items-center justify-between rounded-2xl border border-witch-line bg-white/70 px-4 py-2.5">
              <span className="text-xs text-witch-muted">포인트</span>
              <span className="text-sm font-extrabold text-witch-ink">1,250P</span>
            </div>
            <div className="flex flex-1 items-center justify-between rounded-2xl border border-witch-line bg-white/70 px-4 py-2.5">
              <span className="text-xs text-witch-muted">쿠폰</span>
              <span className="text-sm font-extrabold text-witch-ink">3장</span>
            </div>
          </div>
        </header>

        {/* 오늘의 운세 출석 카드 */}
        <section className="px-5 pt-5">
          <Link href="/today" className="app-feature app-press relative block overflow-hidden p-6">
            <div className="relative z-10 max-w-[60%]">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white">
                🔥 5일째 출석 중
              </span>
              <p className="mt-3 app-serif text-xl font-extrabold leading-snug text-white">
                오늘의 운세,
                <br />
                카드 한 장 뽑아볼까?
              </p>
              <span className="app-btn app-btn-light mt-4">
                카드 뽑기 <span aria-hidden>🔮</span>
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/char-hero.png"
              alt="묘월의 마녀"
              className="app-float pointer-events-none absolute -bottom-3 -right-2 z-0 h-[168px] w-[168px] object-contain"
            />
          </Link>
        </section>

        {/* 마법사 등급 진행 */}
        <section className="px-5 pt-4">
          <div className="app-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-witch-ink">마법사 등급</p>
              <span className="text-xs text-witch-muted">다음 등급까지 65P</span>
            </div>
            <div className="relative mt-4 h-2 rounded-full bg-witch-line">
              <div
                className="absolute left-0 top-0 h-2 rounded-full"
                style={{ width: `${TIER_PROGRESS}%`, background: "linear-gradient(90deg,#7c6cd8,#a98bee)" }}
              />
            </div>
            <div className="mt-2 flex justify-between">
              {TIERS.map((t, i) => (
                <span key={t} className={`text-xs font-semibold ${i === CURRENT_TIER ? "text-witch-violet" : "text-witch-muted"}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 서비스 그리드 */}
        <section className="px-5 pt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-bold text-witch-ink">전체 서비스</h2>
            <span className="text-xs text-witch-muted">9가지 리포트</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SERVICES.map((s) => (
              <Link key={s.icon} href={s.href} className="app-card app-press flex flex-col items-center gap-2 py-4">
                <span className="app-tile-ico grid h-14 w-14 place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/menu/${s.icon}.png`} alt={s.label} className="h-11 w-11 object-contain" />
                </span>
                <span className="text-sm font-semibold text-witch-ink">{s.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 이벤트 */}
        <section id="events" className="pt-7">
          <div className="mb-3 flex items-baseline justify-between px-5">
            <h2 className="text-base font-bold text-witch-ink">진행 중인 이벤트</h2>
            <span className="text-xs text-witch-muted">전체보기</span>
          </div>
          <div className="app-scroll px-5 pb-1">
            {EVENTS.map((e) => (
              <Link key={e.img} href={e.href} className="app-card app-press w-[230px] shrink-0 overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/events/${e.img}.png`} alt={e.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-witch-ink">{e.title}</p>
                  <p className="mt-0.5 text-xs text-witch-muted">{e.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 리포트 시작 CTA */}
        <section className="px-5 pt-7">
          <div className="app-card flex items-center justify-between gap-4 p-5">
            <div>
              <p className="app-serif text-base font-bold text-witch-ink">나의 운명 프로파일</p>
              <p className="mt-1 text-xs text-witch-muted">생년월일만으로 시작하는 한 권의 리포트</p>
            </div>
            <Link href="/checkout" className="app-btn app-btn-primary shrink-0">시작</Link>
          </div>
        </section>

        <AppTabBar active="home" />
      </main>
    </div>
  );
}
