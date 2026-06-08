import type { ElementProfile, Element } from "@/types/report";

const ELEMENTS: Element[] = ["목", "화", "토", "금", "수"];

/** 두 사람의 오행 프로파일을 한 차트에 겹쳐 그린다. */
export function ElementRadarDual({
  a,
  b,
  colorA,
  colorB,
}: {
  a: ElementProfile;
  b: ElementProfile;
  colorA: string;
  colorB: string;
}) {
  const size = 260, c = size / 2, r = size / 2 - 44;
  const max = Math.max(1, ...ELEMENTS.flatMap((e) => [a.scores[e], b.scores[e]]));
  const pt = (i: number, radius: number) => {
    const ang = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return [c + radius * Math.cos(ang), c + radius * Math.sin(ang)] as const;
  };
  const poly = (p: ElementProfile) =>
    ELEMENTS.map((e, i) => pt(i, (p.scores[e] / max) * r).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="오행 겹쳐보기">
      {[0.34, 0.67, 1].map((f) => (
        <polygon key={f} points={ELEMENTS.map((_, i) => pt(i, r * f).join(",")).join(" ")} fill="none" stroke="rgba(196,163,90,.14)" strokeWidth={1} />
      ))}
      <polygon points={poly(a)} fill={`${colorA}28`} stroke={colorA} strokeWidth={1.6} />
      <polygon points={poly(b)} fill={`${colorB}24`} stroke={colorB} strokeWidth={1.6} />
      {ELEMENTS.map((e, i) => {
        const [lx, ly] = pt(i, r + 20);
        return (
          <text key={e} x={lx} y={ly} fontSize={11} fill="rgba(236,230,216,.55)" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "var(--font-display)" }}>
            {e}
          </text>
        );
      })}
    </svg>
  );
}
