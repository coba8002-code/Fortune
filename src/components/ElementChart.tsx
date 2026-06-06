import type { ElementProfile, Element } from "@/types/report";
import { ELEMENT_COLOR, ELEMENT_LABEL } from "@/lib/ui/element";

const ELEMENTS: Element[] = ["목", "화", "토", "금", "수"];

/**
 * 오행 레이더 차트 — 순수 SVG.
 * 웹과 PDF(Playwright 렌더) 양쪽에서 동일하게 보이도록 JS 차트 라이브러리 대신
 * 서버에서 SVG 로 직접 그린다(REPORT_MODEL.md §5).
 */
export function ElementChart({ profile }: { profile: ElementProfile }) {
  const size = 240;
  const c = size / 2;
  const r = size / 2 - 36;
  const max = Math.max(1, ...ELEMENTS.map((e) => profile.scores[e]));

  const point = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / ELEMENTS.length - Math.PI / 2;
    return [c + radius * Math.cos(angle), c + radius * Math.sin(angle)] as const;
  };

  const dataPoints = ELEMENTS.map((e, i) =>
    point(i, (profile.scores[e] / max) * r),
  );
  const polygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label="오행 분포 레이더 차트"
    >
      {/* 격자(3링) */}
      {[0.33, 0.66, 1].map((f) => (
        <polygon
          key={f}
          points={ELEMENTS.map((_, i) => point(i, r * f).join(",")).join(" ")}
          fill="none"
          stroke="#3a3f4b"
          strokeWidth={1}
        />
      ))}
      {/* 축 */}
      {ELEMENTS.map((_, i) => {
        const [x, y] = point(i, r);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#3a3f4b" strokeWidth={1} />;
      })}
      {/* 데이터 영역 */}
      <polygon points={polygon} fill="rgba(244,201,93,0.25)" stroke="#F4C95D" strokeWidth={2} />
      {/* 꼭짓점 + 라벨 */}
      {ELEMENTS.map((e, i) => {
        const [dx, dy] = dataPoints[i];
        const [lx, ly] = point(i, r + 18);
        return (
          <g key={e}>
            <circle cx={dx} cy={dy} r={3} fill={ELEMENT_COLOR[e]} />
            <text
              x={lx}
              y={ly}
              fontSize={12}
              fill={ELEMENT_COLOR[e]}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {ELEMENT_LABEL[e]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
