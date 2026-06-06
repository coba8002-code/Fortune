import { notFound } from "next/navigation";
import { getCompat } from "@/lib/compat/store";
import { CompatHero } from "@/components/CompatHero";
import { ElementRadarDual } from "@/components/ElementRadarDual";
import { RelationshipTimeline } from "@/components/RelationshipTimeline";
import { SectionRenderer } from "@/components/SectionRenderer";
import { ELEMENT_COLOR } from "@/lib/ui/element";

const STAT_LABEL: Record<string, string> = {
  attraction: "끌림", comm: "소통", stability: "안정", growth: "성장", friction: "마찰",
};

export default async function CompatPage({ params }: { params: { id: string } }) {
  const report = await getCompat(params.id);
  if (!report) notFound();

  const { a, b, score, basis, sections, manual, tagline, timeline } = report;
  const currentYear = new Date().getFullYear();
  const colorA = ELEMENT_COLOR[a.mainElement];
  const colorB = ELEMENT_COLOR[b.mainElement];

  return (
    <main className="min-h-screen pb-28">
      {/* 표지 */}
      <header className="mx-auto max-w-2xl px-8 pt-16 text-center">
        <span className="label-caps">Compatibility · 궁합</span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ivory">두 사람의 결</h1>
        <p className="mt-2 text-sm text-ivory/50">
          {a.subject.name} <span className="text-gold">×</span> {b.subject.name}
        </p>
        <div className="hairline mx-auto mt-8 max-w-[3rem]" />
      </header>

      {/* 히어로 */}
      <div className="mx-auto mt-10 max-w-2xl px-8">
        <CompatHero a={a} b={b} score={score} tagline={tagline} />
      </div>

      {/* 오행 겹쳐보기 + 점수 분해 */}
      <section className="print-page-break mx-auto mt-16 max-w-2xl px-8">
        <div className="text-center">
          <span className="label-caps">五行 · Dynamics</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ivory">오행 케미 · 점수 분해</h2>
          <div className="hairline mx-auto mt-5 max-w-xs" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ElementRadarDual a={a.elements} b={b.elements} colorA={colorA} colorB={colorB} />
          <div className="flex gap-6 text-sm text-ivory/60">
            <span className="flex items-center gap-2"><i className="inline-block h-2.5 w-2.5" style={{ background: colorA }} />{a.subject.name}</span>
            <span className="flex items-center gap-2"><i className="inline-block h-2.5 w-2.5" style={{ background: colorB }} />{b.subject.name}</span>
          </div>
        </div>
        <div className="mt-8 space-y-2.5">
          {(Object.keys(score.breakdown) as (keyof typeof score.breakdown)[]).map((k) => (
            <div key={k} className="flex items-center gap-4 text-sm">
              <span className="w-12 shrink-0 font-display text-ivory/60">{STAT_LABEL[k]}</span>
              <div className="h-px flex-1 bg-white/10">
                <div className="h-px bg-gold" style={{ width: `${score.breakdown[k]}%` }} />
              </div>
              <span className="w-7 text-right font-display text-xs text-ivory/45">{score.breakdown[k]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 관계 근거 */}
      <section className="print-page-break mx-auto mt-4 max-w-2xl px-8 py-12">
        <span className="label-caps">命理 · Why</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-ivory">이 점수의 근거</h2>
        <div className="hairline mt-5" />
        <div className="mt-2">
          {basis.map((row, i) => (
            <div key={i} className="flex gap-4 border-b border-white/[0.05] py-3.5">
              <div className="w-24 shrink-0 font-display text-sm text-gold/80">{row.label}</div>
              <div className="text-sm leading-relaxed text-ivory/85">{row.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 시기별 궁합 — 연도별 관계 흐름 */}
      <section className="print-page-break mx-auto mt-4 max-w-2xl px-8 py-12">
        <div className="text-center">
          <span className="label-caps">By Year · 時期</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ivory">시기별 궁합 흐름</h2>
          <div className="hairline mx-auto mt-5 max-w-xs" />
        </div>
        <div className="mt-6">
          <RelationshipTimeline timeline={timeline} currentYear={currentYear} />
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-ivory/45">
          그 해 세운(歲運)이 두 사람 원국과 만드는 합·충·천간합으로 본 관계 흐름입니다.
          합이 많은 해는 가까워지고, 충·형해가 겹치는 해는 마찰이 커지기 쉽습니다.
        </p>
      </section>

      {/* 본문 섹션 */}
      {sections.map((section, i) => (
        <SectionRenderer key={section.key} section={section} index={i + 1} />
      ))}

      {/* 관계 취급설명서 */}
      <div className="hairline mx-auto my-4 max-w-2xl" />
      <section className="print-page-break mx-auto max-w-2xl px-8 py-12">
        <header className="text-center">
          <span className="label-caps">Relationship Manual</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ivory">두 사람 취급설명서</h2>
          <div className="hairline mx-auto mt-5 max-w-xs" />
        </header>
        <div className="mt-8 divide-y divide-white/[0.06]">
          {manual.items.map((item, i) => (
            <div key={i} className="flex gap-5 py-5">
              <span className="font-display text-sm text-gold/60">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="font-display text-base text-ivory/95">{item.label}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/65">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-5" style={{ borderColor: "#c4a35a" }}>
          <div className="font-display text-[11px] uppercase tracking-[0.25em] text-gold">관계 취급주의</div>
          <p className="mt-1.5 text-sm leading-relaxed text-ivory/80">{manual.warning}</p>
        </div>
      </section>
    </main>
  );
}
