import { notFound } from "next/navigation";
import { ManualCard } from "@/components/ManualCard";
import { sampleManual } from "@/lib/manual/sampleManual";
import ReportNav from "@/components/ReportNav";

/**
 * 취급설명서 페이지 — 공유 밈 카드.
 * 데모 단계에서는 샘플 설명서만 제공. 실제로는 store 에서 buildUserManual 결과를 조회.
 */
async function getManual(id: string) {
  if (id === sampleManual.id) return sampleManual;
  return null;
}

export default async function ManualPage({ params }: { params: { id: string } }) {
  const manual = await getManual(params.id);
  if (!manual) notFound();

  return (
    <main className="min-h-screen">
      <ReportNav title="취급설명서" />
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full">
          <ManualCard manual={manual} />
          <p className="no-print mx-auto mt-5 max-w-md text-center text-xs text-ivory/40">
            캡처해서 친구·연인에게 보내보세요 📩
          </p>
        </div>
      </div>
    </main>
  );
}
