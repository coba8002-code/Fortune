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
import { PNG } from "pngjs";

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
    "clear saturated pastel colors (lavender, peach, mint, soft pink), vivid but soft, avoid washed-out near-white surfaces, matte non-reflective clay to avoid color spill, warm and cozy mood",
  noText: "absolutely no text, no letters, no numbers, no color codes, no labels, no watermark, no logo anywhere in the image",
};

/**
 * 투명 배경용 지시문.
 * Gemini 는 "transparent background" 를 요청하면 실제 알파 대신 체크무늬 패턴을
 * 그려 넣는 경향이 있어, 단색 크로마키(녹색) 배경으로 생성한 뒤 후처리로 투명화한다.
 */
const CHROMA_RGB = { r: 0, g: 177, b: 64 }; // 크로마키 그린
const TRANSPARENT = `isolated subject centered, placed on a completely solid flat chroma-key green background, fill the entire background edge to edge with pure uniform green color RGB(0,177,64), absolutely no checkerboard, no pattern, no gradient, no vignette, no drop shadow on the ground`;

/**
 * 생성 대상 정의.
 * group: 그룹 필터용 키 / file: public/brand 기준 상대경로 / prompt: 생성 프롬프트
 */
const ASSETS = [
  // 1) 히어로 — "묘월의 마녀" 브랜드 캐릭터(소프트 3D 클레이, 투명배경)
  {
    group: "hero",
    file: "char-hero.png",
    transparent: true,
    prompt: `Cute charming brand mascot character: a friendly young witch named "Vernal Witch" for a Korean fortune-telling (사주·타로·운세) brand. ${STYLE.clay3d}. She wears a soft rounded pointed witch hat decorated with a small crescent moon and tiny stars, a cozy pastel cloak, gentle warm smile, big friendly eyes. She gently holds a softly glowing crystal ball, and a tiny cute black cat companion sits beside her. Spring pastel palette (lavender, mint, peach, cream), mystical soft sparkles around her. Centered full body, front three-quarter view, adorable and approachable. ${TRANSPARENT}. ${STYLE.noText}.`,
  },
  // 1-b) 마녀 얼굴 아이콘(앱 아이콘/아바타용, 투명배경)
  {
    group: "hero",
    file: "char-emblem.png",
    transparent: true,
    prompt: `App-icon style emblem: the head-and-shoulders of a cute 3D clay witch mascot wearing a soft pointed hat with a crescent moon, gentle smile, with a tiny black cat peeking beside her. ${STYLE.clay3d}. Spring pastel palette (lavender, mint, peach, cream), simple and readable at small size, centered. ${TRANSPARENT}. ${STYLE.noText}.`,
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
    ["saju", "a glowing yin-yang orb above four stacked rounded clay pillar blocks"],
    ["unse", "a single shooting star with a sparkling trail curving over a soft crescent moon"],
    ["gunghap", "two rounded clay hearts gently linked by one delicate red string"],
    ["couple", "a cute couple of two rounded clay figures standing close under a floating heart"],
    ["health", "a rounded shield with a glowing heartbeat pulse line and a small healing leaf"],
    ["admission", "a graduation cap with a sprouting pencil and a rising arrow"],
    ["strategy", "a chess knight piece beside a small target and a compass"],
    ["family", "a cozy rounded house with a small parent-and-child figure group in front"],
    ["child", "a smiling baby star with a tiny pacifier and a small crescent moon"],
  ].map(([name, subject]) => ({
    group: "menu",
    file: `menu/${name}.png`,
    transparent: true,
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

/** 테두리 링에서 배경색(크로마키 녹색)의 중앙값을 추정. Gemini 가 칠한 녹색 톤은
 *  순수 RGB(0,177,64) 가 아니라 톤이 제각각이라, 고정값 대신 실제 색을 샘플링한다. */
function sampleBackground(data, width, height, border = 4) {
  const rs = [], gs = [], bs = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < border || x >= width - border || y < border || y >= height - border) {
        const i = (y * width + x) * 4;
        rs.push(data[i]); gs.push(data[i + 1]); bs.push(data[i + 2]);
      }
    }
  }
  const med = (a) => { a.sort((p, q) => p - q); return a[a.length >> 1]; };
  return [med(rs), med(gs), med(bs)];
}

/** 면적이 minAreaFrac 미만인 작은 불투명 덩어리(예: 환각으로 그려진 텍스트)를 제거.
 *  실제 아이콘 요소(통통한 3D 클레이 형태)는 충분히 커서 보존된다. */
function removeSpeckles(out, width, height, minAreaFrac = 0.003) {
  const N = width * height;
  const minArea = Math.floor(N * minAreaFrac);
  const solid = (p) => out.data[p * 4 + 3] >= 128;
  const seen = new Uint8Array(N);
  const stack = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (seen[s] || !solid(s)) continue;
    let sp = 0, count = 0;
    stack[sp++] = s; seen[s] = 1;
    const comp = [];
    while (sp) {
      const p = stack[--sp];
      comp.push(p); count++;
      const x = p % width, y = (p / width) | 0;
      const nb = [];
      if (x > 0) nb.push(p - 1);
      if (x < width - 1) nb.push(p + 1);
      if (y > 0) nb.push(p - width);
      if (y < height - 1) nb.push(p + width);
      for (const q of nb) if (!seen[q] && solid(q)) { seen[q] = 1; stack[sp++] = q; }
    }
    if (count < minArea) for (const p of comp) out.data[p * 4 + 3] = 0; // 잡티 제거
  }
}

