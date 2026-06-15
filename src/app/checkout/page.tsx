"use client";

import Link from "next/link";
import { useState } from "react";

const BASE = 9900;
const METHODS = [
  { key: "kakao", label: "카카오페이", emoji: "💛" },
  { key: "naver", label: "네이버페이", emoji: "💚" },
  { key: "card", label: "신용·체크카드", emoji: "💳" },
] as const;

const won = (n: number) => `${n.toLocaleString()}원`;

export default function Checkout() {
  const [coupon, setCoupon] = useState(true);
  const [method, setMethod] = useState<(typeof METHODS)[number]["key"]>("kakao");
  const [done, setDone] = useState(false);

  const discount = coupon ? Math.round(BASE * 0.5) : 0;
  const total = BASE - discount;

  if (done) {
    return (
      <div className="app-stage">
        <main className="app flex flex-col items-center justify-center px-8 text-center" style={{ paddingBottom: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/char-hero.png" alt="묘월의 마녀" className="app-pop h-52 w-52 object-contain" />
          <h1 className="app-serif mt-2 text-2xl font-extrabold text-witch-ink">결제 완료! 🎉</h1>
          <p className="mt-3 leading-relaxed text-witch-ink/70">
            너의 운명 프로파일이 준비됐어.
            <br />
            지금 바로 펼쳐볼까?
          </p>
          <p className="mt-4 text-sm font-bold text-witch-violet">+50P 적립 · 스탬프 1개 획득</p>
          <Link href="/report/SAMPLE" className="app-btn app-btn-primary mt-7 w-full max-w-xs">리포트 보기</Link>
          <Link href="/" className="mt-3 text-xs text-witch-muted">홈으로</Link>
        </main>
      </div>
    );
  }

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

        {/* 헤더 */}
        <header className="app-hero px-5 pb-5 pt-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="app-press grid h-10 w-10 place-items-center rounded-full border border-witch-line bg-white/70 text-witch-ink" aria-label="뒤로">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 18l-6-6 6-6" /></svg>
            </Link>
            <span className="app-serif text-base font-extrabold text-witch-ink">결제하기</span>
            <span className="h-10 w-10" />
          </div>
        </header>

        {/* 상품 */}
        <section className="px-5 pt-5">
          <div className="app-card flex gap-4 p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/menu/saju.png" alt="" className="h-16 w-16 shrink-0 object-contain" />
            <div className="flex-1">
              <p className="app-serif text-base font-bold text-witch-ink">운명 프로파일 · 프리미엄</p>
              <p className="mt-1 text-xs text-witch-muted">사주 원국 · 오행 · 심리 캐릭터 카드 · 10가지 심층 분석 · 취급설명서</p>
              <p className="mt-2 text-sm font-extrabold text-witch-ink">{won(BASE)}</p>
            </div>
          </div>
        </section>

        {/* 쿠폰 */}
        <section className="px-5 pt-4">
          <button
            type="button"
            onClick={() => setCoupon((v) => !v)}
            className="app-card flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-witch-cream text-xl">🎟️</span>
              <div>
                <p className="text-sm font-bold text-witch-ink">첫 리포트 50% 할인</p>
                <p className="text-xs text-witch-muted">{coupon ? "적용됨" : "탭하여 적용"}</p>
              </div>
            </div>
            <span className={`relative h-6 w-11 rounded-full transition-colors`} style={{ background: coupon ? "linear-gradient(90deg,#7c6cd8,#a98bee)" : "#e3def0" }}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${coupon ? "left-[22px]" : "left-0.5"}`} />
            </span>
          </button>
        </section>

        {/* 결제 수단 */}
        <section className="px-5 pt-4">
          <p className="mb-2 px-1 text-sm font-bold text-witch-ink">결제 수단</p>
          <div className="app-card divide-y divide-witch-line">
            {METHODS.map((m) => (
              <button key={m.key} type="button" onClick={() => setMethod(m.key)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <span className="text-xl">{m.emoji}</span>
                <span className="flex-1 text-sm font-semibold text-witch-ink">{m.label}</span>
                <span className={`grid h-5 w-5 place-items-center rounded-full border ${method === m.key ? "border-witch-violet" : "border-witch-line"}`}>
                  {method === m.key && <span className="h-2.5 w-2.5 rounded-full bg-witch-violet" />}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 금액 요약 */}
        <section className="px-5 pt-4">
          <div className="app-card p-5 text-sm">
            <div className="flex justify-between text-witch-muted"><span>상품 금액</span><span>{won(BASE)}</span></div>
            <div className="mt-2 flex justify-between text-witch-muted"><span>쿠폰 할인</span><span className="text-witch-violet">- {won(discount)}</span></div>
            <div className="mt-3 border-t border-witch-line pt-3 flex items-center justify-between">
              <span className="font-bold text-witch-ink">최종 결제 금액</span>
              <span className="app-serif text-xl font-extrabold text-witch-ink">{won(total)}</span>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-witch-muted">* 데모 화면입니다. 실제 결제는 이뤄지지 않아요.</p>
        </section>

        {/* 결제 버튼 */}
        <section className="px-5 pb-8 pt-5">
          <button type="button" onClick={() => setDone(true)} className="app-btn app-btn-primary flex w-full py-4 text-base">
            {won(total)} 결제하기
          </button>
        </section>
      </main>
    </div>
  );
}
