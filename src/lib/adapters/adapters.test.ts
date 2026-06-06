import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createMemoryReportStore } from "./memoryReportStore";
import { createFileReportStore } from "./fileReportStore";
import { createStubPayment } from "./stubPayment";
import { createInlineJobQueue } from "./inlineJobQueue";
import type { PdfStorage } from "@/lib/ports";
import { sampleReport } from "@/fixtures/sampleReport";

describe("memoryReportStore", () => {
  it("시드 조회 + 저장 + PDF 상태 갱신", async () => {
    const store = createMemoryReportStore([sampleReport]);
    expect((await store.get(sampleReport.id))?.id).toBe(sampleReport.id);
    expect(await store.get("nope")).toBeNull();

    const r = { ...sampleReport, id: "X1" };
    await store.save(r);
    await store.setPdf("X1", { status: "ready", url: "file://x.pdf", bytes: 10 });
    expect((await store.get("X1"))?.pdf?.status).toBe("ready");
  });
});

describe("fileReportStore", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "fortune-store-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("시드 보존 + 저장/조회 + PDF 상태가 재생성 인스턴스에서도 유지(영속)", async () => {
    const store = createFileReportStore(dir, [sampleReport]);
    await store.save({ ...sampleReport, id: "F1" });
    await store.setPdf("F1", { status: "ready", url: "file://f.pdf", bytes: 5 });

    // 새 인스턴스(=재시작 시뮬레이션)에서도 같은 디렉터리를 읽어 상태 유지
    const reopened = createFileReportStore(dir);
    expect((await reopened.get("F1"))?.pdf?.status).toBe("ready");
    expect((await reopened.get(sampleReport.id))?.id).toBe(sampleReport.id);
    expect(await reopened.get("missing")).toBeNull();
  });
});

describe("stubPayment", () => {
  it("createCheckout 는 즉시 paid, verifyPaid true", async () => {
    const pay = createStubPayment();
    const c = await pay.createCheckout({ amount: 9900, currency: "KRW" });
    expect(c.status).toBe("paid");
    expect(await pay.verifyPaid(c.id)).toBe(true);
    expect(await pay.verifyPaid("chk_unknown")).toBe(false);
  });
});

describe("inlineJobQueue", () => {
  const fakeStorage: PdfStorage = {
    async put(id, bytes) {
      return { url: `mem://${id}`, bytes: bytes.length };
    },
    async getUrl() {
      return null;
    },
  };

  it("render 미주입 시 상태만 pending", async () => {
    const store = createMemoryReportStore([{ ...sampleReport, id: "P1" }]);
    const q = createInlineJobQueue({ store, storage: fakeStorage });
    await q.enqueuePdf("P1");
    expect((await store.get("P1"))?.pdf?.status).toBe("pending");
  });

  it("render 주입 시 렌더 → 저장 → ready", async () => {
    const store = createMemoryReportStore([{ ...sampleReport, id: "P2" }]);
    const q = createInlineJobQueue({
      store,
      storage: fakeStorage,
      render: async () => Buffer.from("%PDF-fake"),
    });
    await q.enqueuePdf("P2");
    const pdf = (await store.get("P2"))?.pdf;
    expect(pdf?.status).toBe("ready");
    expect(pdf?.url).toBe("mem://P2");
    expect(pdf?.bytes).toBe(9);
  });

  it("render 실패 시 failed", async () => {
    const store = createMemoryReportStore([{ ...sampleReport, id: "P3" }]);
    const q = createInlineJobQueue({
      store,
      storage: fakeStorage,
      render: async () => {
        throw new Error("boom");
      },
    });
    await q.enqueuePdf("P3");
    expect((await store.get("P3"))?.pdf?.status).toBe("failed");
  });
});
