import Link from "next/link";

/** 전역 404 — 빈 화면 포즈의 마녀 */
export default function NotFound() {
  return (
    <div className="app-stage">
      <main className="app flex flex-col items-center justify-center px-8 text-center" style={{ paddingBottom: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/char-empty.png" alt="길을 잃은 마녀" className="h-56 w-56 object-contain" />
        <h1 className="app-serif mt-2 text-2xl font-extrabold text-witch-ink">앗, 길을 잃었나 봐</h1>
        <p className="mt-3 leading-relaxed text-witch-ink/70">
          찾는 페이지가 사라졌어.
          <br />
          마녀가 다시 길을 안내해줄게.
        </p>
        <Link href="/" className="app-btn app-btn-primary mt-8 w-full max-w-xs">홈으로 가기</Link>
      </main>
    </div>
  );
}
