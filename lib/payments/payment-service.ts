// lib/payments/payment-service.ts
//
// هذي الطبقة (Payment Service) هي الواجهة الوحيدة اللي أي جزء بالموقع
// يتعامل معها لو احتاج ميزة دفع إلكتروني. لا أحد خارج مجلد lib/payments
// يستورد Provider معيّن مباشرة أو يعرف تفاصيل أي بوابة.
//
// ملاحظة مهمة: هذا الملف مستقل تمامًا عن lib/admin-actions.ts وعن جدول
// orders الحالي — يستخدم جدول "payments" الجديد فقط (إضافي بالكامل).
// أي خطأ هنا لا يوقف أو يكسر تدفق الطلب عبر الواتساب/التحويل البنكي،
// لأن هذي الدوال لا تُستدعى إطلاقاً إلا لو الدفع الإلكتروني مفعّل صراحة.

import { createClient } from "@supabase/supabase-js";
import { getPaymentConfig } from "./config";
import { createPaymentProvider } from "./provider-factory";
import type { CreatePaymentInput } from "./types";

// عميل Supabase مستقل (service role) خاص بوحدة الدفع فقط،
// لتفادي أي ترابط مع lib/supabase.ts الحالي أو أي كود تشغيلي آخر بالموقع
function getPaymentsSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** هل الدفع الإلكتروني مفعّل حاليًا؟ تُستخدم من الواجهة لإظهار/إخفاء خيار الدفع فقط */
export function isOnlinePaymentEnabled(): boolean {
  const config = getPaymentConfig();
  return config.enabled && config.providerName !== "none";
}

/** إنشاء عملية دفع جديدة (لا تُستدعى إلا لو العميل اختار "الدفع الإلكتروني" صراحة) */
export async function startOnlinePayment(input: CreatePaymentInput) {
  const config = getPaymentConfig();

  if (!config.enabled || config.providerName === "none") {
    return { success: false, error: "الدفع الإلكتروني غير مفعّل حاليًا" };
  }

  const provider = createPaymentProvider(config.providerName);
  if (!provider) {
    return { success: false, error: "بوابة الدفع المضبوطة غير مدعومة" };
  }

  const result = await provider.createPayment(input);

  try {
    const supabase = getPaymentsSupabaseClient();
    await supabase.from("payments").insert({
      order_id: input.orderId,
      provider: provider.name,
      provider_payment_id: result.providerPaymentId || null,
      amount: input.amount,
      currency: input.currency || "SAR",
      status: result.success ? "pending" : "failed",
      raw_response: result.rawResponse || null,
    });
  } catch (dbErr) {
    // خطأ بتسجيل المحاولة بجدول payments لا يجب أن يمنع رجوع نتيجة الدفع للعميل
    console.error("[payment-service] فشل تسجيل محاولة الدفع بقاعدة البيانات:", dbErr);
  }

  return result;
}

/** جلب آخر حالة دفع مسجّلة لطلب معيّن */
export async function getOnlinePaymentStatus(orderId: string) {
  try {
    const supabase = getPaymentsSupabaseClient();
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data;
  } catch (err) {
    console.error("[payment-service] فشل جلب حالة الدفع:", err);
    return null;
  }
}

/** تُستدعى حصرًا من app/api/payments/webhook/route.ts */
export async function handlePaymentWebhook(
  rawBody: string,
  headers: Record<string, string | undefined>
) {
  const config = getPaymentConfig();

  if (!config.enabled || config.providerName === "none") {
    return { success: false, error: "الدفع الإلكتروني غير مفعّل" };
  }

  const provider = createPaymentProvider(config.providerName);
  if (!provider) {
    return { success: false, error: "بوابة الدفع غير مدعومة" };
  }

  const isValid = provider.verifyWebhookSignature({ rawBody, headers });
  if (!isValid) {
    return { success: false, error: "توقيع الـ webhook غير صالح" };
  }

  const payload = JSON.parse(rawBody);
  const event = provider.parseWebhookEvent(payload);

  try {
    const supabase = getPaymentsSupabaseClient();
    await supabase
      .from("payments")
      .update({
        status: event.status,
        raw_response: event.rawPayload,
        updated_at: new Date().toISOString(),
      })
      .eq("provider_payment_id", event.providerPaymentId);
  } catch (dbErr) {
    console.error("[payment-service] فشل تحديث حالة الدفع من الـ webhook:", dbErr);
    return { success: false, error: "فشل تحديث قاعدة البيانات" };
  }

  return { success: true };
}
