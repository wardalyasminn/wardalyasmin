import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Product, Category } from "./types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("*");
  return data || [];
}

export async function getSettings(): Promise<any> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("settings").select("key, value");
  const settings: any = {};
  data?.forEach(s => settings[s.key] = s.value);
  return settings;
}

/** ---------- الدوال الجديدة (لصفحتي المنتج والتصنيف) ---------- **/

// جلب منتج واحد عن طريق الـ id — يُستخدم بصفحة /product/[id]
// معدّلة: تجيب بيانات التصنيف المرتبط (category) عبر join مباشر
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Product;
}

// جلب تصنيف واحد عن طريق الـ id — يُستخدم بصفحة /category/[id]
export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as Category;
}

// جلب كل منتجات تصنيف معيّن (النشطة فقط) — يُستخدم بصفحة /category/[id]
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false });
  return data || [];
}

// جلب منتجات مشابهة (نفس التصنيف، باستثناء المنتج الحالي) — تُستخدم بصفحة /product/[id]
export async function getRelatedProducts(categoryId: string | undefined, excludeId: string): Promise<Product[]> {
  if (!categoryId) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(4);
  return data || [];
}
