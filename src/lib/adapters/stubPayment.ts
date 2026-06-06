/**
 * 스텁 PaymentGateway 어댑터.
 *
 * 결제 흐름의 자리만 잡아둔다 — createCheckout 즉시 'paid' 로 승인한다.
 * 운영에서는 Stripe/토스 등으로 교체(웹훅으로 verifyPaid 구현).
 */
import { nanoid } from "nanoid";
import type { Checkout, PaymentGateway } from "@/lib/ports";

export function createStubPayment(): PaymentGateway {
  const checkouts = new Map<string, Checkout>();
  return {
    async createCheckout({ amount, currency }) {
      const checkout: Checkout = {
        id: `chk_${nanoid(8)}`,
        status: "paid", // 데모: 즉시 결제 완료 처리
        amount,
        currency,
      };
      checkouts.set(checkout.id, checkout);
      return checkout;
    },
    async verifyPaid(checkoutId) {
      return checkouts.get(checkoutId)?.status === "paid";
    },
  };
}
