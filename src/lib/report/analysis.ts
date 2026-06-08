/**
 * 개인 사주 10대 심층 분석 — 나 자신 / 운의 흐름 / 직업·돈 / 연애·결혼 /
 * 인간관계 / 이사·방향 / 건강·심리 / 자녀·부모 / 시기·타이밍 / 인생 서사.
 * 원국·십성·용신·대운/세운·귀인·역마·장부 등을 근거로 카테고리별 통찰을 만든다.
 */
import { Solar } from "lunar-javascript";
import type { Element, Subject } from "@/types/report";
import type { PersonalCategory } from "@/types/report";
import { calculateSaju } from "@/lib/saju/calculate";
import { computeElementProfile } from "@/lib/report/buildCard";
import { computeFortune, estimateStrength } from "@/lib/fortune/compute";
import { STEM_ELEMENT, BRANCH_ELEMENT, STEMS, BRANCHES, tenGodCategory } from "@/lib/saju/constants";

const GAN_CN = "甲乙丙丁戊己庚辛壬癸";
const ZHI_CN = "子丑寅卯辰巳午未申酉戌亥";

const ORGAN: Record<Element, string> = {
  목: "간·담, 자율신경",
  화: "심장·혈관, 소장",
  토: "비위·소화기",
  금: "폐·대장, 호흡기",
  수: "신장·방광, 생식·뼈",
};
const DIR: Record<Element, string> = { 목: "동(東)", 화: "남(南)", 토: "중앙·환절기", 금: "서(西)", 수: "북(北)" };
const PSY_OVER: Record<Element, string> = {
  목: "추진·고집이 과해 욱하거나 일을 벌이기 쉬움",
  화: "감정 기복·조급함, 쉽게 달아오름",
  토: "생각이 많고 무거워 우유부단·정체",
  금: "예민·완벽주의, 자기비판이 강함",
  수: "걱정·불안이 많고 속을 잘 안 드러냄",
};
const PSY_UNDER: Record<Element, string> = {
  목: "시작하는 추진력·결단이 부족",
  화: "표현·열정·자신감이 부족",
  토: "중심·끈기가 흔들리기 쉬움",
  금: "맺고 끊는 결단·정리력이 약함",
  수: "유연성·지혜·휴식이 부족",
};
const GUIIN: Record<string, string[]> = {
  갑: ["축", "미"], 무: ["축", "미"], 경: ["축", "미"],
  을: ["자", "신"], 기: ["자", "신"],
  병: ["해", "유"], 정: ["해", "유"],
  신: ["인", "오"], 임: ["사", "묘"], 계: ["사", "묘"],
};
const YEOKMA = new Set(["인", "신", "사", "해"]);

function yongElements(dayEl: Element, strong: boolean): Element[] {
  return (["목", "화", "토", "금", "수"] as Element[]).filter((e) => {
    const cat = tenGodCategory(dayEl, e);
    return strong ? cat === "식상" || cat === "재성" || cat === "관성" : cat === "인성" || cat === "비겁";
  });
}

