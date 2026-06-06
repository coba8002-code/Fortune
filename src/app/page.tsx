import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <span className="label-caps">Saju × Psychology</span>
      <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight text-ivory">
        나의 운명
        <br />
        프로파일
      </h1>
      <div className="hairline my-8 w-24" />
      <p className="max-w-sm leading-relaxed text-ivory/55">
        사주와 심리로 읽어내는 한 사람의 결.
        <br />
        캐릭터 카드부터 취급설명서까지, 한 권의 리포트로.
      </p>
      <Link
        href="/report/SAMPLE"
        className="mt-10 border border-gold/40 px-10 py-4 font-display text-sm tracking-[0.2em] text-gold transition hover:bg-gold/10"
      >
        샘플 리포트 열람
      </Link>
    </main>
  );
}
