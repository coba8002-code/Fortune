import type { ContentBlock, ReportSection } from "@/types/report";

/**
 * STEP2 — 스크롤 리포트 섹션 렌더러.
 * LLM 이 만든 구조화 블록(ContentBlock[])만 받아 그린다.
 * 자유 산문이 아니라 블록 구조라 레이아웃이 깨지지 않고 섹션 추가/재정렬이 자유롭다.
 */
export function SectionRenderer({ section }: { section: ReportSection }) {
  return (
    <section className="print-page-break mx-auto max-w-2xl px-6 py-10">
      <header className="mb-4">
        <h2 className="text-2xl font-bold">
          {section.emoji && <span className="mr-2">{section.emoji}</span>}
          {section.title}
        </h2>
        <p className="mt-1 text-white/60">{section.summary}</p>
      </header>
      <div className="space-y-4">
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
      return <p className="leading-relaxed text-white/85">{block.text}</p>;

    case "list":
      return (
        <ul className="space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-white/85">
              <span className="text-white/40">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "callout": {
      const tone = {
        tip: { border: "#3DAE5B", bg: "rgba(61,174,91,0.12)", icon: "💡" },
        warning: { border: "#E0533D", bg: "rgba(224,83,61,0.12)", icon: "⚠️" },
        highlight: { border: "#F4C95D", bg: "rgba(244,201,93,0.12)", icon: "✨" },
      }[block.tone];
      return (
        <div
          className="rounded-lg border-l-4 px-4 py-3 text-white/90"
          style={{ borderColor: tone.border, background: tone.bg }}
        >
          <span className="mr-2">{tone.icon}</span>
          {block.text}
        </div>
      );
    }

    case "gauge":
      return (
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-sm text-white/60">{block.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200"
              style={{ width: `${Math.max(0, Math.min(100, block.value))}%` }}
            />
          </div>
          <span className="w-9 text-right text-sm text-white/50">{block.value}</span>
        </div>
      );
  }
}
