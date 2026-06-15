import { notFound } from "next/navigation";
import { getReport } from "@/lib/report/store";
import { getManual } from "@/lib/manual/store";
import { CharacterCard } from "@/components/CharacterCard";
import { ElementChart } from "@/components/ElementChart";
import { SajuTable } from "@/components/SajuTable";
import { SectionRenderer } from "@/components/SectionRenderer";
import { ManualSection } from "@/components/ManualSection";
import { buildPersonalAnalysis } from "@/lib/report/analysis";
import { ELEMENT_LABEL } from "@/lib/ui/element";
import ReportNav from "@/components/ReportNav";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { print?: string };
}) {
  const report = await getReport(params.id);
  if (!report) notFound();

  const manual = await getManual(params.id);
  const analysis = buildPersonalAnalysis(report.subject);
  const isPrint = searchParams.print === "1";

  return (
    <main className="min-h-screen pb-28">
      <ReportNav title="운명 프로파일" />
      {/* 표지 */}
      <header className="mx-auto max-w-2xl px-8 pt-16 text-center">
        <span className="label-caps">Destiny Report</span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ivory">운명 프로파일</h1>
        <p className="mt-2 text-sm text-ivory/45">{report.subject.name}</p>
        <div className="hairline mx-auto mt-8 max-w-[3rem]" />
      </header>

      {/* STEP1 — 캐릭터 카드 */}
      <div className="px-8 pt-10">
        <CharacterCard card={report.card} subject={report.subject} />
        {!isPrint && (
          <p className="no-print mt-8 text-center font-display text-xs tracking-[0.3em] text-ivory/30">
            SCROLL
          </p>
        )}
      </div>

      {/* 사주 원국 + 오행 */}
      <section className="print-page-break mx-auto mt-16 max-w-2xl px-8">
        <div className="text-center">
          <span className="label-caps">命式 · 五行</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ivory">사주 원국 · 오행 분포</h2>
          <div className="hairline mx-auto mt-5 max-w-xs" />
        </div>
        <div className="mt-8">
          <SajuTable saju={report.saju} />
        </div>
        <div className="mt-10 flex flex-col items-center gap-4">
          <ElementChart profile={report.elements} />
          <p className="text-sm text-ivory/55">
            주된 기운 <span className="font-display text-ivory/90">{ELEMENT_LABEL[report.elements.dominant]}</span>
            <span className="mx-3 text-gold/40">·</span>
            보완할 기운 <span className="font-display text-ivory/90">{ELEMENT_LABEL[report.elements.lacking]}</span>
          </p>
        </div>
      </section>

      {/* 10가지 심층 분석 */}
      <section className="print-page-break mx-auto mt-4 max-w-2xl px-8 py-12">
        <div className="text-center">
          <span className="label-caps">In-Depth · 10 Lenses</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ivory">10가지 심층 분석</h2>
          <div className="hairline mx-auto mt-5 max-w-xs" />
        </div>
        <div className="mt-8 space-y-7">
          {analysis.map((cat, i) => (
            <div key={cat.key}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-sm text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="flex-1 font-display text-lg font-bold text-ivory">{cat.title}</h3>
                {typeof cat.score === "number" && <span className="font-display text-xs text-ivory/45">{cat.score}</span>}
              </div>
              {typeof cat.score === "number" && (
                <div className="mt-2 h-px w-full bg-black/10">
                  <div className="h-px bg-gold" style={{ width: `${cat.score}%` }} />
                </div>
              )}
              <ul className="mt-3 space-y-1.5">
                {cat.points.map((p, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed text-ivory/75">
                    <span className="mt-2 h-px w-3 shrink-0 bg-gold/50" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* STEP2 — 본문 섹션 */}
      {report.sections.map((section, i) => (
        <SectionRenderer key={section.key} section={section} index={i + 1} />
      ))}

      {/* 하단 — 취급설명서 병합 */}
      {manual && (
        <>
          <div className="hairline mx-auto my-4 max-w-2xl" />
          <ManualSection manual={manual} />
        </>
      )}

      {/* PDF 다운로드 */}
      {!isPrint && (
        <div className="no-print mx-auto mt-10 max-w-2xl px-8">
          <a
            href={`/api/reports/${report.id}/pdf`}
            className="block border border-gold/40 py-4 text-center font-display text-sm tracking-[0.2em] text-gold transition hover:bg-gold/10"
          >
            PDF 소장본 내려받기
          </a>
        </div>
      )}
    </main>
  );
}
