import type { YearPoint } from "@/types/fortune";

const SERIES = [
  { key: "money", label: "금전운", color: "#C2A36B" },
  { key: "love", label: "연애운", color: "#C2705A" },
  { key: "health", label: "건강운", color: "#7C9A74" },
] as const;

/** 연도별 금전·연애·건강 운 3색 곡선. 순수 SVG. */
export function YearlyGraph({ yearly, currentYear }: { yearly: YearPoint[]; currentYear: number }) {
  if (yearly.length === 0) return null;
  const W = 660, H = 240, padX = 30, padTop = 22, padBot = 40;
  const x0 = yearly[0].year, x1 = yearly[yearly.length - 1].year;
  const xOf = (yr: number) => padX + ((yr - x0) / (x1 - x0)) * (W - 2 * padX);
  const yOf = (s: number) => padTop + (1 - s / 100) * (H - padTop - padBot);
  const linePts = (key: (typeof SERIES)[number]["key"]) =>
    yearly.map((p) => `${xOf(p.year).toFixed(1)},${yOf(p[key]).toFixed(1)}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="연도별 운세">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={padX} y1={padTop + f * (H - padTop - padBot)} x2={W - padX} y2={padTop + f * (H - padTop - padBot)} stroke="rgba(255,255,255,.05)" />
        ))}
        {/* 현재 연도 마커 */}
        <line x1={xOf(currentYear)} y1={padTop} x2={xOf(currentYear)} y2={H - padBot} stroke="rgba(232,207,147,.5)" strokeDasharray="3 3" />
        <text x={xOf(currentYear)} y={padTop - 6} fontSize={10} fill="#e8cf93" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>올해</text>
        {/* 3색 곡선 */}
        {SERIES.map((s) => (
          <g key={s.key}>
            <polyline points={linePts(s.key)} fill="none" stroke={s.color} strokeWidth={1.8} />
            {yearly.map((p) => (
              <circle key={p.year} cx={xOf(p.year)} cy={yOf(p[s.key])} r={1.8} fill={s.color} />
            ))}
          </g>
        ))}
        {/* 연도 축(짝수 해만) */}
        {yearly.filter((_, i) => i % 2 === 0).map((p) => (
          <text key={p.year} x={xOf(p.year)} y={H - padBot + 16} fontSize={9} fill="rgba(236,230,216,.4)" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>
            {`'${String(p.year).slice(2)}`}
          </text>
        ))}
      </svg>
      <div className="mt-3 flex justify-center gap-6 text-sm text-ivory/60">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-2">
            <i className="inline-block h-2.5 w-2.5" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
