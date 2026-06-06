# Fortune — 사주 × 심리 운명 리포트 서비스

사용자의 사주(만세력)와 심리 프레임을 결합해, **게임 캐릭터 카드(SSR) → 스크롤형 웹 리포트 → PDF 다운로드**로 이어지는
운명 리포트를 제공하는 서비스입니다.

> 이 저장소는 현재 **설계 단계**입니다. 코드보다 먼저 아키텍처·데이터 모델·로드맵을 확정합니다.

## 핵심 컨셉

```
사주 분석 결과(JSON)  ←  단 하나의 진실(Single Source of Truth)
        │
        ├─→ 웹 리포트 (SSR 캐릭터 카드 + 스크롤 섹션)
        └─→ PDF      (같은 컴포넌트를 그대로 렌더 → 인쇄)
```

웹용·PDF용 디자인을 두 번 만들지 않습니다. **분석 데이터는 한 번 생성**하고,
같은 리포트 컴포넌트를 화면에는 웹으로, 파일로는 PDF로 출력합니다.

## 실행

```bash
npm install
npm run dev            # http://localhost:3000  → 랜딩 → /report/SAMPLE
npm run typecheck      # 타입 검사
npm test               # 사주 계산 스냅샷 테스트(vitest)

# PDF 생성(워커, Chromium 필요)
npm run build && npm start   # 서버 기동
npm run pdf -- SAMPLE        # report/SAMPLE?print=1 → ./tmp/SAMPLE.pdf
```

## 구현 현황 (2026-06-05)

| STEP | 내용 | 상태 |
|------|------|------|
| 0 | 데이터 모델 + 만세력 계산 모듈 + 샘플 픽스처 | ✅ (lunar-javascript 기반 — 절기 경계·음양력 변환 정확, 스냅샷 테스트) |
| 0+ | LLM 본문 생성(Claude API) + 생성 오케스트레이터 + `POST /api/reports` | ✅ (구조화 출력, 병합 로직 테스트) |
| 1 | SSR 캐릭터 카드 | ✅ |
| 2 | 스크롤 웹 리포트(섹션 렌더러 + 오행 SVG 차트) | ✅ |
| 3 | PDF 파이프라인(인쇄 레이아웃 + Playwright 워커 + 상태 API) | ✅ 코드 (브라우저 바이너리 차단 환경에서 E2E 미실행) |
| 3+ | 인프라 포트-어댑터(결제·영속·PDF 스토리지·큐) + 결제→분석→저장→큐 플로우 | ✅ (인메모리/로컬 어댑터, 스택 미정 → 어댑터 교체로 벤더 연결) |
| 4 | AI 휴먼 영상 | ⏳ 후순위 |

> 만세력은 검증된 **lunar-javascript**(6tail)로 八字를 계산합니다 — 절기 경계로 연주/월주를 정확히 가르고, 음력(윤달 포함) 입력을 양력으로 변환합니다. 진태양시(출생지 경도) 보정은 추후 `src/lib/saju` 내에서 추가 가능(인터페이스 불변).

## 문서

| 문서 | 내용 |
|------|------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 전체 아키텍처, 기술 스택 추천(비교 포함), 시스템 구성 |
| [docs/REPORT_MODEL.md](docs/REPORT_MODEL.md) | 리포트 데이터 모델(JSON 스키마), 캐릭터 카드/능력치/오행 구조 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | STEP 1~4 단계별 구현 로드맵과 MVP 범위 |

## 한눈에 보는 추천

- **전달 방식**: 웹 리포트 + PDF 동시(방식 3). 단, **웹을 단일 소스**로 만들고 PDF는 같은 렌더를 굽는 구조.
- **기술 스택**: **All-TypeScript (Next.js + Playwright)** 추천. 사주 계산만 별도 모듈로 분리.
- **MVP 범위**: STEP 1~3 (캐릭터 카드 → 웹 리포트 → PDF). AI 휴먼 영상은 STEP 4로 후순위.

자세한 근거는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참고.
