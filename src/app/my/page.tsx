"use client";

import Link from "next/link";
import { useState } from "react";
import AppTabBar from "@/components/AppTabBar";

const HOURS = [
  "모름",
  "자시 (23:30~01:29)",
  "축시 (01:30~03:29)",
  "인시 (03:30~05:29)",
  "묘시 (05:30~07:29)",
  "진시 (07:30~09:29)",
  "사시 (09:30~11:29)",
  "오시 (11:30~13:29)",
  "미시 (13:30~15:29)",
  "신시 (15:30~17:29)",
  "유시 (17:30~19:29)",
  "술시 (19:30~21:29)",
  "해시 (21:30~23:29)",
];

/** 토글 스위치 */
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="relative h-6 w-11 rounded-full transition-colors"
      style={{ background: on ? "linear-gradient(90deg,#7c6cd8,#a98bee)" : "#e3def0" }}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

const MENU = [
  { label: "결제 내역", icon: "💳", href: "/report/SAMPLE" },
  { label: "찜한 리포트", icon: "💜", href: "/report/SAMPLE" },
  { label: "쿠폰함", icon: "🎟️", href: "/reward" },
  { label: "공지사항", icon: "📢", href: "/" },
  { label: "1:1 문의", icon: "💬", href: "/" },
];

export default function My() {
  const [birth, setBirth] = useState("1995-03-21");
  const [hour, setHour] = useState(HOURS[7]); // 오시
  const [gender, setGender] = useState<"여" | "남">("여");
  const [cal, setCal] = useState<"양력" | "음력">("양력");
  const [saved, setSaved] = useState(false);

  const [notif, setNotif] = useState({ daily: true, event: true, marketing: false });
  const toggle = (k: keyof typeof notif) => setNotif((n) => ({ ...n, [k]: !n[k] }));

  const onChange = (fn: () => void) => { fn(); setSaved(false); };

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

        {/* 헤더 + 프로필 */}
        <header className="app-hero px-5 pb-6 pt-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="app-press grid h-10 w-10 place-items-center rounded-full border border-witch-line bg-white/70 text-witch-ink" aria-label="홈으로">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 18l-6-6 6-6" /></svg>
            </Link>
            <span className="app-serif text-base font-extrabold text-witch-ink">MY</span>
            <span className="h-10 w-10" />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-witch-line bg-white/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/char-emblem.png" alt="프로필" className="h-14 w-14 object-contain" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="app-serif text-xl font-extrabold text-witch-ink">소연 마법사</p>
                <span className="app-pill">🌱 입문</span>
              </div>
              <p className="mt-0.5 text-xs text-witch-muted">soyeon@vernalwitch.com</p>
            </div>
          </div>
        </header>

        {/* 내 사주 정보 (정확도) */}
        <section className="px-5 pt-5">
          <div className="app-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-witch-ink">내 사주 정보</p>
              <span className="app-pill">정확도 향상</span>
            </div>
            <p className="mt-1 text-xs text-witch-muted">출생 시각까지 입력하면 사주 풀이가 더 정확해져요.</p>

            <label className="mt-4 block text-xs font-semibold text-witch-ink">생년월일</label>
            <input
              type="date"
              value={birth}
              onChange={(e) => onChange(() => setBirth(e.target.value))}
              className="mt-1.5 w-full rounded-2xl border border-witch-line bg-witch-cream px-4 py-3 text-sm text-witch-ink outline-none focus:border-witch-violet"
            />

            <label className="mt-3 block text-xs font-semibold text-witch-ink">태어난 시각</label>
            <select
              value={hour}
              onChange={(e) => onChange(() => setHour(e.target.value))}
              className="mt-1.5 w-full rounded-2xl border border-witch-line bg-witch-cream px-4 py-3 text-sm text-witch-ink outline-none focus:border-witch-violet"
            >
              {HOURS.map((h) => <option key={h}>{h}</option>)}
            </select>

            <div className="mt-3 flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-witch-ink">성별</label>
                <div className="mt-1.5 flex rounded-2xl border border-witch-line bg-witch-cream p-1">
                  {(["여", "남"] as const).map((g) => (
                    <button key={g} type="button" onClick={() => onChange(() => setGender(g))}
                      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${gender === g ? "bg-white text-witch-violet shadow-sm" : "text-witch-muted"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-witch-ink">양/음력</label>
                <div className="mt-1.5 flex rounded-2xl border border-witch-line bg-witch-cream p-1">
                  {(["양력", "음력"] as const).map((c) => (
                    <button key={c} type="button" onClick={() => onChange(() => setCal(c))}
                      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${cal === c ? "bg-white text-witch-violet shadow-sm" : "text-witch-muted"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="button" onClick={() => setSaved(true)} className="app-btn app-btn-primary mt-5 flex w-full">
              {saved ? "✓ 저장되었어요" : "저장하기"}
            </button>
          </div>
        </section>

        {/* 알림 설정 */}
        <section className="px-5 pt-5">
          <div className="app-card divide-y divide-witch-line p-1.5">
            <p className="px-3.5 pb-2 pt-3 text-sm font-bold text-witch-ink">알림 설정</p>
            {([
              ["daily", "오늘의 운세 알림", "매일 아침 마녀의 카드 알림"],
              ["event", "이벤트·혜택 소식", "쿠폰·이벤트 안내"],
              ["marketing", "마케팅 정보 수신", "맞춤 추천·프로모션"],
            ] as const).map(([k, title, desc]) => (
              <div key={k} className="flex items-center justify-between px-3.5 py-3">
                <div>
                  <p className="text-sm font-semibold text-witch-ink">{title}</p>
                  <p className="text-[11px] text-witch-muted">{desc}</p>
                </div>
                <Toggle on={notif[k]} onClick={() => toggle(k)} />
              </div>
            ))}
          </div>
        </section>

        {/* 메뉴 리스트 */}
        <section className="px-5 pt-5">
          <div className="app-card divide-y divide-witch-line">
            {MENU.map((m) => (
              <Link key={m.label} href={m.href} className="app-press flex items-center gap-3 px-4 py-3.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-witch-cream text-base">{m.icon}</span>
                <span className="flex-1 text-sm font-semibold text-witch-ink">{m.label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-witch-muted"><path d="M9 6l6 6-6 6" /></svg>
              </Link>
            ))}
          </div>
          <button type="button" className="mt-4 w-full py-2 text-center text-xs text-witch-muted">로그아웃</button>
          <p className="mt-1 mb-2 text-center text-[11px] text-witch-muted/70">묘월의 마녀 v1.0.0</p>
        </section>

        <AppTabBar active="my" />
      </main>
    </div>
  );
}
