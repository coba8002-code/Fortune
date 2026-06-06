import type { Daewoon, LifeEvent } from "@/types/fortune";

/** 인생 그래프 — 대운 흐름 점수 곡선 + 현재 나이 + 주요 이벤트. 순수 SVG. */
export function LifeGraph({
  daewoon,
  events,
  currentAge,
}: {
  daewoon: Daewoon[];
  events: LifeEvent[];
  currentAge: number;
}) {
  if (daewoon.length === 0) return null;
  const W = 660, H = 250, padX = 26, padTop = 22, padBot = 46;
  const minAge = daewoon[0].startAge;
  const maxAge = daewoon[daewoon.length - 1].endAge + 1;
  const xOf = (age: number) => padX + ((age - minAge) / (maxAge - minAge)) * (W - 2 * padX);
  const yOf = (score: number) => padTop + (1 - score / 100) * (H - padTop - padBot);

  const mids = daewoon.map((d) => ({ x: xOf(d.startAge + 5), y: yOf(d.score), age: d.startAge + 5, score: d.score }));
  const line = mids.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${padX},${H - padBot} ${line} ${(W - padX).toFixed(1)},${H - padBot}`;

  // 임의 나이의 곡선 y (이벤트 점 위치)
  const yAt = (age: number) => {
    if (age <= mids[0].age) return mids[0].y;
    if (age >= mids[mids.length - 1].age) return mids[mids.length - 1].y;
    for (let i = 0; i < mids.length - 1; i++) {
      const a = mids[i], b = mids[i + 1];
      if (age >= a.age && age <= b.age) {
        const t = (age - a.age) / (b.age - a.age);
        return a.y + (b.y - a.y) * t;
      }
    }
    return mids[0].y;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="인생 그래프">
      {/* 가로 기준선 */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padX} y1={padTop + f * (H - padTop - padBot)} x2={W - padX} y2={padTop + f * (H - padTop - padBot)} stroke="rgba(255,255,255,.05)" />
      ))}
      {/* 영역 + 곡선 */}
      <polygon points={area} fill="rgba(196,163,90,.10)" />
      <polyline points={line} fill="none" stroke="#c4a35a" strokeWidth={2} />
      {/* 대운 분기 점 + 나이 라벨 */}
      {daewoon.map((d) => (
        <g key={d.index}>
          <circle cx={xOf(d.startAge + 5)} cy={yOf(d.score)} r={d.current ? 4 : 2.5} fill={d.current ? "#e8cf93" : "#c4a35a"} />
          <text x={xOf(d.startAge)} y={H - padBot + 16} fontSize={10} fill="rgba(236,230,216,.4)" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>
            {d.startAge}
          </text>
          <text x={xOf(d.startAge + 5)} y={H - padBot + 30} fontSize={9} fill="rgba(196,163,90,.6)" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>
            {d.stem}{d.branch}
          </text>
        </g>
      ))}
      {/* 현재 나이 마커 */}
      <line x1={xOf(currentAge)} y1={padTop} x2={xOf(currentAge)} y2={H - padBot} stroke="rgba(232,207,147,.5)" strokeDasharray="3 3" />
      <text x={xOf(currentAge)} y={padTop - 6} fontSize={10} fill="#e8cf93" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>지금 {currentAge}</text>
      {/* 이벤트 점 */}
      {events.map((e, i) => (
        <circle key={i} cx={xOf(e.age)} cy={yAt(e.age)} r={3.5} fill="none" stroke="#e8cf93" strokeWidth={1.4} />
      ))}
    </svg>
  );
}