export function buildPersonalAnalysis(subject: Subject): PersonalCategory[] {
  const saju = calculateSaju(subject);
  const el = computeElementProfile(saju);
  const tg = saju.tenGods;
  const dayEl = STEM_ELEMENT[saju.dayMaster];
  const strength = estimateStrength(saju);
  const f = computeFortune(subject);
  const yong = yongElements(dayEl, strength.strong);
  const gisin = (["목", "화", "토", "금", "수"] as Element[]).filter((e) => !yong.includes(e));
  const dom = el.dominant, lack = el.lacking;
  const branches = [saju.pillars.year.branch, saju.pillars.month.branch, saju.pillars.day.branch, ...(saju.pillars.hour ? [saju.pillars.hour.branch] : [])];
  const male = subject.gender === "male";

  // 강한 십성
  const tgEntries = Object.entries(tg) as [keyof typeof tg, number][];
  const topGod = tgEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  // 귀인/역마
  const guiin = GUIIN[saju.dayMaster] ?? [];
  const hasGuiin = branches.some((b) => guiin.includes(b));
  const yeokma = branches.filter((b) => YEOKMA.has(b)).length;

  // 현재 대운 / 올해
  const cur = f.daewoon.find((d) => d.current) ?? f.daewoon[0];
  const thisYear = f.currentYear;
  const yNow = f.yearly.find((y) => y.year === thisYear) ?? f.yearly[0];
  const peakYear = f.yearly.reduce((m, y) => (y.health > m.health ? y : m));
  const lowYear = f.yearly.reduce((m, y) => (y.health < m.health ? y : m));
  // 월운/일운
  const now = new Date();
  const lun = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate()).getLunar();
  const monthStemEl = STEM_ELEMENT[STEMS[GAN_CN.indexOf(lun.getMonthInGanZhi()[0])]];
  const dayStemEl = STEM_ELEMENT[STEMS[GAN_CN.indexOf(lun.getDayInGanZhi()[0])]];
  const favWord = (e: Element) => (yong.includes(e) ? "힘이 받쳐주는 좋은" : gisin.includes(e) ? "에너지 관리가 필요한" : "무난한");

  // 직업 적성 by 강한 십성
  const JOB: Record<string, string> = {
    식상: "기술·창작·콘텐츠·전문 제작 등 ‘손과 재능으로 만들어내는’ 일",
    재성: "사업·영업·금융·유통 등 ‘현실 감각과 수완’을 쓰는 일",
    관성: "조직·관리·공직·법무 등 ‘질서와 책임’을 다루는 일",
    인성: "교육·연구·기획·상담 등 ‘배움과 사람을 키우는’ 일",
    비겁: "전문직·프리랜서·동업 등 ‘자기 이름으로 독립’하는 일",
  };
  const selfEmp = tg.관성 === 0 || tg.식상 + tg.비겁 >= 4;

  const cats: PersonalCategory[] = [];

  cats.push({
    key: "self",
    title: "나 자신",
    points: [
      `일간 ${saju.dayMaster}${dayEl}(${dayEl}) · ${strength.label} — ${strength.strong ? "주관이 뚜렷하고 추진하는" : "섬세하고 받아들이는"} 체질. 가장 강한 기운은 ${dom}, 비어 있는 기운은 ${lack}.`,
      `강점: ${dom} 기운과 ${topGod}의 재능. 약점: ${PSY_UNDER[lack]}.`,
      `건강 취약: 과다한 ${dom}(${ORGAN[dom]})와 부족한 ${lack}(${ORGAN[lack]}) 계통을 살피면 좋습니다.`,
      `전생·영적 결: ${tg.인성 > 0 || dayEl === "수" ? "직관·정신세계에 민감해 종교·명상과 인연이 있는" : "현실·실용에 뿌리내린"} 기질입니다.`,
    ],
  });

  cats.push({
    key: "flow",
    title: "운의 흐름",
    score: yNow.health,
    points: [
      `대운(현재): ${cur.stem}${cur.branch} ${cur.startAge}~${cur.endAge}세 — ${cur.summary ?? cur.tenGod + " 대운"}.`,
      `세운(올해 ${thisYear}): ${favWord(STEM_ELEMENT[STEMS[((thisYear - 4) % 10 + 10) % 10]])} 해. 종합 흐름 ${yNow.health}점.`,
      `월운(이달): ${favWord(monthStemEl)} 달 — ${yong.includes(monthStemEl) ? "추진·결정에 유리" : "정비·관리에 집중"}.`,
      `일운(오늘): ${favWord(dayStemEl)} 날 — ${yong.includes(dayStemEl) ? "중요한 결정·미팅을 잡기 좋음" : "무리한 결정보다 마무리·휴식"}.`,
    ],
  });

  cats.push({
    key: "career",
    title: "직업 · 돈",
    points: [
      `적성: ${JOB[topGod]}.`,
      `${selfEmp ? "관성이 약하거나 식상·비겁이 강해 ‘사업·자영·프리랜서’ 체질" : "관성이 받쳐줘 ‘조직·직장’에서 안정적으로 성장하는 체질"}입니다.`,
      `재물: ${peakYear.year}년 전후가 재물운이 강하고, ${lowYear.year}년 전후는 손재·지출을 조심할 시기입니다.`,
    ],
  });

  cats.push({
    key: "love",
    title: "연애 · 결혼",
    points: [
      `배우자성: ${male ? "재성(財)" : "관성(官)"} — ${(male ? tg.재성 : tg.관성) === 0 ? "원국에 약해 인연이 늦거나 적극 표현이 필요" : "원국에 있어 인연의 결이 분명한 편"}.`,
      `맞는 상대: 내게 부족한 ${lack} 기운(${DIR[lack]} 방향·계절감)을 지닌 따뜻한 사람.`,
      `결혼 적기: 배우자성이 들어오는 대운·세운 — 대체로 ${peakYear.year}년 전후가 인연·결혼에 유리. (자세한 궁합은 ‘궁합 리포트’ 참고)`,
    ],
  });

  cats.push({
    key: "relations",
    title: "인간관계",
    points: [
      `귀인: ${hasGuiin ? "천을귀인이 원국에 있어 결정적 순간에 도와주는 사람을 만납니다." : "스스로 신뢰를 쌓아 귀인을 ‘만들어가는’ 편입니다."} ${tg.인성 > 0 ? "윗사람·스승 인연이 힘이 됩니다." : ""}`.trim(),
      `주의할 사람: 내 기신인 ${gisin.join("·")} 기운이 강한 사람 — 나를 소모시키기 쉬우니 거리 조절이 필요합니다.`,
      `가족 인연: ${tg.인성 > 0 ? "부모·윗사람과의 인연이 깊은" : "부모와는 독립적인"} 편이며, ${tg.비겁 >= 2 ? "형제·동료 인연이 강합니다." : "형제보다 스스로 서는 힘이 큽니다."}`,
    ],
  });

  cats.push({
    key: "direction",
    title: "이사 · 방향",
    points: [
      `길한 방향: ${yong.map((e) => DIR[e]).join(", ")} — 용신 기운을 채워주는 방위.`,
      `피할 방향: ${gisin.map((e) => DIR[e]).join(", ")} — 기운을 빼가는 방위(불가피하면 인테리어·습관으로 보완).`,
      `${yeokma >= 1 ? `역마(${yeokma})가 있어 이동·이사·해외와 인연이 많습니다. 변화를 두려워 마세요.` : "정착형이라 잦은 이동보다 한곳에서 뿌리내릴 때 안정됩니다."}`,
    ],
  });

  cats.push({
    key: "health",
    title: "건강 · 심리",
    points: [
      `심리 패턴: ${dom} 과다 → ${PSY_OVER[dom]}. ${lack} 부족 → ${PSY_UNDER[lack]}.`,
      `취약 장기: ${ORGAN[dom]} (과다)와 ${ORGAN[lack]} (부족) 계통.`,
      `번아웃 주기: 기신(${gisin.join("·")}) 기운이 강해지는 해 — 특히 ${lowYear.year}년 전후에 소진·우울이 오기 쉬우니 미리 쉬어가세요.`,
    ],
  });

  cats.push({
    key: "children",
    title: "자녀 · 부모",
    points: [
      `자식궁(시주): ${saju.pillars.hour ? `${saju.pillars.hour.stem}${saju.pillars.hour.branch}` : "(출생시각 미상)"} · 자식성(${male ? "관성" : "식상"}) ${male ? tg.관성 : tg.식상}개 — ${(male ? tg.관성 : tg.식상) > 0 ? "자녀 인연이 무난한" : "자녀 인연은 시기를 살피면 좋은"} 편.`,
      `자녀 기질: 내 ${dom} 기운을 닮아 ${dom === "목" ? "활동적·자기주장 강한" : dom === "토" ? "차분·끈기 있는" : dom === "금" ? "단단·결단력 있는" : dom === "수" ? "지혜롭고 유연한" : "밝고 표현력 있는"} 아이일 가능성.`,
      `부모 인연: 인성(印) ${tg.인성}개 — ${tg.인성 > 0 ? "부모(특히 모친)의 덕·도움이 있는 편." : "부모와 일찍 독립하거나 스스로 서는 힘이 큰 편."}`,
    ],
  });

  cats.push({
    key: "timing",
    title: "시기 · 타이밍",
    score: yNow.health,
    points: [
      `“지금 해야 하나?” — 올해(${thisYear}) 흐름은 ${yNow.health}점. ${yNow.health >= 60 ? "추진·도전에 유리한 시기입니다." : "벌이기보다 준비·다지기가 유리한 시기입니다."}`,
      `시험·취업·창업·투자 적기: 용신운이 드는 ${peakYear.year}년 전후가 가장 길합니다.`,
      `위기 구간: ${lowYear.year}년 전후 — 큰 결정·계약·투자는 한 박자 늦추는 게 안전합니다.`,
    ],
  });

  // 인생 서사 (대운 3분할 평균)
  const dw = f.daewoon;
  const seg = (arr: typeof dw) => (arr.length ? Math.round(arr.reduce((s, d) => s + d.score, 0) / arr.length) : 0);
  const early = seg(dw.slice(0, Math.max(1, Math.floor(dw.length / 3))));
  const mid = seg(dw.slice(Math.floor(dw.length / 3), Math.floor((dw.length * 2) / 3)));
  const late = seg(dw.slice(Math.floor((dw.length * 2) / 3)));
  const arc = (s: number) => (s >= 65 ? "상승·결실" : s >= 45 ? "다지기·안정" : "시련·성장");
  cats.push({
    key: "arc",
    title: "전체 인생 서사",
    points: [
      `초년 ${arc(early)} · 중년 ${arc(mid)} · 말년 ${arc(late)} 의 흐름.`,
      `인생 테마: 부족한 ${lack}(${PSY_UNDER[lack]})을 채워가는 여정. ${dom}의 강점으로 ${strength.strong ? "세상을 밀고 나가되" : "묵묵히 쌓아 올리되"} 균형을 배우는 삶.`,
      `이번 생의 과제: ${dom} 과다에서 오는 ‘${PSY_OVER[dom]}’를 다스리고, ${lack} 기운을 의식적으로 들이는 것.`,
    ],
  });

  return cats;
}
