/** 시기별 궁합 — 연도별 관계 흐름 곡선(세운). 최고/최저 연도 표시. 순수 SVG. */
export function RelationshipTimeline({
  timeline,
  currentYear,
}: {
  timeline: { year: number; score: number }[];
  currentYear: number;
}) {
  if (timeline.length === 0) return null;
  const W = 660, H = 230, padX = 28, padTop = 24, padBot = 42;
  const x0 = timeline[0].year, x1 = timeline[timeline.length - 1].year;
  const xOf = (yr: number) => padX + ((yr - x0) / (x1 - x0)) * (W - 2 * padX);
  const yOf = (s: number) => padTop + (1 - s / 100) * (H - padTop - padBot);
  const pts = timeline.map((p) => `${xOf(p.year).toFixed(1)},${yOf(p.score).toFixed(1)}`).join(" ");
  const area = `${padX},${H - padBot} ${pts} ${(W - padX).toFixed(1)},${H - padBot}`;
  const peak = timeline.reduce((m, p) => (p.score > m.score ? p : m));
  const low = timeline.reduce((m, p) => (p.score < m.score ? p : m));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="연도별 관계 흐름">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padX} y1={padTop + f * (H - padTop - padBot)} x2={W - padX} y2={padTop + f * (H - padTop - padBot)} stroke="rgba(255,255,255,.05)" />
      ))}
      <line x1={xOf(currentYear)} y1={padTop} x2={xOf(currentYear)} y2={H - padBot} stroke="rgba(232,207,147,.5)" strokeDasharray="3 3" />
      <text x={xOf(currentYear)} y={padTop - 6} fontSize={10} fill="#e8cf93" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>올해</text>
      <polygon points={area} fill="rgba(196,163,90,.10)" />
      <polyline points={pts} fill="none" stroke="#c4a35a" strokeWidth={2} />
      {/* 최고/최저 */}
      <circle cx={xOf(peak.year)} cy={yOf(peak.score)} r={4} fill="#7C9A74" />
      <text x={xOf(peak.year)} y={yOf(peak.score) - 8} fontSize={10} fill="#7C9A74" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>{peak.year} 호기</text>
      <circle cx={xOf(low.year)} cy={yOf(low.score)} r={4} fill="#C2705A" />
      <text x={xOf(low.year)} y={yOf(low.score) + 16} fontSize={10} fill="#C2705A" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>{low.year} 고비</text>
      {/* 연도 축(짝수) */}
      {timeline.filter((_, i) => i % 2 === 0).map((p) => (
        <text key={p.year} x={xOf(p.year)} y={H - padBot + 16} fontSize={9} fill="rgba(236,230,216,.4)" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>{`'${String(p.year).slice(2)}`}</text>
      ))}
    </svg>
  );
}
