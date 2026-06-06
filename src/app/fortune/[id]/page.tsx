import { notFound } from "next/navigation";
import { getFortune } from "@/lib/fortune/store";
import { LifeGraph } from "@/components/LifeGraph";
import { ELEMENT_COLOR, ELEMENT_HANJA } from "@/lib/ui/element";

export default async function FortunePage({ params }: { params: { id: string } }) {
  const report = await getFortune(params.id);
  if (!report) notFound();

  const { subject, daewoon, events, currentAge, intro, mainElement, strength } = report;
  const accent = ELEMENT_COLOR[mainElement];

  return (
    <main className="min-h-screen pb-28">
      {/* 표지 */}
      <header className="mx-auto max-w-2xl px-8 pt-16 text-center">
        <span className="label-caps">Fortune Timeline · 운세</span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ivory">인생의 큰 흐름</h1>
        <p className="mt-2 text-sm text-ivory/50">
          {subject.name} · 主氣 {ELEMENT_HANJA[mainElement]} {mainElement} · {strength} · 지금 {currentAge}세
        </p>
        <div className="hairline mx-auto mt-8 max-w-[3rem]" />
      </header>

      {/* 인생 그래프 */}
      <section className="print-page-break mx-auto mt-12 max-w-2xl px-8">
        <div className="text-center">
          <span className="label-caps">Life Curve · 10年 大運</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ivory">인생 그래프</h2>
          <div className="hairline mx-auto mt-5 max-w-xs" />
        </div>
        <div className="mt-6">
          <LifeGraph daewoon={daewoon} events={events} currentAge={currentAge} />
        </div>
        <div className="mt-6 space-y-3">
          {intro.paragraphs.map((p, i) => (
            <p key={i} className="leading-[1.85] text-ivory/80">{p}</p>
          ))}
        </div>
      </section>

      {/* 10년 대운 타임라인 */}
      <section className="print-page-break mx-auto mt-4 max-w-2xl px-8 py-12">
        <span className="label-caps">大運 · 10-Year Cycles</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-ivory">10년 대운</h2>
        <div className="hairline mt-5" />
        <div className="mt-4 space-y-3">
          {daewoon.map((d) => (
            <div
              key={d.index}
              className="flex items-center gap-4 rounded-sm border px-4 py-3"
              style={{
                borderColor: d.current ? "rgba(196,163,90,.5)" : "rgba(255,255,255,.06)",
                background: d.current ? "rgba(196,163,90,.06)" : "transparent",
              }}
            >
              <div className="w-16 shrink-0 text-center">
                <div className="font-display text-lg" style={{ color: ELEMENT_COLOR[d.stemElement] }}>{d.stem}{d.branch}</div>
                <div className="font-display text-[10px] text-ivory/40">{d.startAge}–{d.endAge}세</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm text-ivory/90">{d.title ?? `${d.tenGod} 대운`}</span>
                  {d.current && <span className="font-display text-[10px] tracking-widest text-gold">NOW</span>}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-ivory/55">{d.summary ?? ""}</p>
              </div>
              {/* 흐름 점수 막대 */}
              <div className="w-12 shrink-0">
                <div className="h-1 w-full bg-white/10">
                  <div className="h-1" style={{ width: `${d.score}%`, background: accent }} />
                </div>
                <div className="mt-1 text-right font-display text-[10px] text-ivory/40">{d.score}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 주요 이벤트 */}
      <section className="print-page-break mx-auto max-w-2xl px-8 py-12">
        <span className="label-caps">Key Events · 주요 이벤트</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-ivory">주요 사건 · 전환점</h2>
        <div className="hairline mt-5" />
        <div className="mt-4">
          {events.map((e, i) => (
            <div key={i} className="flex gap-5 border-b border-white/[0.05] py-4">
              <div className="w-16 shrink-0 text-center">
                <div className="font-display text-lg text-gold">{e.age}세</div>
                <div className="font-display text-[10px] text-ivory/40">{e.year}</div>
              </div>
              <div>
                <div className="font-display text-base text-ivory/95">{e.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-ivory/65">{e.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
