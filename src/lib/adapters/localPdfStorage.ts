/**
 * 로컬 파일시스템 PdfStorage 어댑터.
 *
 * ./tmp/{id}.pdf 에 저장. 데모/개발용. 운영에서는 S3 등 객체 스토리지 어댑터로 교체.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { PdfStorage } from "@/lib/ports";

export function createLocalPdfStorage(baseDir = path.resolve(process.cwd(), "tmp")): PdfStorage {
  const filePath = (id: string) => path.join(baseDir, `${id}.pdf`);

  return {
    async put(id, bytes) {
      await mkdir(baseDir, { recursive: true });
      const p = filePath(id);
      await writeFile(p, bytes);
      // 로컬에서는 파일 경로를 URL 대용으로 반환(운영에선 공개 객체 URL).
      return { url: `file://${p}`, bytes: bytes.length };
    },
    async getUrl(id) {
      const p = filePath(id);
      return existsSync(p) ? `file://${p}` : null;
    },
  };
}
