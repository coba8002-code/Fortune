import type { CharacterCard as Card, Subject } from "@/types/report";
import { ELEMENT_COLOR, ELEMENT_LABEL, RANK_COLOR, stars } from "@/lib/ui/element";

const STAT_LABEL: Record<keyof Card["stats"], string> = {
  insight: "통찰",
  leadership: "통솔",
  creativity: "창의",
  stability: "안정",
  drive: "추진",
};

/**
 * STEP1 — SSR 캐릭터 카드.
 * 리포트 최상단 히어로. 포켓몬 카드 감성으로 가장 먼저 뜨고, 공유를 유발한다.
 */
export function CharacterCard({ card, subject }: { card: Card; subject: Subject }) {
  const accent = ELEMENT_COLOR[card.mainElement];
  const rankColor = RANK_COLOR[card.rank];

  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border p-6"
      style={{
        borderColor: rankColor,
        background:
          "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.08), rgba(255,255,255,0) 60%), #161922",
        boxShadow: `0 0 40px ${rankColor}33`,
      }}
    >
      {/* 등급 + 레벨 */}
      <div className="flex items-center justify-between">
        <span
          className="rounded-md px-2 py-0.5 text-sm font-black tracking-wider"
          style={{ background: rankColor, color: "#161922" }}
        >
          {card.rank}
        </span>
        <span className="text-sm text-white/60">Lv.{card.level}</span>
      </div>

      {/* 타이틀 */}
      <h1 className="mt-3 text-3xl font-black" style={{ color: accent }}>
        {card.title}
      </h1>
      <p className="mt-1 text-sm text-white/70">
        {subject.name} 님의 운명 프로파일
      </p>

      {/* 속성 / 직업 */}
      <div className="mt-4 flex gap-2 text-xs">
        <span
          className="rounded-full px-3 py-1 font-semibold"
          style={{ background: `${accent}22`, color: accent }}
        >
          주속성 · {ELEMENT_LABEL[card.mainElement]}
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white/80">
          직업 · {card.job}
        </span>
      </div>

      {/* 능력치 */}
      <div className="mt-5 space-y-2">
        {(Object.keys(card.stats) as (keyof Card["stats"])[]).map((k) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-xs text-white/60">{STAT_LABEL[k]}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${card.stats[k]}%`, background: accent }}
              />
            </div>
            <span className="w-7 shrink-0 text-right text-xs text-white/50">
              {card.stats[k]}
            </span>
          </div>
        ))}
      </div>

      {/* 스킬 */}
      <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
        <SkillRow label="메인" name={card.skills.main.name} stars={card.skills.main.stars} />
        <SkillRow label="패시브" name={card.skills.passive.name} stars={card.skills.passive.stars} />
        <SkillRow label="약점" name={card.skills.weakness.name} stars={card.skills.weakness.stars} muted />
      </div>
    </div>
  );
}

function SkillRow({
  label,
  name,
  stars: n,
  muted,
}: {
  label: string;
  name: string;
  stars: number;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50">{label}</span>
      <span className={muted ? "text-white/70" : "text-white"}>{name}</span>
      <span className="font-mono text-xs" style={{ color: muted ? "#9AA0A6" : "#F4C95D" }}>
        {stars(n)}
      </span>
    </div>
  );
}
