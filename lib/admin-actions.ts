"use server";
import { createSupabaseServerClient } from "./supabase-server";
import { supabaseAdmin } from "./supabase";
import { revalidatePath } from "next/cache";

/** 1. جلب البيانات للأدمن (Getters) **/
export async function getProductsAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getCategoriesAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function getSettingsAdmin(): Promise<Record<string, string>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("settings").select("*");
  if (error) throw error;
  const result: Record<string, string> = {};
  (data || []).forEach((row: any) => {
    if (row.key) result[row.key] = row.value ?? '';
  });
  return result;
}

export async function getPaymentMethodsAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("payment_methods").select("*");
  if (error) throw error;
  return data || [];
}

/** 2. رفع الصور من المعرض (Storage) **/
export async function uploadImage(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const file = formData.get('file') as File;
  if (!file) throw new Error("لم يتم اختيار ملف");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    avif: "image/avif",
  };
  const resolvedContentType =
    (file.type && file.type !== "" ? file.type : mimeMap[(fileExt || "").toLowerCase()]) ||
    "application/octet-stream";

  const { data, error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      contentType: resolvedContentType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

/** 3. إدارة الإعدادات والمحتوى **/
export async function updateSettingsBulk(
  settings: { key: string; value: string }[] | Record<string, any>
) {
  const supabase = await createSupabaseServerClient();

  let settingsArray: { key: string; value: string }[];

  if (Array.isArray(settings)) {
    settingsArray = settings;
  } else {
    settingsArray = Object.entries(settings).map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    }));
  }

  const { error } = await supabase
    .from("settings")
    .upsert(settingsArray, { onConflict: "key" });

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveSetting(key: string, value: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("settings").upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
  revalidatePath("/");
}

/** 4. إدارة المنتجات **/
export async function saveProduct(product: any) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("products").upsert(product).select();
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update({ is_available: !currentStatus }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

/** 5. إدارة التصنيفات **/
export async function saveCategory(category: any) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("categories").upsert(category).select();
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
  return data;
}

export async function deleteCategory(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

/** 6. إدارة طرق الدفع **/
export async function createPaymentMethod(method: any) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("payment_methods").insert(method).select();
  if (error) throw error;
  revalidatePath("/admin");
  return data;
}

export async function updatePaymentMethod(id: string, method: any) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("payment_methods").update(method).eq("id", id).select();
  if (error) throw error;
  revalidatePath("/admin");
  return data;
}

export async function deletePaymentMethod(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("payment_methods").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}

/** 7. حفظ الطلبات من صفحة الـ checkout العامة **/
// ملاحظة: نستخدم supabaseAdmin (service role) هنا تحديدًا لأن هذي الدالة تُستدعى
// من الموقع العام بدون جلسة أدمن، فلازم تتجاوز أي قيود RLS.
export async function createOrder(
  order: {
    customer_name: string;
    customer_phone: string;
    delivery_type: string;
    address?: string | null;
    location_url?: string | null;
    total: number;
    delivery_fee: number;
    notes?: string | null;
  },
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[]
) {
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      delivery_type: order.delivery_type,
      address: order.address || null,
      location_url: order.location_url || null,
      total: order.total,
      delivery_fee: order.delivery_fee,
      status: "pending",
      notes: order.notes || null,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  if (items.length > 0) {
    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;
  }

  revalidatePath("/admin");
  return orderData;
}

/** 8. إدارة الطلبات من لوحة الأدمن **/
export async function getOrdersAdmin() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}

/** 9. إحصائيات لوحة التحكم **/
export async function getDashboardStats() {
  const [
    { count: ordersCount, error: ordersError },
    { count: visitsCount, error: visitsError },
    { data: orderItemsData, error: itemsError },
  ] = await Promise.all([
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("site_visits").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("order_items").select("product_id, product_name, quantity"),
  ]);

  if (ordersError) throw ordersError;
  if (visitsError) throw visitsError;
  if (itemsError) throw itemsError;

  let topProduct: { name: string; totalQuantity: number } | null = null;

  if (orderItemsData && orderItemsData.length > 0) {
    const tally: Record<string, { name: string; totalQuantity: number }> = {};

    orderItemsData.forEach((row: any) => {
      const key = row.product_id || row.product_name;
      if (!key) return;
      if (!tally[key]) {
        tally[key] = { name: row.product_name || "غير معروف", totalQuantity: 0 };
      }
      tally[key].totalQuantity += row.quantity || 0;
    });

    const sorted = Object.values(tally).sort((a, b) => b.totalQuantity - a.totalQuantity);
    if (sorted.length > 0) topProduct = sorted[0];
  }

  return {
    ordersCount: ordersCount || 0,
    visitsCount: visitsCount || 0,
    topProduct,
  };
}

// يصفّر عداد الزيارات بالكامل (يحذف كل السجلات من جدول site_visits)
// مفيد بعد تفعيل فلترة البوتات/أدوات المراقبة عشان نبدأ العد من جديد بأرقام دقيقة
export async function resetVisitsCount() {
  const { error } = await supabaseAdmin
    .from("site_visits")
    .delete()
    .gte("created_at", "1900-01-01");
  if (error) throw error;
  revalidatePath("/admin");
}
