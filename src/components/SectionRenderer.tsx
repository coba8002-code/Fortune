import type { ContentBlock, ReportSection } from "@/types/report";
import { GOLD } from "@/lib/ui/element";

const CALLOUT: Record<string, { label: string; color: string }> = {
  tip: { label: "조언", color: "#7C9A74" },
  warning: { label: "주의", color: "#C2705A" },
  highlight: { label: "핵심", color: GOLD },
};

/**
 * STEP2 — 스크롤 리포트 섹션. 이모지 대신 번호·스몰캡스·헤어라인으로 정돈.
 */
export function SectionRenderer({ section, index }: { section: ReportSection; index: number }) {
  return (
    <section className="print-page-break mx-auto max-w-2xl px-8 py-12">
      <header className="mb-6">
        <span className="font-display text-sm text-gold/70">{String(index).padStart(2, "0")}</span>
        <h2 className="mt-1 font-display text-2xl font-bold text-ivory">{section.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ivory/50">{section.summary}</p>
        <div className="hairline mt-5" />
      </header>
      <div className="space-y-5">
        {section.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="leading-[1.85] text-ivory/80">{block.text}</p>;

    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-ivory/80">
              <span className="mt-2 h-px w-4 shrink-0 bg-gold/50" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "callout": {
      const tone = CALLOUT[block.tone];
      return (
        <div className="border-l pl-5" style={{ borderColor: tone.color }}>
          <div
            className="font-display text-[11px] uppercase tracking-[0.25em]"
            style={{ color: tone.color }}
          >
            {tone.label}
          </div>
          <p className="mt-1.5 leading-relaxed text-ivory/80">{block.text}</p>
        </div>
      );
    }

    case "gauge":
      return (
        <div className="flex items-center gap-4">
          <span className="w-24 shrink-0 font-display text-xs tracking-wider text-ivory/50">
            {block.label}
          </span>
          <div className="h-px flex-1 bg-white/10">
            <div
              className="h-px"
              style={{ width: `${Math.max(0, Math.min(100, block.value))}%`, background: GOLD }}
            />
          </div>
          <span className="w-8 text-right font-display text-xs text-ivory/45">{block.value}</span>
        </div>
      );
  }
}
