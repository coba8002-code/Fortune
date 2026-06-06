import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-black">
        나의 <span className="text-amber-400">운명</span> 프로파일
      </h1>
      <p className="max-w-md text-white/70">
        사주 × 심리로 읽는 캐릭터 카드와 30페이지 리포트. 웹으로 보고, PDF로 소장하세요.
      </p>
      <Link
        href="/report/SAMPLE"
        className="rounded-xl bg-amber-400 px-8 py-4 font-bold text-zinc-900 transition hover:bg-amber-300"
      >
        샘플 리포트 보기 →
      </Link>
      <p className="text-xs text-white/40">현재 데모: 샘플 데이터로 STEP 1~3 미리보기</p>
    </main>
  );
}
