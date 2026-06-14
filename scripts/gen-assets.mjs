/**
 * 브랜드 이미지 에셋 생성기 — Google Gemini "나노바나나"(이미지 모델) 호출.
 *
 * process.env.GOOGLE_API_KEY 로 Gemini 이미지 모델(gemini-2.5-flash-image 등)을 호출해
 * 히어로 캐릭터 / 이벤트 배너 배경 / 메뉴 아이콘을 public/brand/ 아래에 생성한다.
 *
 * 사용:
 *   GOOGLE_API_KEY=... node scripts/gen-assets.mjs            # 없는 파일만 생성
 *   GOOGLE_API_KEY=... FORCE=1 node scripts/gen-assets.mjs    # 전부 재생성(덮어쓰기)
 *   GOOGLE_API_KEY=... node scripts/gen-assets.mjs menu       # 특정 그룹만(hero|events|menu)
 *
 * 환경변수:
 *   GOOGLE_API_KEY        (필수) Gemini API 키
 *   GEMINI_IMAGE_MODEL    (선택) 기본 "gemini-2.5-flash-image"
 *   FORCE                 (선택) 1이면 기존 파일도 덮어씀
 *
 * 참고: Gemini 이미지 생성은 유료(빌링 활성화) 프로젝트의 키가 필요하다.
 *       무료 등급 키는 429(quota limit 0) 또는 403 을 반환한다.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
const FORCE = process.env.FORCE === "1";
const ROOT = new URL("../public/brand/", import.meta.url).pathname;

if (!API_KEY) {
  console.error("[gen-assets] GOOGLE_API_KEY 가 설정되지 않았습니다.");
  process.exit(1);
}

/** 공통 스타일 토큰 — 브랜드 일관성 유지용. */
const STYLE = {
  clay3d:
    "soft 3D clay-render illustration, smooth matte clay material, gentle studio lighting, soft ambient occlusion, rounded friendly shapes, high detail, octane render look",
  pastel:
    "pastel color palette (lavender, peach, mint, soft pink, cream), warm and cozy mood",
  noText: "no text, no letters, no watermark, no logo",
};

/** 투명 배경 PNG 를 요청하는 지시문. */
const TRANSPARENT = "isolated subject on a fully transparent background (alpha channel), PNG with transparency, no shadow on ground";

/**
 * 생성 대상 정의.
 * group: 그룹 필터용 키 / file: public/brand 기준 상대경로 / prompt: 생성 프롬프트
 */
