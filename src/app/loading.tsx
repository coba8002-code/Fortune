/** 전역 로딩 — 솥을 젓는 마녀 포즈 */
export default function Loading() {
  return (
    <div className="app-stage">
      <main className="app flex flex-col items-center justify-center px-8 text-center" style={{ paddingBottom: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/char-loading.png" alt="마법을 부리는 마녀" className="app-float h-56 w-56 object-contain" />
        <p className="mt-2 app-serif text-lg font-bold text-witch-ink">마녀가 마법을 부리는 중...</p>
        <p className="mt-1 text-sm text-witch-muted">잠시만 기다려줘 🪄</p>
      </main>
    </div>
  );
}
