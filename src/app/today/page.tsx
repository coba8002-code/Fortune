"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppTabBar from "@/components/AppTabBar";

type Card = {
  name: string;
  en: string;
  emoji: string;
  score: number;
  element: string;
  keywords: string[];
  message: string; // 마녀의 한 줄(다정한 반말)
  luckyColor: string;
  luckyColorHex: string;
  luckyNumber: number;
};

const CARDS: Card[] = [
  { name: "달", en: "The Moon", emoji: "🌙", score: 72, element: "수(水)", keywords: ["직관", "감정", "쉼"], message: "오늘은 마음이 살짝 일렁이는 날. 머리보다 마음의 소리를 한 번 믿어봐.", luckyColor: "딥블루", luckyColorHex: "#6E8BA6", luckyNumber: 7 },
  { name: "별", en: "The Star", emoji: "⭐", score: 88, element: "금(金)", keywords: ["희망", "회복", "영감"], message: "흐렸던 마음이 개는 날이야. 작게 바라던 일에 한 걸음 내디뎌도 좋아.", luckyColor: "민트", luckyColorHex: "#7C9A74", luckyNumber: 3 },
  { name: "태양", en: "The Sun", emoji: "☀️", score: 95, element: "화(火)", keywords: ["활력", "성취", "자신감"], message: "기운이 활짝 핀 날! 미뤄둔 일도 오늘은 술술 풀릴 거야. 네 빛을 믿어.", luckyColor: "코랄", luckyColorHex: "#C2705A", luckyNumber: 9 },
  { name: "연인", en: "The Lovers", emoji: "💞", score: 80, element: "목(木)", keywords: ["인연", "선택", "조화"], message: "사람 사이의 온기가 도는 날. 망설이던 연락, 오늘 먼저 건네봐도 좋아.", luckyColor: "라일락", luckyColorHex: "#A98BEE", luckyNumber: 2 },
  { name: "운명의 수레바퀴", en: "Wheel of Fortune", emoji: "🎡", score: 76, element: "토(土)", keywords: ["전환", "기회", "흐름"], message: "흐름이 바뀌는 작은 신호가 올 거야. 변화를 너무 겁내지 말고 가볍게 타.", luckyColor: "샌드", luckyColorHex: "#C2A36B", luckyNumber: 5 },
  { name: "여사제", en: "High Priestess", emoji: "🔮", score: 70, element: "수(水)", keywords: ["통찰", "비밀", "고요"], message: "오늘은 말보다 관찰이 유리해. 조용히 지켜보면 답이 먼저 다가올 거야.", luckyColor: "퍼플", luckyColorHex: "#7C6CD8", luckyNumber: 4 },
];

