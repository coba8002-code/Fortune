import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "운명 리포트 — Fortune",
  description: "사주 × 심리로 읽는 나의 운명 프로파일",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
