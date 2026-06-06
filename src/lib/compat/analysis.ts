/**
 * 궁합 9대 심층 분석 — 감정·생활·소통·갈등·역할·에너지·지속력·타이밍·특수인연.
 * 계산된 관계 요소(천간합·일지·형충·십신·용신·귀인·원진·세운)를 근거로 카테고리별 점수+통찰을 만든다.
 */
import type { EarthlyBranch, Element, HeavenlyStem } from "@/types/report";
import type { AnalysisCategory, CompatPerson } from "@/types/compat";
import type { RelationCategory } from "./compute";
import { STEM_ELEMENT, tenGodCategory } from "@/lib/saju/constants";
import { estimateStrength } from "@/lib/fortune/compute";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// 천을귀인 (일간 → 귀인 지지)
const GUIIN: Record<HeavenlyStem, EarthlyBranch[]> = {
  갑: ["축", "미"], 무: ["축", "미"], 경: ["축", "미"],
  을: ["자", "신"], 기: ["자", "신"],
  병: ["해", "유"], 정: ["해", "유"],
  신: ["인", "오"],
  임: ["사", "묘"], 계: ["사", "묘"],
};
// 원진살 쌍
const WONJIN = new Set(["자미", "미자", "축오", "오축", "인유", "유인", "묘신", "신묘", "진해", "해진", "사술", "술사"]);

function branchesOf(p: CompatPerson): EarthlyBranch[] {
  const pl = p.saju.pillars;
  return [pl.year.branch, pl.month.branch, pl.day.branch, ...(pl.hour ? [pl.hour.branch] : [])];
}
/** 신약이면 인성·비겁이 용신, 신강이면 식상·재성·관성이 용신 */
function yongsin(p: CompatPerson): Set<Element> {
  const dayEl = STEM_ELEMENT[p.saju.dayMaster];
  const strong = estimateStrength(p.saju).strong;
  const set = new Set<Element>();
  (["목", "화", "토", "금", "수"] as Element[]).forEach((e) => {
    const cat = tenGodCategory(dayEl, e);
    const fav = strong ? cat === "식상" || cat === "재성" || cat === "관성" : cat === "인성" || cat === "비겁";
    if (fav) set.add(e);
  });
  return set;
}

export interface AnalysisInput {
  a: CompatPerson;
  b: CompatPerson;
  aToB: RelationCategory;
  bToA: RelationCategory;
  score: { total: number; breakdown: { attraction: number; comm: number; stability: number; growth: number; friction: number } };
  haps: string[];
  chungs: string[];
  samhap: number;
  banghap: number;
  hyeong: number;
  hae: number;
  spousePalace: "합" | "충" | "형해" | "-";
  stemHaps: string[];
  dayStemHarmony: boolean;
  complement: number;
  timeline: { year: number; score: number }[];
}

const ROLE_LEAD: Record<RelationCategory, (lead: string, follow: string) => string> = {
  재성: (l, f) => `${l}이(가) 먼저 다가가 ${f}을(를) 끌어당기는 ‘추구형’ 구도.`,
  관성: (l, f) => `${f}이(가) ${l}을(를) 이끌고 자극하는 ‘리드형’ 구도.`,
  식상: (l, f) => `${l}이(가) ${f}을(를) 살뜰히 챙기고 표현하는 ‘돌봄형’ 구도.`,
  인성: (l, f) => `${f}이(가) ${l}을(를) 감싸고 받쳐주는 ‘보호자형’ 구도.`,
  비겁: () => `서로 대등한 ‘동반자형’ — 리드와 따름이 번갈아 오갑니다.`,
};

