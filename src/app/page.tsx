import Link from "next/link";

/** 서비스 메뉴 9종 — 아이콘은 public/brand/menu/*.png */
const SERVICES = [
  { icon: "saju", label: "사주", desc: "타고난 기질과 원국", href: "/report/SAMPLE" },
  { icon: "unse", label: "운세", desc: "올해와 대운의 흐름", href: "/fortune/DEMO1980" },
  { icon: "gunghap", label: "궁합", desc: "두 사람의 인연 합", href: "/compat/DEMO" },
  { icon: "couple", label: "연애", desc: "연애·결혼 타이밍", href: "/compat/DEMO2" },
  { icon: "health", label: "건강", desc: "건강·심리 밸런스", href: "/report/SAMPLE" },
  { icon: "admission", label: "입시", desc: "합격·시험 전략", href: "/report/SAMPLE" },
  { icon: "strategy", label: "전략", desc: "직업·재물 전략", href: "/manual/SAMPLE" },
  { icon: "family", label: "가족", desc: "가족·부모 관계", href: "/report/SAMPLE" },
  { icon: "child", label: "자녀", desc: "자녀운·육아 길잡이", href: "/report/SAMPLE" },
];

/** 이벤트 배너 3종 — 배경은 public/brand/events/*.png */
const EVENTS = [
  { img: "launch", title: "런칭 기념", desc: "첫 리포트 무료 체험", href: "/report/SAMPLE" },
  { img: "gunghap", title: "궁합 스페셜", desc: "커플 궁합 리포트 20% 할인", href: "/compat/DEMO" },
  { img: "consult", title: "1:1 상담", desc: "전문가 심층 상담 예약", href: "/manual/SAMPLE" },
];

export default function Home() {
  return (
    <main className="lp">
      {/* 헤더 */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="lp-serif text-xl font-extrabold tracking-tight text-brand-ink">
          운명연구소
        </span>
        <nav className="hidden items-center gap-8 text-sm text-brand-coffee sm:flex">
          <a href="#services" className="transition hover:text-brand-ink">서비스</a>
          <a href="#events" className="transition hover:text-brand-ink">이벤트</a>
          <Link href="/report/SAMPLE" className="transition hover:text-brand-ink">샘플 리포트</Link>
        </nav>
        <Link href="/report/SAMPLE" className="lp-btn lp-btn-primary !px-5 !py-2.5 text-sm">
          시작하기
        </Link>
      </header>

      {/* 히어로 */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:gap-6 md:pt-16">
        <div className="order-2 text-center md:order-1 md:text-left">
          <span className="lp-eyebrow">Saju × Psychology</span>
          <h1 className="lp-serif mt-5 text-4xl font-extrabold leading-[1.2] tracking-tight text-brand-ink sm:text-5xl">
            나를 읽는
            <br />
            가장 우아한 방법
          </h1>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-brand-coffee md:mx-0">
            사주와 심리로 풀어내는 한 사람의 결.
            <br />
            캐릭터 카드부터 취급설명서까지, 한 권의 리포트로 담아드립니다.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:items-start md:justify-start">
            <Link href="/report/SAMPLE" className="lp-btn lp-btn-primary w-full sm:w-auto">
              샘플 리포트 열람
            </Link>
            <a href="#services" className="lp-btn lp-btn-ghost w-full sm:w-auto">
              서비스 둘러보기
            </a>
          </div>
          <p className="mt-6 text-xs tracking-wide text-brand-muted">
            사주 · 운세 · 궁합 · 취급설명서 — 9가지 심층 리포트
          </p>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <div className="relative">
            <div
              className="absolute inset-0 -z-10 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle at 50% 45%, rgba(168,139,92,0.28), transparent 65%)" }}
            />
            <div className="lp-float overflow-hidden rounded-[2.25rem] border border-brand-taupe/60 bg-brand-cream shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/char-hero.png"
                alt="한복을 입은 운명연구소 안내자"
                width={440}
                height={440}
                className="h-[300px] w-[300px] object-cover sm:h-[400px] sm:w-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 메뉴 */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <span className="lp-eyebrow">Services</span>
          <h2 className="lp-serif mt-3 text-3xl font-bold text-brand-ink">아홉 가지 리포트</h2>
          <div className="lp-hair mx-auto mt-5 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link key={s.icon} href={s.href} className="lp-card flex items-center gap-4 p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/brand/menu/${s.icon}.png`}
                alt={s.label}
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="lp-serif text-lg font-bold text-brand-ink">{s.label}</p>
                <p className="truncate text-sm text-brand-muted">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 이벤트 */}
      <section id="events" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <span className="lp-eyebrow">Events</span>
          <h2 className="lp-serif mt-3 text-3xl font-bold text-brand-ink">진행 중인 이벤트</h2>
          <div className="lp-hair mx-auto mt-5 w-20" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {EVENTS.map((e) => (
            <Link key={e.img} href={e.href} className="lp-card group overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/events/${e.img}.png`}
                  alt={e.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="lp-serif text-lg font-bold text-brand-ink">{e.title}</p>
                <p className="mt-1 text-sm text-brand-muted">{e.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="lp-card flex flex-col items-center gap-6 p-10 text-center md:p-14">
          <span className="lp-eyebrow">Begin</span>
          <h2 className="lp-serif text-3xl font-bold leading-tight text-brand-ink">
            지금, 나의 운명 프로파일을 펼쳐보세요
          </h2>
          <p className="max-w-md text-brand-coffee">
            생년월일만으로 시작하는 깊이 있는 한 권의 리포트.
          </p>
          <Link href="/report/SAMPLE" className="lp-btn lp-btn-primary">
            샘플 리포트 열람
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-brand-taupe/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-brand-muted sm:flex-row">
          <span className="lp-serif font-bold text-brand-coffee">운명연구소</span>
          <span>사주 × 심리로 읽는 나의 운명 프로파일</span>
        </div>
      </footer>
    </main>
  );
}
