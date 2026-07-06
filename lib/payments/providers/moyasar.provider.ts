// lib/payments/providers/moyasar.provider.ts
//
// تطبيق كامل لبوابة Moyasar وفق عقد PaymentProvider الموحّد.
// يستخدم Moyasar Hosted Invoices API (يدعم مدى + فيزا/ماستركارد + Apple Pay
// تلقائيًا بصفحة دفع مستضافة، بدون أي حاجة لتخزين بيانات بطاقات بموقعنا).
//
// المفاتيح تُقرأ حصرًا من Environment Variables:
//   MOYASAR_SECRET_KEY
//   MOYASAR_WEBHOOK_SECRET

import type {
    PaymentProvider,
    CreatePaymentInput,
    CreatePaymentResult,
    PaymentStatusResult,
    RefundInput,
    RefundResult,
    WebhookVerificationInput,
    WebhookEvent,
    PaymentStatus,
  } from "../types";
  
  const MOYASAR_API_BASE = "https://api.moyasar.com/v1";
  
  function mapMoyasarStatus(status: string | undefined): PaymentStatus {
    switch (status) {
      case "paid":
        return "paid";
      case "failed":
        return "failed";
      case "refunded":
        return "refunded";
      case "voided":
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  }
  
  export class MoyasarProvider implements PaymentProvider {
    readonly name = "moyasar";
    private secretKey: string;
    private webhookSecret: string;
  
    constructor() {
      this.secretKey = process.env.MOYASAR_SECRET_KEY || "";
      this.webhookSecret = process.env.MOYASAR_WEBHOOK_SECRET || "";
  
      if (!this.secretKey) {
        console.warn(
          "[MoyasarProvider] تحذير: MOYASAR_SECRET_KEY غير معرّف بمتغيرات البيئة. عمليات الدفع ستفشل حتى تتم إضافته."
        );
      }
    }
  
    private authHeader(): string {
      const token = Buffer.from(`${this.secretKey}:`).toString("base64");
      return `Basic ${token}`;
    }
  
    async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
      try {
        const res = await fetch(`${MOYASAR_API_BASE}/invoices`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.authHeader(),
          },
          body: JSON.stringify({
            amount: Math.round(input.amount * 100), // Moyasar تتوقع المبلغ بالهللات
            currency: input.currency || "SAR",
            description: input.description || `طلب رقم ${input.orderId}`,
            success_url: input.callbackUrl,
            back_url: input.callbackUrl,
            metadata: { order_id: input.orderId, ...(input.metadata || {}) },
          }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          return {
            success: false,
            error: data?.message || "فشل إنشاء عملية الدفع عبر Moyasar",
            rawResponse: data,
          };
        }
  
        return {
          success: true,
          providerPaymentId: data.id,
          redirectUrl: data.url,
          rawResponse: data,
        };
      } catch (err: any) {
        return { success: false, error: err?.message || "خطأ غير متوقع أثناء الاتصال ببوابة الدفع" };
      }
    }
  
    async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatusResult> {
      try {
        const res = await fetch(`${MOYASAR_API_BASE}/invoices/${providerPaymentId}`, {
          headers: { Authorization: this.authHeader() },
        });
        const data = await res.json();
  
        if (!res.ok) {
          return { success: false, status: "pending", error: data?.message, rawResponse: data };
        }
  
        return {
          success: true,
          status: mapMoyasarStatus(data.status),
          providerPaymentId,
          rawResponse: data,
        };
      } catch (err: any) {
        return { success: false, status: "pending", error: err?.message };
      }
    }
  
    async refundPayment(input: RefundInput): Promise<RefundResult> {
      try {
        const res = await fetch(`${MOYASAR_API_BASE}/payments/${input.providerPaymentId}/refund`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.authHeader(),
          },
          body: JSON.stringify(input.amount ? { amount: Math.round(input.amount * 100) } : {}),
        });
        const data = await res.json();
  
        if (!res.ok) {
          return { success: false, error: data?.message, rawResponse: data };
        }
  
        return { success: true, refundId: data.id, rawResponse: data };
      } catch (err: any) {
        return { success: false, error: err?.message };
      }
    }
  
    async cancelPayment(providerPaymentId: string): Promise<{ success: boolean; error?: string }> {
      try {
        const res = await fetch(`${MOYASAR_API_BASE}/payments/${providerPaymentId}/void`, {
          method: "POST",
          headers: { Authorization: this.authHeader() },
        });
  
        if (!res.ok) {
          const data = await res.json();
          return { success: false, error: data?.message };
        }
  
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message };
      }
    }
  
    verifyWebhookSignature(input: WebhookVerificationInput): boolean {
      // Moyasar ترسل سر التحقق ضمن هيدر مخصص يُضبط عند إعداد الـ webhook بلوحة تحكمهم
      const receivedSecret = input.headers["x-moyasar-secret"] || input.headers["authorization"];
  
      if (!this.webhookSecret) {
        console.warn("[MoyasarProvider] MOYASAR_WEBHOOK_SECRET غير معرّف — يُفضّل ضبطه دائمًا بالإنتاج");
        return true;
      }
  
      return receivedSecret === this.webhookSecret;
    }
  
    parseWebhookEvent(rawPayload: any): WebhookEvent {
      const providerStatus = rawPayload?.data?.status || rawPayload?.status;
      const status = mapMoyasarStatus(providerStatus);
      const id = rawPayload?.data?.id || rawPayload?.id;
  
      let type: WebhookEvent["type"] = "unknown";
      if (status === "paid") type = "payment.paid";
      else if (status === "failed") type = "payment.failed";
      else if (status === "refunded") type = "payment.refunded";
      else if (status === "cancelled") type = "payment.cancelled";
  
      return { type, providerPaymentId: id, status, rawPayload };
    }
  }
  