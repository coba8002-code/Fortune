import { notFound } from "next/navigation";
import { getReport } from "@/lib/report/store";
import { CharacterCard } from "@/components/CharacterCard";
import { ElementChart } from "@/components/ElementChart";
import { SajuTable } from "@/components/SajuTable";
import { SectionRenderer } from "@/components/SectionRenderer";
import { ELEMENT_LABEL } from "@/lib/ui/element";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { print?: string };
}) {
  const report = await getReport(params.id);
  if (!report) notFound();

  const isPrint = searchParams.print === "1";

  return (
    <main className="min-h-screen pb-24">
      {/* STEP1 — 캐릭터 카드 히어로 */}
      <div className="px-6 pt-12">
        <CharacterCard card={report.card} subject={report.subject} />

        {!isPrint && (
          <p className="no-print mt-6 text-center text-sm text-white/40">
            아래로 스크롤해 전체 리포트를 확인하세요 ↓
          </p>
        )}
      </div>

      {/* 사주 원국 + 오행 차트 */}
      <section className="print-page-break mx-auto mt-12 max-w-2xl px-6">
        <h2 className="mb-4 text-xl font-bold">사주 원국 · 오행 분포</h2>
        <SajuTable saju={report.saju} />
        <div className="mt-6 flex flex-col items-center gap-3">
          <ElementChart profile={report.elements} />
          <p className="text-sm text-white/60">
            주된 기운 <strong>{ELEMENT_LABEL[report.elements.dominant]}</strong>
            {" · "}
            보완할 기운 <strong>{ELEMENT_LABEL[report.elements.lacking]}</strong>
          </p>
        </div>
      </section>

      {/* STEP2 — 스크롤 리포트 본문 */}
      {report.sections.map((section) => (
        <SectionRenderer key={section.key} section={section} />
      ))}

      {/* STEP3 — PDF 다운로드 (인쇄 화면에서는 숨김) */}
      {!isPrint && (
        <div className="no-print mx-auto mt-8 max-w-2xl px-6">
          <a
            href={`/api/reports/${report.id}/pdf`}
            className="block rounded-xl bg-amber-400 py-4 text-center font-bold text-zinc-900 transition hover:bg-amber-300"
          >
            PDF로 내려받기 · {report.subject.name}_운명리포트.pdf
          </a>
        </div>
      )}
    </main>
  );
}
