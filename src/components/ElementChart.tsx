import type { ElementProfile, Element } from "@/types/report";
import { ELEMENT_COLOR, ELEMENT_LABEL, GOLD } from "@/lib/ui/element";

const ELEMENTS: Element[] = ["목", "화", "토", "금", "수"];

/**
 * 오행 레이더 차트 — 순수 SVG. 금박 선·절제된 톤으로 통일.
 * 웹·PDF 양쪽에서 동일하게 보이도록 서버에서 직접 그린다.
 */
export function ElementChart({ profile }: { profile: ElementProfile }) {
  const size = 260;
  const c = size / 2;
  const r = size / 2 - 44;
  const max = Math.max(1, ...ELEMENTS.map((e) => profile.scores[e]));

  const point = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / ELEMENTS.length - Math.PI / 2;
    return [c + radius * Math.cos(angle), c + radius * Math.sin(angle)] as const;
  };

  const dataPoints = ELEMENTS.map((e, i) => point(i, (profile.scores[e] / max) * r));
  const polygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="오행 분포">
      {[0.34, 0.67, 1].map((f) => (
        <polygon
          key={f}
          points={ELEMENTS.map((_, i) => point(i, r * f).join(",")).join(" ")}
          fill="none"
          stroke="rgba(196,163,90,0.14)"
          strokeWidth={1}
        />
      ))}
      {ELEMENTS.map((_, i) => {
        const [x, y] = point(i, r);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgba(196,163,90,0.12)" strokeWidth={1} />;
      })}
      <polygon points={polygon} fill="rgba(196,163,90,0.12)" stroke={GOLD} strokeWidth={1.25} />
      {ELEMENTS.map((e, i) => {
        const [dx, dy] = dataPoints[i];
        const [lx, ly] = point(i, r + 22);
        return (
          <g key={e}>
            <circle cx={dx} cy={dy} r={2.5} fill={ELEMENT_COLOR[e]} />
            <text
              x={lx}
              y={ly}
              fontSize={11}
              fill={ELEMENT_COLOR[e]}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
            >
              {ELEMENT_LABEL[e]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