/**
 * 단색 크로마키(녹색) 배경을 알파(투명)로 변환한다.
 * - 배경색을 테두리에서 자동 샘플링한 뒤, 각 픽셀의 RGB 거리로 키잉.
 * - lowD 이하는 투명, highD 이상은 불투명, 사이는 선형 알파(가장자리 페더링).
 * - 부분 투명 픽셀은 디스필(녹색 성분을 R/B 수준으로 낮춤)로 녹색 테두리를 제거.
 * - 마지막으로 작은 잡티(환각 텍스트 등) 제거.
 */
function chromaKeyToAlpha(pngBuffer, { lowD = 72, highD = 110 } = {}) {
  const img = PNG.sync.read(pngBuffer);
  const { data, width, height } = img;
  const bg = sampleBackground(data, width, height);
  const out = new PNG({ width, height });
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2];
    const dr = r - bg[0], dg = g - bg[1], db = b - bg[2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    let alpha;
    if (dist <= lowD) alpha = 0;
    else if (dist >= highD) alpha = 255;
    else alpha = Math.round(((dist - lowD) / (highD - lowD)) * 255);
    if (alpha < 255 && g > Math.max(r, b)) g = Math.max(r, b); // 디스필
    out.data[i] = r; out.data[i + 1] = g; out.data[i + 2] = b; out.data[i + 3] = alpha;
  }
  removeSpeckles(out, width, height);
  return PNG.sync.write(out);
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
  // 인자: 그룹명(hero|events|menu) 또는 파일 경로(menu/gunghap.png, menu/gunghap)
  const filter = process.argv[2];
  const norm = (s) => s.replace(/\.png$/, "");
  const targets = filter
    ? ASSETS.filter((a) => a.group === filter || norm(a.file) === norm(filter))
    : ASSETS;
  if (!targets.length) {
    console.error(`[gen-assets] "${filter}" 에 해당하는 에셋이 없습니다. (그룹: hero|events|menu, 또는 파일경로)`);
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
      let png = await generateImage(asset.prompt);
      if (asset.transparent) png = chromaKeyToAlpha(png); // 크로마키 → 투명 알파
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, png);
      console.log(`[ok]   ${asset.file} (${(png.length / 1024).toFixed(0)} KB${asset.transparent ? ", 투명" : ""})`);
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
