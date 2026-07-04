import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/supabase-server";
import ProductsGrid from "@/components/ProductsGrid";

const FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = allProducts.filter((p: any) => p.is_available !== false);

  return (
    <main dir="rtl" className="w-full bg-white pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#d4637d]">الرئيسية</Link>
          <span>/</span>
          <span className="text-gray-600">كل المنتجات</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-8">
          كل المنتجات
        </h1>

        <ProductsGrid
          products={products}
          categories={categories}
          initialCategory={category || "all"}
          fallbackImage={FALLBACK}
        />
      </div>
    </main>
  );
}
