import type { CompatPerson, CompatScore } from "@/types/compat";
import { ELEMENT_COLOR, ELEMENT_HANJA } from "@/lib/ui/element";

function Mini({ person }: { person: CompatPerson }) {
  const color = ELEMENT_COLOR[person.mainElement];
  return (
    <div className="flex-1 rounded-sm border border-gold/20 bg-surface p-5 text-center">
      <div
        className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border font-display text-2xl"
        style={{ color, borderColor: `${color}88`, background: `radial-gradient(circle at 50% 35%, ${color}33, transparent 70%)` }}
      >
        {ELEMENT_HANJA[person.mainElement]}
      </div>
      <div className="font-display text-sm text-ivory/55">{person.subject.name}</div>
      <div className="font-display text-lg font-bold" style={{ color }}>{person.title}</div>
      <div className="mt-1.5 font-display text-[11px]" style={{ color }}>
        主氣 {ELEMENT_HANJA[person.mainElement]} · {person.mainElement}
      </div>
    </div>
  );
}

export function CompatHero({ a, b, score, tagline }: { a: CompatPerson; b: CompatPerson; score: CompatScore; tagline: string }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <Mini person={a} />
        <div className="w-20 shrink-0 text-center">
          <div className="font-display text-3xl text-gold">合</div>
          <div className="mt-1 font-display text-4xl font-bold text-ivory">{score.total}</div>
          <div className="mt-1.5 border-t border-gold/20 pt-1.5 font-display text-[11px] tracking-[0.2em] text-gold">
            {score.grade} 케미
          </div>
        </div>
        <Mini person={b} />
      </div>
      <p className="mt-5 text-center font-display text-ivory/55">{tagline}</p>
    </div>
  );
}
