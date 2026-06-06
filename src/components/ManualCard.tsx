import type { UserManual } from "@/types/manual";
import { ELEMENT_COLOR, ELEMENT_LABEL, RANK_COLOR } from "@/lib/ui/element";

/**
 * 취급설명서 카드 — 공유 밈 포맷.
 * 리포트(어두운 테마)와 달리 '제품 설명서' 느낌의 밝은 종이 톤으로 차별화.
 */
export function ManualCard({ manual }: { manual: UserManual }) {
  const accent = ELEMENT_COLOR[manual.mainElement];
  const rankColor = RANK_COLOR[manual.rank];

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-[#fbfaf6] text-zinc-800 shadow-xl">
      {/* 헤더 */}
      <div className="border-b-2 border-dashed border-zinc-300 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span>USER MANUAL · 취급설명서</span>
          <span
            className="rounded px-1.5 py-0.5 font-black"
            style={{ background: rankColor, color: "#1a1a1a" }}
          >
            {manual.rank}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-black text-zinc-900">
          {manual.subjectName} 취급설명서
        </h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span
            className="rounded-full px-2.5 py-1 font-bold"
            style={{ background: `${accent}22`, color: accent }}
          >
            모델 · {manual.modelName}
          </span>
          <span className="rounded-full bg-zinc-200 px-2.5 py-1 font-medium text-zinc-600">
            {manual.releaseInfo}
          </span>
          <span
            className="rounded-full px-2.5 py-1 font-medium"
            style={{ background: `${accent}18`, color: accent }}
          >
            주성분 {ELEMENT_LABEL[manual.mainElement]}
          </span>
        </div>
      </div>

      {/* 항목 */}
      <div className="divide-y divide-zinc-200 px-6">
        {manual.items.map((item, i) => (
          <div key={i} className="flex gap-3 py-4">
            <div className="text-2xl leading-none">{item.icon}</div>
            <div>
              <div className="text-sm font-bold text-zinc-900">{item.label}</div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 경고 */}
      <div
        className="mx-6 mb-6 rounded-lg border-l-4 px-4 py-3 text-sm font-medium"
        style={{ borderColor: "#E0533D", background: "rgba(224,83,61,0.08)", color: "#9a2f1f" }}
      >
        ⚠️ 취급주의 — {manual.warning}
      </div>

      {/* 푸터 */}
      <div className="bg-zinc-100 px-6 py-3 text-center text-[11px] text-zinc-400">
        myfortune.ai · 사주 × 심리 취급설명서
      </div>
    </div>
  );
}
