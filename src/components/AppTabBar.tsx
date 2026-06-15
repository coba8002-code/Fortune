import Link from "next/link";

type Tab = "home" | "fortune" | "reward" | "my";

const I = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
      <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px]">
      <path d="M12 2.5l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.9 6.4 19.5l1.5-6.3L3 9l6.4-.5z" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
};

/** 앱 하단 탭바 — 가운데 FAB = 오늘의 운세(/today) */
export default function AppTabBar({ active }: { active: Tab }) {
  return (
    <nav className="app-tabbar">
      <Link href="/" data-active={active === "home"} className="app-tab">{I.home}홈</Link>
      <Link href="/today" data-active={active === "fortune"} className="app-tab">{I.moon}운세</Link>
      <div className="relative flex justify-center">
        <Link
          href="/today"
          className="app-press absolute -top-7 grid h-14 w-14 place-items-center rounded-full text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#7c6cd8,#a98bee)", boxShadow: "0 12px 24px -8px rgba(124,108,216,0.7)" }}
          aria-label="오늘의 운세"
        >
          <span className="text-xl">🔮</span>
        </Link>
        <span className="mt-9 text-[0.66rem] text-witch-muted">오늘운세</span>
      </div>
      <Link href="/reward" data-active={active === "reward"} className="app-tab">{I.star}마법사</Link>
      <Link href="/my" data-active={active === "my"} className="app-tab">{I.user}MY</Link>
    </nav>
  );
}