function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export default function Today() {
  const [today, setToday] = useState<Date | null>(null);
  const [flipped, setFlipped] = useState(false);

  // 날짜는 마운트 후 계산(하이드레이션 불일치 방지)
  useEffect(() => setToday(new Date()), []);

  const card = today ? CARDS[dayOfYear(today) % CARDS.length] : CARDS[0];
  const dateLabel = today
    ? `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
    : "";

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

        {/* 앱바 */}
        <header className="app-hero px-5 pb-6 pt-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="app-press grid h-10 w-10 place-items-center rounded-full border border-witch-line bg-white/70 text-witch-ink" aria-label="홈으로">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 18l-6-6 6-6" /></svg>
            </Link>
            <span className="app-serif text-base font-extrabold text-witch-ink">오늘의 운세</span>
            <span className="h-10 w-10" />
          </div>
          <p className="mt-3 text-center text-xs text-witch-muted">{dateLabel}</p>
          <p className="mt-1 text-center app-serif text-lg font-extrabold text-witch-ink">
            {flipped ? "오늘의 카드를 펼쳤어요" : "마녀가 카드를 섞고 있어요"}
          </p>
        </header>

        {/* 카드 */}
        <section className="flex flex-col items-center px-6 pt-7">
          <div className={`flip w-[230px] ${flipped ? "is-on" : ""}`} style={{ height: "330px" }}>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              disabled={flipped}
              className={`flip-inner ${flipped ? "" : "app-press"} block w-full text-left`}
              aria-label="카드 뽑기"
            >
              {/* 뒷면(face-down) */}
              <div className="flip-face card-back">
                <span className="app-twinkle absolute left-6 top-8 text-lg">✦</span>
                <span className="app-twinkle absolute right-7 top-14 text-sm" style={{ animationDelay: "0.6s" }}>✦</span>
                <span className="app-twinkle absolute bottom-12 left-10 text-base" style={{ animationDelay: "1.1s" }}>✦</span>
                <span className="app-float text-6xl">🌙</span>
                <p className="mt-5 text-sm font-semibold text-white/85">탭하여 오늘의 카드를 뽑기</p>
              </div>
              {/* 앞면(reveal) */}
              <div className="flip-face flip-back card-front">
                <span className="text-[11px] font-bold tracking-[0.25em] text-witch-violet">{card.en.toUpperCase()}</span>
                <span className="mt-3 text-6xl">{card.emoji}</span>
                <p className="mt-3 app-serif text-2xl font-extrabold text-witch-ink">{card.name}</p>
                <div className="mt-3 flex gap-1.5">
                  {card.keywords.map((k) => (
                    <span key={k} className="rounded-full bg-witch-violet/10 px-2.5 py-1 text-[11px] font-semibold text-witch-violet">#{k}</span>
                  ))}
                </div>
              </div>
            </button>
          </div>

          {!flipped && (
            <p className="mt-6 text-xs text-witch-muted">하루 한 번, 마녀의 카드를 뽑아보세요</p>
          )}
        </section>

        {/* 결과 */}
        {flipped && (
          <section className="px-5 pt-8">
            {/* 스탬프 획득 */}
            <div className="app-pop mb-4 flex items-center justify-center gap-2 rounded-full bg-witch-mint/40 py-2 text-sm font-bold text-witch-ink">
              <span>🔥 5일째 출석</span><span className="text-witch-violet">+1 스탬프 획득!</span>
            </div>

            {/* 기운 점수 */}
            <div className="app-card app-reveal p-5">
              <div className="flex items-end justify-between">
                <p className="text-sm font-bold text-witch-ink">오늘의 기운</p>
                <p className="app-serif text-2xl font-extrabold text-witch-violet">{card.score}<span className="text-sm text-witch-muted">/100</span></p>
              </div>
              <div className="relative mt-3 h-2.5 rounded-full bg-witch-line">
                <div className="absolute left-0 top-0 h-2.5 rounded-full" style={{ width: `${card.score}%`, background: "linear-gradient(90deg,#7c6cd8,#a98bee)" }} />
              </div>
              <p className="mt-2 text-xs text-witch-muted">오늘의 오행 기운 · {card.element}</p>
            </div>

            {/* 마녀의 한 줄 */}
            <div className="app-card app-reveal mt-3 flex gap-3 p-5" style={{ animationDelay: "0.08s" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/char-emblem.png" alt="묘월의 마녀" className="h-12 w-12 shrink-0 object-contain" />
              <div>
                <p className="text-xs font-bold text-witch-violet">마녀의 한 줄</p>
                <p className="mt-1 text-sm leading-relaxed text-witch-ink">{card.message}</p>
              </div>
            </div>

            {/* 행운 아이템 */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="app-card app-reveal flex items-center gap-3 p-4" style={{ animationDelay: "0.16s" }}>
                <span className="h-9 w-9 rounded-full border border-witch-line" style={{ background: card.luckyColorHex }} />
                <div>
                  <p className="text-[11px] text-witch-muted">행운의 색</p>
                  <p className="text-sm font-bold text-witch-ink">{card.luckyColor}</p>
                </div>
              </div>
              <div className="app-card app-reveal flex items-center gap-3 p-4" style={{ animationDelay: "0.22s" }}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-witch-peach/50 text-sm font-extrabold text-witch-ink">{card.luckyNumber}</span>
                <div>
                  <p className="text-[11px] text-witch-muted">행운의 숫자</p>
                  <p className="text-sm font-bold text-witch-ink">{card.luckyNumber}</p>
                </div>
              </div>
            </div>

            {/* 더 깊이 보기 */}
            <Link href="/report/SAMPLE" className="app-btn app-btn-primary app-reveal mt-5 flex w-full" style={{ animationDelay: "0.3s" }}>
              내 사주로 더 깊이 보기 →
            </Link>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="mt-2 w-full py-2 text-center text-xs text-witch-muted"
            >
              다시 보기
            </button>
          </section>
        )}

        <AppTabBar active="fortune" />
      </main>
    </div>
  );
}
