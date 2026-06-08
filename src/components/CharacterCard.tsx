import type { CharacterCard as Card, Subject } from "@/types/report";
import { ELEMENT_COLOR, ELEMENT_HANJA, GOLD, meterFill } from "@/lib/ui/element";

const STAT_LABEL: Record<keyof Card["stats"], string> = {
  insight: "통찰",
  leadership: "통솔",
  creativity: "창의",
  stability: "안정",
  drive: "추진",
};

/**
 * STEP1 — 캐릭터 프로파일 플레이트.
 * 이모지 없이 금박 헤어라인·명조 타이틀·한자 각인으로 격조 있게.
 */
export function CharacterCard({ card, subject }: { card: Card; subject: Subject }) {
  const accent = ELEMENT_COLOR[card.mainElement];

  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-sm border border-gold/30 bg-surface"
      style={{ boxShadow: "0 30px 80px -40px rgba(0,0,0,0.8)" }}
    >
      {/* 한자 워터마크 */}
      <div
        className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[12rem] leading-none text-white/[0.03]"
        aria-hidden
      >
        {ELEMENT_HANJA[card.mainElement]}
      </div>

      <div className="relative px-8 pt-8 pb-7">
        {/* 등급 / 레벨 */}
        <div className="flex items-center justify-between">
          <span className="label-caps">Grade {card.rank}</span>
          <span className="font-display text-sm text-ivory/50">No. {String(card.level).padStart(2, "0")}</span>
        </div>

        {/* 타이틀 */}
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-ivory">
          {card.title}
        </h1>
        <p className="mt-2 text-sm text-ivory/45">{subject.name} · 운명 프로파일</p>

        {/* 속성 / 직업 */}
        <div className="mt-5 flex items-center gap-5 text-sm">
          <span style={{ color: accent }} className="font-display">
            主氣 {ELEMENT_HANJA[card.mainElement]} · {card.mainElement}
          </span>
          <span className="h-3 w-px bg-gold/25" />
          <span className="text-ivory/60">{card.job}</span>
        </div>

        <div className="hairline my-6" />

        {/* 능력치 */}
        <div className="space-y-3">
          {(Object.keys(card.stats) as (keyof Card["stats"])[]).map((k) => (
            <div key={k} className="flex items-center gap-4">
              <span className="w-9 shrink-0 font-display text-xs tracking-wider text-ivory/55">
                {STAT_LABEL[k]}
              </span>
              <div className="h-px flex-1 bg-white/10">
                <div className="h-px" style={{ width: `${card.stats[k]}%`, background: accent }} />
              </div>
              <span className="w-7 shrink-0 text-right font-display text-xs text-ivory/40">
                {card.stats[k]}
              </span>
            </div>
          ))}
        </div>

        <div className="hairline my-6" />

        {/* 스킬 */}
        <div className="space-y-3 text-sm">
          <SkillRow label="主技" name={card.skills.main.name} stars={card.skills.main.stars} />
          <SkillRow label="潛技" name={card.skills.passive.name} stars={card.skills.passive.stars} />
          <SkillRow label="弱點" name={card.skills.weakness.name} stars={card.skills.weakness.stars} muted />
        </div>
      </div>
    </div>
  );
}

function SkillRow({
  label,
  name,
  stars,
  muted,
}: {
  label: string;
  name: string;
  stars: number;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-display text-xs text-gold/70">{label}</span>
      <span className={`flex-1 ${muted ? "text-ivory/55" : "text-ivory/90"}`}>{name}</span>
      <span className="flex items-center gap-1">
        {meterFill(stars).map((on, i) => (
          <span
            key={i}
            className="h-1 w-3"
            style={{ background: on ? (muted ? "rgba(236,230,216,0.4)" : GOLD) : "rgba(255,255,255,0.1)" }}
          />
        ))}
      </span>
    </div>
  );
}
