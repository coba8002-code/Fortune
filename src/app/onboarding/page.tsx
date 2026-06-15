"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HOURS = [
  "모름",
  "자시 (23:30~01:29)", "축시 (01:30~03:29)", "인시 (03:30~05:29)", "묘시 (05:30~07:29)",
  "진시 (07:30~09:29)", "사시 (09:30~11:29)", "오시 (11:30~13:29)", "미시 (13:30~15:29)",
  "신시 (15:30~17:29)", "유시 (17:30~19:29)", "술시 (19:30~21:29)", "해시 (21:30~23:29)",
];

function finish(router: ReturnType<typeof useRouter>, to: string) {
  try { localStorage.setItem("mw_onboarded", "1"); } catch {}
  router.push(to);
}

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [birth, setBirth] = useState("");
  const [hour, setHour] = useState(HOURS[0]);
  const [gender, setGender] = useState<"여" | "남" | "">("");
  const [cal, setCal] = useState<"양력" | "음력">("양력");

  const canNext = birth !== "" && gender !== "";

  return (
    <div className="app-stage">
      <main className="app flex flex-col" style={{ paddingBottom: 0 }}>
        {/* 진행 표시 */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-witch-violet" : "w-1.5 bg-witch-line"}`} />
            ))}
          </div>
          {step < 2 && (
            <button type="button" onClick={() => finish(router, "/")} className="text-xs text-witch-muted">
              건너뛰기
            </button>
          )}
        </div>

        {/* STEP 0 — 환영 */}
        {step === 0 && (
          <section className="app-reveal flex flex-1 flex-col items-center justify-center px-7 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/char-hero.png" alt="묘월의 마녀" className="app-float h-56 w-56 object-contain" />
            <h1 className="app-serif mt-4 text-2xl font-extrabold text-witch-ink">
              안녕, 나는 묘월의 마녀야 🌙
            </h1>
            <p className="mt-3 leading-relaxed text-witch-ink/70">
              사주와 타로로 너의 오늘을 다정하게 읽어줄게.
              <br />
              먼저 너를 조금만 알려줄래?
            </p>
            <button type="button" onClick={() => setStep(1)} className="app-btn app-btn-primary mt-9 w-full max-w-xs">
              시작하기
            </button>
          </section>
        )}

        {/* STEP 1 — 정보 입력 */}
        {step === 1 && (
          <section className="app-reveal flex-1 px-6 pt-8">
            <h2 className="app-serif text-2xl font-extrabold text-witch-ink">너의 사주 정보를 알려줘</h2>
            <p className="mt-2 text-sm text-witch-muted">출생 시각까지 알려주면 풀이가 훨씬 정확해져.</p>

            <label className="mt-7 block text-xs font-semibold text-witch-ink">생년월일</label>
            <input
              type="date" value={birth} onChange={(e) => setBirth(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-witch-line bg-white px-4 py-3.5 text-sm text-witch-ink outline-none focus:border-witch-violet"
            />

            <label className="mt-4 block text-xs font-semibold text-witch-ink">태어난 시각</label>
            <select
              value={hour} onChange={(e) => setHour(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-witch-line bg-white px-4 py-3.5 text-sm text-witch-ink outline-none focus:border-witch-violet"
            >
              {HOURS.map((h) => <option key={h}>{h}</option>)}
            </select>

            <div className="mt-4 flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-witch-ink">성별</label>
                <div className="mt-1.5 flex rounded-2xl border border-witch-line bg-white p-1">
                  {(["여", "남"] as const).map((g) => (
                    <button key={g} type="button" onClick={() => setGender(g)}
                      className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${gender === g ? "bg-witch-violet text-white" : "text-witch-muted"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-witch-ink">양/음력</label>
                <div className="mt-1.5 flex rounded-2xl border border-witch-line bg-white p-1">
                  {(["양력", "음력"] as const).map((c) => (
                    <button key={c} type="button" onClick={() => setCal(c)}
                      className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${cal === c ? "bg-witch-violet text-white" : "text-witch-muted"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="app-btn shrink-0 border border-witch-line px-6 text-witch-ink">이전</button>
              <button type="button" disabled={!canNext} onClick={() => setStep(2)}
                className={`app-btn flex-1 ${canNext ? "app-btn-primary" : "bg-witch-line text-witch-muted"}`}>
                다음
              </button>
            </div>
          </section>
        )}

        {/* STEP 2 — 완료 */}
        {step === 2 && (
          <section className="app-reveal flex flex-1 flex-col items-center justify-center px-7 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/char-hero.png" alt="묘월의 마녀" className="app-float h-56 w-56 object-contain" />
            <h2 className="app-serif mt-4 text-2xl font-extrabold text-witch-ink">준비 끝!</h2>
            <p className="mt-3 leading-relaxed text-witch-ink/70">
              이제 오늘의 첫 카드를 뽑아볼까?
              <br />
              내가 너의 오늘을 읽어줄게 🔮
            </p>
            <button type="button" onClick={() => finish(router, "/today")} className="app-btn app-btn-primary mt-9 w-full max-w-xs">
              오늘의 운세 보기
            </button>
            <button type="button" onClick={() => finish(router, "/")} className="mt-3 text-xs text-witch-muted">
              홈으로 둘러보기
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
