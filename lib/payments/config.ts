// lib/payments/config.ts
//
// نقطة الإعداد الوحيدة لنظام الدفع بالكامل.
// كل شي هنا يُقرأ من Environment Variables فقط — ولا يوجد أي مفتاح
// أو بيانات حساسة مكتوبة بالكود. تغيير بوابة الدفع أو تعطيلها بالكامل
// يصير من إعدادات Render (Environment) بدون لمس أي كود أو ملف مشروع آخر.

export type PaymentProviderName = "moyasar" | "tap" | "hyperpay" | "geidea" | "none";

export interface PaymentConfig {
  /** هل الدفع الإلكتروني مفعّل بالموقع أصلاً؟ (PAYMENT_ENABLED=true/false) */
  enabled: boolean;
  /** اسم البوابة النشطة حاليًا (PAYMENT_PROVIDER=moyasar) */
  providerName: PaymentProviderName;
}

export function getPaymentConfig(): PaymentConfig {
  const enabled = process.env.PAYMENT_ENABLED === "true";
  const providerName = (process.env.PAYMENT_PROVIDER as PaymentProviderName) || "none";

  return { enabled, providerName };
}
