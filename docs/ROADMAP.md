# 구현 로드맵

사용자 제안 플로우(STEP 1~4)를 그대로 단계로 삼되, **MVP는 STEP 1~3**으로 한정합니다.

## MVP 경계

```
[ MVP ]   STEP1 캐릭터 카드 ─ STEP2 웹 리포트 ─ STEP3 PDF
[ 제외 ]  STEP4 AI 휴먼 영상
[ 이후 ]  확장 상품(궁합/세운/자녀)
```

**STEP4(AI 휴먼 영상)는 범위에서 제외**(사용자 결정, 2026-06-05). 영상 생성 API 단가·렌더
시간이 커서 결제 전환 대비 비용·대기 부담이 큼. STEP 1~3만으로 "상품"이 성립함.

---

## STEP 0 — 기반 (분석 파이프라인 + 데이터 모델)

UI보다 먼저, **단일 소스 `ReportData`를 만드는 파이프라인**을 세움.

- [x] `ReportData`/`SajuChart` 타입 정의(REPORT_MODEL.md 기준) — `src/types/report.ts`
- [x] 만세력 계산 모듈(격리된 패키지) — **lunar-javascript** 기반 八字, 절기 경계·음양력(윤달) 변환 정확 (`src/lib/saju`). 진태양시 보정은 추후.
- [x] 계산 스냅샷 테스트(알려진 생년월일 → 원국 고정값 검증) — `calculate.test.ts`
- [x] LLM 해석 단계: 사주 원국 → 카드 연출 텍스트 + `sections`(ContentBlock JSON) — `src/lib/llm/generateReport.ts` (`claude-opus-4-8`, 구조화 출력). 수치는 계산이, 글은 LLM 이 담당. 병합은 `src/lib/report/build.ts`.
- [x] 더미 `ReportData` 픽스처 1개(이후 UI가 이것으로 개발) — `src/fixtures/sampleReport.ts`

## STEP 1 — SSR 캐릭터 카드

- [ ] `<CharacterCard>` 컴포넌트(랭크/레벨/주속성/능력치/스킬 ★)
- [ ] 희소성(SSR 등) 연출 — 통계 분포 기반 등급 산정
- [ ] 공유 이미지(OG) 자동 생성(카드 미리보기)
- [ ] `report/:id` 상단 히어로로 배치

## STEP 2 — 스크롤 웹 리포트

- [ ] 섹션 렌더러: ContentBlock → paragraph/list/callout/gauge
- [ ] 오행 그래프(웹: 차트, 공용: SVG 사전 렌더)
- [ ] 섹션 순서: 연애 → 돈 → 직업 → 인간관계 → 운세 → 총평
- [ ] 모바일 스크롤 UX(MZ 타깃) 최적화

## STEP 3 — PDF 다운로드

- [x] 인쇄 레이아웃: `report/:id?print=1` + `print:` Tailwind 변형 (`globals.css`, 페이지)
- [x] Playwright 워커: 해당 URL 렌더 → `page.pdf()` (`scripts/generate-pdf.ts`) — 스토리지 업로드는 `PdfStorage` 포트로 연결
- [x] PDF 생성 큐(비동기) + 상태 폴링(`/api/reports/:id/pdf`) — `JobQueue` 포트 + 인라인 어댑터
- [x] 파일명: `{이름}_운명리포트.pdf`
- [ ] 다운로드 링크 도메인(`download.myfortune.ai/:id.pdf`) — 운영 스토리지/도메인 연동 시

### 인프라 (포트-어댑터)

- [x] 결제·영속·PDF 스토리지·큐 **포트** 정의 (`src/lib/ports`)
- [x] 인메모리/로컬/스텁 **어댑터** + 컴포지션 루트 (`src/lib/adapters`, `src/lib/services/container.ts`)
- [x] 결제 → 분석 → 저장 → PDF 큐 플로우 (`POST /api/reports`)
- [ ] 실제 벤더 어댑터(Postgres / Stripe·토스 / S3 등) — **스택 확정 후 어댑터만 교체**

## STEP 4 — AI 휴먼 설명 (❌ 범위 제외)

> 사용자 결정(2026-06-05)으로 범위에서 제외. 아래는 향후 재검토 시 참고용 메모.

- [ ] 스크립트 생성("안녕하세요. 김○○님의 사주를...") — 이미 있는 `sections`에서 요약
- [ ] 영상 생성 API 연동(비용/대기 검토 후)
- [ ] 리포트 상단 임베드

## 확장 상품 (STEP4 이후 병행 가능)

- [ ] 궁합(두 사주 입력)
- [ ] 올해 운세(세운)
- [ ] 자녀 분석

---

## 권장 진행 순서

1. **STEP 0**으로 `ReportData` 픽스처를 먼저 확보 → 이후 모든 UI는 더미 데이터로 개발 가능(분석 완성 기다릴 필요 없음).
2. **STEP 1 카드**부터 눈에 보이게 만들어 데모/검증.
3. STEP 2 → 3 순으로 확장.

> 다음 작업으로 무엇을 코드화할지는 사용자 확정 후 진행. (이 문서는 설계 합의용)
