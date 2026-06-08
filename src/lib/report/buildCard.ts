/**
 * SajuChart → ElementProfile + CharacterCard 파생.
 *
 * 오행 프로파일은 결정론적(천간·지지 오행 집계).
 * 캐릭터 카드의 등급/스탯/스킬은 사주를 입력으로 한 "연출 휴리스틱"이다.
 * 본문 산문(sections)은 LLM 단계가 채우며 여기서 만들지 않는다(데이터/표현 분리).
 *
 * 설계 근거: docs/REPORT_MODEL.md §4~5
 */
import type {
  CardRank,
  CharacterCard,
  Element,
  ElementProfile,
  SajuChart,
} from "@/types/report";
import {
  BRANCH_ELEMENT,
  ELEMENTS,
  STEM_ELEMENT,
} from "@/lib/saju/constants";

// ── 오행 프로파일 ─────────────────────────────────────────────────────
export function computeElementProfile(saju: SajuChart): ElementProfile {
  const scores: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const pillars = [
    saju.pillars.year,
    saju.pillars.month,
    saju.pillars.day,
    ...(saju.pillars.hour ? [saju.pillars.hour] : []),
  ];
  for (const p of pillars) {
    scores[STEM_ELEMENT[p.stem]] += 1;
    scores[BRANCH_ELEMENT[p.branch]] += 1;
  }
  let dominant: Element = "목";
  let lacking: Element = "목";
  for (const el of ELEMENTS) {
    if (scores[el] > scores[dominant]) dominant = el;
    if (scores[el] < scores[lacking]) lacking = el;
  }
  return { scores, dominant, lacking };
}

// ── 캐릭터 카드 연출 매핑 ─────────────────────────────────────────────
const ELEMENT_PERSONA: Record<Element, { title: string; job: string }> = {
  목: { title: "개척가", job: "크리에이터" },
  화: { title: "발광체", job: "마케터" },
  토: { title: "전략가", job: "기획자" },
  금: { title: "집행관", job: "엔지니어" },
  수: { title: "탐색가", job: "리서처" },
};

const ELEMENT_SKILL: Record<Element, { main: string; passive: string }> = {
  목: { main: "추진력", passive: "새로움을 여는 힘" },
  화: { main: "표현력", passive: "분위기를 데우는 힘" },
  토: { main: "통찰력", passive: "사람을 모으는 힘" },
  금: { main: "결단력", passive: "끝까지 마무리하는 힘" },
  수: { main: "통찰력", passive: "흐름을 읽는 힘" },
};

const WEAKNESS_BY_TENGOD: { key: keyof SajuChart["tenGods"]; name: string }[] = [
  { key: "관성", name: "과도한 책임감" },
  { key: "재성", name: "지나친 현실 계산" },
  { key: "식상", name: "넘치는 표현 욕구" },
  { key: "인성", name: "생각이 많아 늦는 실행" },
  { key: "비겁", name: "굽히지 않는 고집" },
];

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function toStars(n: number): 1 | 2 | 3 | 4 | 5 {
  return (Math.max(1, Math.min(5, Math.round(n))) as 1 | 2 | 3 | 4 | 5);
}

/**
 * 등급(SSR~N): 오행 균형도가 높을수록(특정 오행 편중이 적당하면서 골고루) 희소 등급.
 * 통계 분포 기반 정교화는 추후. 지금은 dominant 비중 + 보유 오행 종류 수로 근사.
 */
function deriveRank(profile: ElementProfile): CardRank {
  const total = ELEMENTS.reduce((s, e) => s + profile.scores[e], 0) || 1;
  const variety = ELEMENTS.filter((e) => profile.scores[e] > 0).length; // 1~5
  const dominantShare = profile.scores[profile.dominant] / total;
  // 다양성이 높고(많은 오행 보유) 편중이 과하지 않을수록 높은 등급
  const score = variety * 2 - dominantShare * 4; // 대략 -4 ~ 10
  if (score >= 7) return "SSR";
  if (score >= 5) return "SR";
  if (score >= 3) return "R";
  return "N";
}

export interface BuildCardInput {
  saju: SajuChart;
  profile: ElementProfile;
  /** 대운/나이 기반 연출용 레벨(여기선 단순화: 나이 또는 기본값) */
  age?: number;
}

export function buildCharacterCard({
  saju,
  profile,
  age,
}: BuildCardInput): CharacterCard {
  const main = profile.dominant;
  const persona = ELEMENT_PERSONA[main];
  const skillNames = ELEMENT_SKILL[main];
  const t = saju.tenGods;

  // 스탯: 십성 분포를 0~100 스케일로 연출
  const tgTotal =
    t.비겁 + t.식상 + t.재성 + t.관성 + t.인성 || 1;
  const norm = (v: number) => clamp(40 + (v / tgTotal) * 120);

  const stats = {
    insight: norm(t.인성), // 통찰 ← 인성
    leadership: norm(t.관성), // 통솔 ← 관성
    creativity: norm(t.식상), // 창의 ← 식상
    stability: norm(t.비겁), // 안정 ← 비겁
    drive: norm(t.재성), // 추진 ← 재성
  };

  // 약점: 가장 강한 십성에서 도출
  const strongest = WEAKNESS_BY_TENGOD.reduce((a, b) =>
    t[b.key] > t[a.key] ? b : a,
  );

  const rank = deriveRank(profile);
  // 스킬 별점: 메인=주속성 비중, 패시브=두번째 오행, 약점=강한 십성 비중
  const total = ELEMENTS.reduce((s, e) => s + profile.scores[e], 0) || 1;
  const mainStars = toStars(3 + (profile.scores[main] / total) * 6);

  return {
    rank,
    title: persona.title,
    level: age ?? 30 + (profile.scores[main] % 20),
    mainElement: main,
    job: persona.job,
    stats,
    skills: {
      main: { name: skillNames.main, stars: mainStars },
      passive: { name: skillNames.passive, stars: toStars(mainStars - 0) },
      weakness: {
        name: strongest.name,
        stars: toStars(2 + (t[strongest.key] / tgTotal) * 4),
      },
    },
  };
}