export function buildAnalysis(i: AnalysisInput): AnalysisCategory[] {
  const A = i.a.subject.name, B = i.b.subject.name;
  const bd = i.score.breakdown;
  const fireSum = i.a.elements.scores["화"] + i.b.elements.scores["화"];
  const chung = i.chungs.length;

  // 귀인/원진 교차
  const aBr = branchesOf(i.a), bBr = branchesOf(i.b);
  const aGui = GUIIN[i.a.saju.dayMaster], bGui = GUIIN[i.b.saju.dayMaster];
  const guiinAtoB = bBr.some((x) => aGui.includes(x)); // B에게 A의 귀인이 있음(A가 B를 귀인으로 봄)
  const guiinBtoA = aBr.some((x) => bGui.includes(x));
  const guiin = guiinAtoB || guiinBtoA;
  let wonjin = 0;
  for (const x of aBr) for (const y of bBr) if (WONJIN.has(x + y)) wonjin++;

  // 용신 보완
  const aYong = yongsin(i.a), bYong = yongsin(i.b);
  const bFeedsA = aYong.has(i.b.mainElement);
  const aFeedsB = bYong.has(i.a.mainElement);

  const cats: AnalysisCategory[] = [];

  // 1. 감정·끌림
  cats.push({
    key: "attraction",
    title: "감정 · 끌림",
    score: bd.attraction,
    points: [
      i.dayStemHarmony
        ? "두 일간이 천간합(일간합) — 머리로 따지기 전에 본능적으로 끌리는 운명적 인력입니다."
        : i.stemHaps.length
          ? "천간이 어우러져 은근하고 부드러운 끌림이 흐릅니다(이성과 본능의 중간)."
          : "강렬한 끌림보다 알아갈수록 정드는 ‘이성적 선택형’ 끌림입니다.",
      fireSum >= 3 ? "두 사람 다 감정 표현이 살아 있어 설렘을 주고받기 쉽습니다." : "화(火) 기운이 적어 표현이 담백 — 설렘은 ‘꾸준한 챙김’에서 옵니다.",
      chung >= 1 ? "지지 충이 있어 ‘밀당’처럼 자극적인 설렘이 반복됩니다." : "잔잔하고 안정적인 끌림 — 편안함이 곧 매력입니다.",
    ],
  });

  // 2. 생활 궁합 (일지)
  cats.push({
    key: "life",
    title: "생활 궁합",
    score: bd.stability,
    points: [
      i.spousePalace === "합"
        ? "일지(생활·배우자 자리)가 합 — 일상 리듬과 생활 패턴이 잘 맞습니다."
        : i.spousePalace === "충"
          ? "일지가 충 — 생활 리듬이 어긋나기 쉬워 ‘각자 공간·시간’ 합의가 필요합니다."
          : "일지 관계는 중립 — 함께 규칙을 만들며 맞춰가는 편입니다.",
      chung >= 1 ? "함께 있으면 편안함보다 ‘자극’이 큰 편 — 활동적 데이트가 어울립니다." : "함께 있을 때 편안함이 큰 ‘정적 안정형’입니다.",
      "돈 쓰는 결: " + (bFeedsA || aFeedsB ? "서로의 소비·저축 성향을 보완합니다." : "실리 지향이 비슷해 무난하나, 공동 규칙은 필요합니다."),
    ],
  });

  // 3. 소통·대화
  cats.push({
    key: "comm",
    title: "소통 · 대화 방식",
    score: bd.comm,
    points: [
      fireSum >= 3 ? "감정 표현형 대화 — 마음을 말로 주고받는 데 익숙합니다." : "논리·실용 표현형 — 사실 전달은 잘 되나 감정 언어는 의식적으로 더해야 합니다.",
      chung >= 1 ? "대화 속도·방식이 달라 말이 부딪히기 쉽습니다(한 박자 조절 필요)." : "말의 결이 비슷해 대화가 편안하게 흐릅니다.",
      "침묵: " + (fireSum <= 2 ? "둘 다 침묵을 편안해하는 편 — 말없이도 통합니다." : "대화가 끊기면 어색해질 수 있어 가벼운 표현이 윤활유."),
    ],
  });

  // 4. 갈등 패턴 (형·충)
  cats.push({
    key: "conflict",
    title: "갈등 패턴",
    score: clamp(100 - bd.friction),
    points: [
      chung >= 1 || i.hyeong + i.hae >= 1
        ? `반복 갈등 지점: 충·형해(${i.chungs.join(",") || "-"})로 ‘방식·고집’이 자주 부딪힙니다.`
        : "큰 갈등 요인은 적은 편 — 사소한 습관 차이가 주된 마찰입니다.",
      fireSum >= 3 ? "감정 회복은 빠른 편 — 표현으로 금방 풉니다." : "한번 식으면 회복이 더딘 ‘냉전형’ — 먼저 손 내미는 쪽이 필요합니다.",
      ROLE_LEAD[i.aToB] === ROLE_LEAD.비겁
        ? "권력 균형은 대등 — 자존심 싸움만 조심하면 됩니다."
        : "한쪽이 주도권을 쥐기 쉬워, 결정권을 의식적으로 나눠야 합니다.",
    ],
  });

  // 5. 역할 분담 (십신)
  cats.push({
    key: "roles",
    title: "역할 분담",
    score: clamp(60 + (i.aToB !== "비겁" ? 16 : 0) + i.complement * 4),
    points: [
      ROLE_LEAD[i.aToB](A, B),
      i.aToB === "인성" || i.bToA === "인성" ? "감정적 돌봄을 맡는 쪽이 분명합니다(보호자형)." : "실질적 지원(돈·일)으로 사랑을 표현하는 경향.",
      "의사결정: " + (i.a.saju.tenGods.비겁 >= i.b.saju.tenGods.비겁 ? `${A}이(가) 주관이 더 강한 편.` : `${B}이(가) 주관이 더 강한 편.`),
    ],
  });

  // 6. 에너지 교환 (용신·기신)
  cats.push({
    key: "energy",
    title: "에너지 교환",
    score: clamp(bd.growth + (bFeedsA ? 6 : 0) + (aFeedsB ? 6 : 0)),
    points: [
      bFeedsA || aFeedsB
        ? "상대가 내게 부족한 기운(용신)을 채워줘 ‘함께 있으면 충전’되는 관계입니다."
        : "비슷한 기운이라 편안하지만, 새로 채워지는 자극은 적은 편(방전 주의).",
      i.complement > 0 ? `서로의 빈 곳을 메우며 성장시키는 관계(보완 ${i.complement}).` : "성장보다 안정·공감에 강점이 있는 관계.",
      "의존성: " + (i.aToB === "인성" || i.bToA === "인성" ? "한쪽이 기대는 의존이 생기기 쉬움 — 자립 균형 필요." : "건강한 거리 유지가 가능한 편."),
    ],
  });

  // 7. 관계 지속력
  const longTerm = i.haps.length + i.samhap >= 2 && chung <= 1;
  cats.push({
    key: "duration",
    title: "관계 지속력",
    score: i.score.total,
    points: [
      longTerm ? "합이 탄탄해 ‘장기 안정형’ — 오래갈수록 단단해집니다." : "끌림·자극이 큰 ‘단기 불꽃형’ 성향 — 안정 장치를 의식적으로 마련해야 합니다.",
      fireSum <= 2 ? "표현이 줄면 권태가 빨리 올 수 있어, 주기적 환기가 필요합니다." : "감정 교류가 살아 있어 권태가 더디게 옵니다.",
      i.spousePalace === "합" && i.score.total >= 80
        ? "배우자궁 합 + 높은 안정 — 결혼으로 이어질 가능성이 큽니다."
        : "결혼은 ‘시기(타이밍)’를 잘 맞추는 것이 관건입니다.",
    ],
  });

  // 8. 타이밍 (대운·세운)
  const thisYear = new Date().getFullYear();
  const now = i.timeline.find((t) => t.year === thisYear) ?? i.timeline[0];
  const peak = i.timeline.reduce((m, t) => (t.score > m.score ? t : m));
  const low = i.timeline.reduce((m, t) => (t.score < m.score ? t : m));
  cats.push({
    key: "timing",
    title: "타이밍",
    score: now.score,
    points: [
      now.score >= 60 ? `지금(${thisYear})은 관계를 진전시키기 좋은 시기입니다.` : `지금(${thisYear})은 다지기·관망이 유리한 시기입니다.`,
      `관계가 가장 깊어지는 해: ${peak.year} (합이 가장 강한 시기 — 결혼·약속 적기).`,
      `조심할 해: ${low.year} (충·형해가 겹쳐 거리·갈등 주의 — 이별·재결합 변동 가능).`,
    ],
  });

  // 9. 특수 인연 (귀인·원진)
  cats.push({
    key: "fate",
    title: "특수 인연",
    score: clamp(50 + (guiin ? 18 : 0) + (i.dayStemHarmony ? 12 : 0) - wonjin * 12),
    points: [
      guiin ? "서로가 ‘천을귀인’에 해당 — 위기에 서로를 살리는 귀인 인연입니다." : "특별한 귀인 작용은 약한 편 — 노력으로 만들어가는 인연.",
      i.dayStemHarmony ? "일간합까지 더해져 ‘전생 인연’처럼 느껴지는 운명적 만남." : "운명적이기보다 현실에서 다져가는 만남에 가깝습니다.",
      wonjin >= 1
        ? "원진(怨嗔) 기운이 있어 ‘이유 없이 미운’ 순간이 올 수 있음 — 거리·이해로 다스려야."
        : "악연·원진 요소는 없어, 기본 결은 순한 인연입니다.",
    ],
  });

  return cats;
}
