"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 첫 방문자를 온보딩으로 보낸다.
 * localStorage 플래그(mw_onboarded)가 없으면 /onboarding 으로 1회 이동.
 */
export default function OnboardingGate() {
  const router = useRouter();
  useEffect(() => {
    try {
      if (!localStorage.getItem("mw_onboarded")) router.replace("/onboarding");
    } catch {}
  }, [router]);
  return null;
}
