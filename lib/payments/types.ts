// lib/payments/types.ts
//
// هذا الملف هو "العقد" (Contract) الموحّد. أي بوابة دفع جديدة تُضاف مستقبلاً
// (Tap, HyperPay, Geidea...) لازم تطبّق interface الـ PaymentProvider بالكامل.
// بقية المشروع (الـ API routes، الـ Payment Service) يتعامل فقط مع هذا العقد
// ولا يعرف أي تفاصيل خاصة ببوابة معينة — هذا هو مبدأ الـ Abstraction.

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export interface CreatePaymentInput {
  /** المبلغ بالريال السعودي (وحدات كاملة، مثال: 150.50) */
  amount: number;
  currency?: string; // افتراضي SAR
  description?: string;
  /** رقم الطلب بجدول orders الحالي — للربط فقط، بدون أي تعديل على جدول orders نفسه */
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  /** الرابط اللي ترجع له البوابة بعد إتمام الدفع */
  callbackUrl?: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentResult {
  success: boolean;
  providerPaymentId?: string;
  /** رابط صفحة الدفع المستضافة (Hosted Checkout) اللي يُحوَّل له العميل */
  redirectUrl?: string;
  rawResponse?: unknown;
  error?: string;
}

export interface PaymentStatusResult {
  success: boolean;
  status: PaymentStatus;
  providerPaymentId?: string;
  rawResponse?: unknown;
  error?: string;
}

export interface RefundInput {
  providerPaymentId: string;
  /** اتركه فارغًا لاسترجاع كامل المبلغ */
  amount?: number;
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  rawResponse?: unknown;
  error?: string;
}

export interface WebhookVerificationInput {
  rawBody: string;
  headers: Record<string, string | undefined>;
}

export interface WebhookEvent {
  type: "payment.paid" | "payment.failed" | "payment.refunded" | "payment.cancelled" | "unknown";
  providerPaymentId: string;
  status: PaymentStatus;
  rawPayload: unknown;
}

/**
 * العقد الموحّد لأي بوابة دفع.
 * أي Provider جديد لازم يطبّق كل دالة هنا، بدون استثناء.
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  getPaymentStatus(providerPaymentId: string): Promise<PaymentStatusResult>;
  refundPayment(input: RefundInput): Promise<RefundResult>;
  cancelPayment(providerPaymentId: string): Promise<{ success: boolean; error?: string }>;
  verifyWebhookSignature(input: WebhookVerificationInput): boolean;
  parseWebhookEvent(rawPayload: unknown): WebhookEvent;
}
