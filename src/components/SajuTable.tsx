import type { SajuChart, Pillar } from "@/types/report";
import { ELEMENT_COLOR } from "@/lib/ui/element";

/** 사주 원국(4주) 표 — 연/월/일/시. */
export function SajuTable({ saju }: { saju: SajuChart }) {
  const cols: { label: string; pillar?: Pillar }[] = [
    { label: "시주", pillar: saju.pillars.hour },
    { label: "일주", pillar: saju.pillars.day },
    { label: "월주", pillar: saju.pillars.month },
    { label: "연주", pillar: saju.pillars.year },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {cols.map((col) => (
        <div key={col.label} className="rounded-lg bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/50">{col.label}</div>
          {col.pillar ? (
            <div className="space-y-1">
              <Glyph char={col.pillar.stem} color={ELEMENT_COLOR[col.pillar.element]} />
              <Glyph char={col.pillar.branch} />
            </div>
          ) : (
            <div className="py-4 text-xs text-white/30">시각 미상</div>
          )}
        </div>
      ))}
    </div>
  );
}

function Glyph({ char, color }: { char: string; color?: string }) {
  return (
    <div
      className="mx-auto flex h-10 w-10 items-center justify-center rounded-md text-lg font-bold"
      style={{
        background: color ? `${color}22` : "rgba(255,255,255,0.06)",
        color: color ?? "#e6e8ec",
      }}
    >
      {char}
    </div>
  );
}
