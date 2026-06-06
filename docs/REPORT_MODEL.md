# 리포트 데이터 모델 (Single Source of Truth)

분석 파이프라인이 만들고, 웹·PDF가 함께 소비하는 **하나의 데이터 구조**입니다.
UI는 이 JSON만 보고 렌더링합니다(데이터와 표현의 분리).

## 1. 최상위 구조

```ts
interface ReportData {
  id: string;                 // 공유 토큰 (예: "8F4D2A")
  createdAt: string;          // ISO8601
  subject: Subject;           // 입력값(사용자)
  saju: SajuChart;            // 사주 원국(계산 결과)
  card: CharacterCard;        // STEP1: SSR 캐릭터 카드
  elements: ElementProfile;   // 오행 프로파일(그래프용)
  sections: ReportSection[];  // STEP2: 스크롤 리포트 본문
  pdf?: PdfArtifact;          // STEP3: 생성된 PDF 메타
  avatar?: AvatarArtifact;    // STEP4: AI 휴먼 설명(후순위)
}
```

## 2. 입력값

```ts
interface Subject {
  name: string;               // 호칭용
  birth: {
    date: string;             // "1995-03-21" (양력 기준 저장, 음력 입력은 변환)
    time?: string;            // "13:40" (모르면 생략 → 시주 제외)
    calendar: 'solar' | 'lunar';
    isLeapMonth?: boolean;    // 음력 윤달
  };
  gender: 'male' | 'female';
  birthPlace?: string;        // 진태양시 보정용(선택)
}
```

## 3. 사주 원국 (계산 결과)

```ts
interface SajuChart {
  pillars: {                  // 연/월/일/시 4주
    year:  Pillar;
    month: Pillar;
    day:   Pillar;            // 일간 = day.stem (자기 자신)
    hour?: Pillar;            // 출생시각 미상이면 없음
  };
  dayMaster: HeavenlyStem;    // 일간(나를 대표하는 천간)
  tenGods: TenGodCount;       // 십성 분포(비겁/식상/재성/관성/인성)
}

interface Pillar {
  stem:   HeavenlyStem;       // 천간 (甲乙丙丁戊己庚辛壬癸)
  branch: EarthlyBranch;      // 지지 (子丑寅卯辰巳午未申酉戌亥)
  element: Element;           // 해당 주의 대표 오행
}

type Element = '목' | '화' | '토' | '금' | '수';   // wood/fire/earth/metal/water
```

> ⚠️ 만세력 계산(절기 경계, 진태양시, 음→양 변환)은 정확도가 핵심.
> 이 구조를 만드는 **계산 모듈은 독립 패키지로 격리하고 스냅샷 테스트로 고정**한다(ARCHITECTURE.md 2절).

## 4. STEP1 — SSR 캐릭터 카드 (포켓몬 카드 감성)

화면 최상단에 가장 먼저 뜨는, 공유를 유발하는 히어로 영역.

```ts
interface CharacterCard {
  rank: 'SSR' | 'SR' | 'R' | 'N';   // 희소성 연출(통계 분포로 산정)
  title: string;                    // "전략가"
  level: number;                    // 46 (나이/대운 기반 연출 수치)
  mainElement: Element;             // 주속성: 토
  job: string;                      // "기획자"
  stats: {                          // 능력치(0~100)
    insight: number;
    leadership: number;
    creativity: number;
    stability: number;
    drive: number;
  };
  skills: {
    main:    Skill;                 // 메인 스킬 (★★★★★ 통찰력)
    passive: Skill;                 // 패시브 (★★★★★ 사람을 모으는 힘)
    weakness: Skill;                // 약점 (★★★☆☆ 과도한 책임감)
  };
}

interface Skill {
  name: string;
  stars: 1 | 2 | 3 | 4 | 5;
  description?: string;
}
```

예시(사용자가 제시한 카드):

```
SSR  전략가      Lv.46
주속성: 토        직업: 기획자
메인  ★★★★★ 통찰력
패시브 ★★★★★ 사람을 모으는 힘
약점  ★★★☆☆ 과도한 책임감
```

## 5. 오행 프로파일 (그래프용)

```ts
interface ElementProfile {
  scores: Record<Element, number>;  // { 목: 12, 화: 8, 토: 30, ... } 그래프 값
  dominant: Element;                // 가장 강한 오행
  lacking: Element;                 // 부족한 오행(보완 키워드에 사용)
}
```

웹은 레이더/막대 차트로, PDF는 같은 데이터를 **SVG로 사전 렌더**해 동일하게 표현.

## 6. STEP2 — 스크롤 리포트 본문 (~30페이지 분량)

카드 아래로 스크롤하면 나오는 섹션들. 순서는 사용자가 제시한 흐름을 따름.

```ts
interface ReportSection {
  key: 'love' | 'money' | 'career' | 'relationship' | 'fortune' | 'summary';
  title: string;                    // "연애 분석"
  emoji?: string;
  summary: string;                  // 1~2줄 핵심
  body: ContentBlock[];             // LLM 생성 본문(구조화)
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; tone: 'tip' | 'warning' | 'highlight'; text: string }
  | { type: 'gauge'; label: string; value: number };
```

섹션 순서(기본): **연애 → 돈 → 직업 → 인간관계 → 운세 → 총평**.

LLM은 자유 산문이 아니라 **위 ContentBlock 구조**로 출력하게 강제(프롬프트에서 JSON 스키마 지정).
→ 웹/PDF 레이아웃이 깨지지 않고, 섹션 추가·재정렬이 자유로움.

## 7. STEP3 / STEP4 — 산출물 메타

```ts
interface PdfArtifact {
  status: 'pending' | 'ready' | 'failed';
  url?: string;                     // download.myfortune.ai/:id.pdf
  bytes?: number;
  generatedAt?: string;
}

interface AvatarArtifact {          // 후순위(STEP4)
  status: 'pending' | 'ready' | 'failed';
  videoUrl?: string;
  script?: string;                  // "안녕하세요. 김○○님의 사주를 분석해보았습니다..."
}
```

## 8. 확장 상품(향후)

같은 `ReportData`/파이프라인 위에 얹는 추가 상품:

- **궁합**: 두 `SajuChart`를 입력으로 받는 별도 리포트 타입.
- **올해 운세**: 세운(歲運) 기반 시즌 리포트.
- **자녀 분석**: subject 관계 필드 확장.

→ 데이터 모델을 `ReportData` 단위로 잘 끊어두면, 재방문 사용자에게 추가 상품을 자연스럽게 붙일 수 있음.
