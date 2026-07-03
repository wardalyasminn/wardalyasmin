import { createSupabaseServerClient } from "./supabase-server";
import { PaymentMethod } from "./types";

/**
 * جلب إعدادات المتجر للعرض بالموقع العام (الهيدر، الفوتر، إلخ)
 * يحول صفوف key/value لـ object سهل الاستخدام: settings.working_hours
 */
export async function getPublicSettings(): Promise<Record<string, string>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("settings").select("*");

  if (error) {
    console.error("خطأ بجلب الإعدادات العامة", error);
    return {};
  }

  const result: Record<string, string> = {};
  (data || []).forEach((row: any) => {
    if (row.key) result[row.key] = row.value;
  });

  return result;
}

/**
 * جلب طرق الدفع المفعّلة فقط للعرض بالفوتر بالموقع العام
 */
export async function getPublicPaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("خطأ بجلب طرق الدفع العامة", error);
    return [];
  }

  return data || [];
}