const ASSETS = [
  // 1) 히어로 3D 클레이 마녀 캐릭터 (투명배경)
  {
    group: "hero",
    file: "char-hero.png",
    prompt: `Adorable chibi witch girl mascot character for a Korean fortune-telling (사주/운세) brand. ${STYLE.clay3d}. She wears a cute pointed witch hat with a tiny crescent moon and stars, a flowing pastel robe, and holds a glowing crystal ball. Big friendly eyes, gentle smile, mystical sparkles around her. ${STYLE.pastel}. Centered full-body, front three-quarter view. ${TRANSPARENT}. ${STYLE.noText}.`,
  },

  // 2) 이벤트 배너 배경 3종 (와이드, 배경 위주)
  {
    group: "events",
    file: "events/launch.png",
    prompt: `Wide celebratory launch event banner background. ${STYLE.clay3d}. Floating clay confetti, ribbons, sparkles, party balloons, soft bokeh light, festive grand-opening mood. ${STYLE.pastel}. Empty calm space in the center for overlaying text. 16:9 wide composition. ${STYLE.noText}.`,
  },
  {
    group: "events",
    file: "events/gunghap.png",
    prompt: `Wide romantic compatibility (궁합/couple match) event banner background. ${STYLE.clay3d}. Floating clay hearts, intertwined red string of fate, two crescent moons, soft sparkles, dreamy love mood. ${STYLE.pastel}. Empty calm space in the center for overlaying text. 16:9 wide composition. ${STYLE.noText}.`,
  },
  {
    group: "events",
    file: "events/consult.png",
    prompt: `Wide one-on-one consultation (상담) event banner background. ${STYLE.clay3d}. Floating clay crystal ball, tarot-like cards, candle, speech bubbles, mystical calm and trustworthy mood. ${STYLE.pastel}. Empty calm space in the center for overlaying text. 16:9 wide composition. ${STYLE.noText}.`,
  },

  // 3) 메뉴 아이콘 9종 (파스텔 3D 일러스트, 투명배경)
  ...[
    ["saju", "a four-pillars (사주) destiny chart with Chinese-style heavenly stem & earthly branch blocks and a glowing yin-yang"],
    ["unse", "a flowing fortune (운세) wave with a shooting star and crescent moon"],
    ["gunghap", "two interlocking hearts joined by a red string of fate (궁합 compatibility)"],
    ["couple", "a cute couple silhouette under a heart, romantic relationship (연애)"],
    ["health", "a glowing heartbeat pulse with a healing leaf and shield (건강 health)"],
    ["admission", "a graduation cap with a sprouting pencil and rising arrow (입시/합격 admission)"],
    ["strategy", "a chess knight piece with a target and compass (전략 strategy)"],
    ["family", "a cozy house with a parent-and-child family group (가족 family)"],
    ["child", "a baby star with a pacifier and tiny crescent moon (자녀 child)"],
  ].map(([name, subject]) => ({
    group: "menu",
    file: `menu/${name}.png`,
    prompt: `App menu icon: ${subject}. ${STYLE.clay3d}. Single centered icon, simple and readable at small size, soft rounded silhouette. ${STYLE.pastel}. ${TRANSPARENT}. ${STYLE.noText}.`,
  })),
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Gemini 이미지 모델 호출 → PNG 바이트 반환(429/5xx 는 지수 백오프 재시도). */
async function generateImage(prompt, { retries = 4 } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = await res.json();
      const parts = json?.candidates?.[0]?.content?.parts ?? [];
      const img = parts.find((p) => p.inlineData?.data);
      if (!img) throw new Error("응답에 이미지가 없습니다: " + JSON.stringify(json).slice(0, 300));
      return Buffer.from(img.inlineData.data, "base64");
    }

    const text = await res.text();
    // 일시적 오류만 재시도, 권한/쿼터(403/429) 은 즉시 명확히 알림
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      const wait = 2000 * 2 ** attempt;
      console.warn(`[gen-assets] ${res.status} 재시도 ${attempt + 1}/${retries} (${wait}ms)`);
      await sleep(wait);
      continue;
    }
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 300)}`);
  }
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const filter = process.argv[2]; // hero|events|menu (선택)
  const targets = filter ? ASSETS.filter((a) => a.group === filter) : ASSETS;
  if (!targets.length) {
    console.error(`[gen-assets] 그룹 "${filter}" 에 해당하는 에셋이 없습니다.`);
    process.exit(1);
  }

  console.log(`[gen-assets] 모델=${MODEL} 대상=${targets.length}개${filter ? ` (그룹:${filter})` : ""}`);
  let ok = 0;
  for (const asset of targets) {
    const out = join(ROOT, asset.file);
    if (!FORCE && (await exists(out))) {
      console.log(`[skip] ${asset.file} (이미 존재, FORCE=1 로 덮어쓰기)`);
      ok++;
      continue;
    }
    try {
      const png = await generateImage(asset.prompt);
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, png);
      console.log(`[ok]   ${asset.file} (${(png.length / 1024).toFixed(0)} KB)`);
      ok++;
      await sleep(500); // 레이트리밋 완화
    } catch (e) {
      console.error(`[fail] ${asset.file}: ${e.message}`);
    }
  }
  console.log(`[gen-assets] 완료: ${ok}/${targets.length}`);
  if (ok < targets.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
