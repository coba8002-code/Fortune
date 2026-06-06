import type { SajuChart, Pillar } from "@/types/report";
import { ELEMENT_COLOR } from "@/lib/ui/element";

/** 사주 원국(4주) — 금박 헤어라인 격자, 명조 한자. */
export function SajuTable({ saju }: { saju: SajuChart }) {
  const cols: { label: string; sub: string; pillar?: Pillar }[] = [
    { label: "시주", sub: "時", pillar: saju.pillars.hour },
    { label: "일주", sub: "日", pillar: saju.pillars.day },
    { label: "월주", sub: "月", pillar: saju.pillars.month },
    { label: "연주", sub: "年", pillar: saju.pillars.year },
  ];
  return (
    <div className="grid grid-cols-4 divide-x divide-gold/15 border border-gold/15">
      {cols.map((col) => (
        <div key={col.label} className="px-2 py-4 text-center">
          <div className="font-display text-[11px] tracking-widest text-ivory/40">
            {col.label} · {col.sub}
          </div>
          {col.pillar ? (
            <div className="mt-3 space-y-1.5">
              <Glyph char={col.pillar.stem} color={ELEMENT_COLOR[col.pillar.element]} />
              <Glyph char={col.pillar.branch} />
            </div>
          ) : (
            <div className="mt-3 py-5 text-[11px] text-ivory/25">시각 미상</div>
          )}
        </div>
      ))}
    </div>
  );
}

function Glyph({ char, color }: { char: string; color?: string }) {
  return (
    <div
      className="mx-auto flex h-11 w-11 items-center justify-center font-display text-xl"
      style={{
        color: color ?? "rgba(236,230,216,0.85)",
        border: `1px solid ${color ? color + "44" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {char}
    </div>
  );
}
