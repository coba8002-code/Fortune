/**
 * 취급설명서 조회 — id 별로 매핑(데모). 실제로는 buildUserManual + LLM 결과를 저장/조회.
 */
import type { UserManual } from "@/types/manual";
import { sampleManual } from "./sampleManual";

// 샘플 리포트(전략가/기토 아닌 신금 일간, 1991)용 설명서
const sampleReportManual: UserManual = {
  id: "SAMPLE",
  subjectName: "김운명",
  rank: "SR",
  modelName: "전략가형(辛土)",
  releaseInfo: "1991년형 · 주성분 토·금",
  mainElement: "토",
  warning:
    "혼자 다 짊어지는 책임감 과부하 주의 — 짐을 나눠 줄 때 더 멀리 갑니다.",
  items: [
    {
      icon: "",
      label: "전원 켜는 법",
      text: "신뢰가 쌓이기 전엔 속을 잘 보이지 않습니다. 일관된 태도를 꾸준히 보일 때 마음이 열립니다.",
    },
    {
      icon: "",
      label: "충전 방법",
      text: "사람을 모으고 판을 짜는 데서 에너지를 얻되, 과부하 전 혼자만의 정리 시간이 필요합니다.",
    },
    {
      icon: "",
      label: "과열 주의",
      text: "정리되지 않은 즉흥·감정적 변덕에 약합니다. 맥락 없이 몰아붙이면 닫힙니다.",
    },
    {
      icon: "",
      label: "올바른 사용법",
      text: "방향만 정해 주고 설계는 맡기세요. 신뢰를 보여 주면 끝까지 책임집니다.",
    },
    {
      icon: "",
      label: "A/S",
      text: "감정보다 논리로 매듭짓는 편. 무엇이 어긋났는지 차분히 짚어 주면 빠르게 회복됩니다.",
    },
    {
      icon: "",
      label: "숨은 기능",
      text: "사람들을 자연스럽게 모으는 구심력. 위기일수록 중심을 잡아 주는 안정 장치입니다.",
    },
  ],
};

const MANUALS: Record<string, UserManual> = {
  [sampleManual.id]: sampleManual,
  [sampleReportManual.id]: sampleReportManual,
};

export async function getManual(id: string): Promise<UserManual | null> {
  return MANUALS[id] ?? null;
}
