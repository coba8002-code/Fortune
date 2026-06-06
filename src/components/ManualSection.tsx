import type { UserManual } from "@/types/manual";
import { GOLD } from "@/lib/ui/element";

/**
 * 운명 리포트 하단에 녹인 「취급설명서」 — 리포트와 동일한 먹빛+금박 결.
 * 이모지 없이 번호·스몰캡스로 정돈한 고급 버전(공유 카드의 밝은 버전과 별개).
 */
export function ManualSection({ manual }: { manual: UserManual }) {
  return (
    <section className="print-page-break mx-auto max-w-2xl px-8 py-12">
      <header className="text-center">
        <span className="label-caps">User Manual</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-ivory">
          {manual.subjectName} 취급설명서
        </h2>
        <p className="mt-2 text-sm text-ivory/50">{manual.modelName} · {manual.releaseInfo}</p>
        <div className="hairline mx-auto mt-5 max-w-xs" />
      </header>

      <div className="mt-8 divide-y divide-white/[0.06]">
        {manual.items.map((item, i) => (
          <div key={i} className="flex gap-5 py-5">
            <span className="font-display text-sm text-gold/60">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="font-display text-base text-ivory/95">{item.label}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-ivory/65">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-5" style={{ borderColor: GOLD }}>
        <div className="font-display text-[11px] uppercase tracking-[0.25em] text-gold">취급주의</div>
        <p className="mt-1.5 text-sm leading-relaxed text-ivory/80">{manual.warning}</p>
      </div>
    </section>
  );
}
