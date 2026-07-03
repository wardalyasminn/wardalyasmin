import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCategoryById, getProductsByCategory } from "@/lib/supabase-server";
import AddToCartButton from "@/components/AddToCartButton";

const FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  const allProducts = await getProductsByCategory(id);
  const products = allProducts.filter((p) => p.is_available !== false);
  const img = (url: string | undefined) => (url && url !== "" ? url : FALLBACK);

  return (
    <main dir="rtl" className="w-full bg-white pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#d4637d]">الرئيسية</Link>
          <span>/</span>
          <span className="text-gray-600">{category.name}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-10">{category.name}</h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-3xl mb-4">🌸</p>
            <p className="text-gray-400 mb-8">ما فيه منتجات بهذا التصنيف حالياً</p>
            <Link
              href="/"
              className="bg-[#d4637d] text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-[#b84d65] transition-all"
            >
              تصفح كل المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-xl transition-all"
              >
                <Link href={`/product/${item.id}`} className="block h-64 relative overflow-hidden">
                  <Image
                    src={img(item.image_url)}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {item.discount_price && (
                    <div className="absolute top-5 right-5 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">خصم</div>
                  )}
                  {item.is_new && (
                    <div className="absolute top-5 left-5 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full">✨ جديد</div>
                  )}
                  {item.is_featured && !item.is_new && (
                    <div className="absolute top-5 left-5 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full">🔥 الأكثر مبيعاً</div>
                  )}
                </Link>
                <div className="p-6 text-right">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-bold text-gray-800 mb-3 truncate text-lg">{item.name}</h3>
                  </Link>
                  <div className="flex items-center justify-start gap-3 flex-row-reverse mb-6">
                    {item.discount_price ? (
                      <>
                        <span className="text-[#d4637d] font-black text-xl">{item.discount_price} ر.س</span>
                        <span className="text-gray-300 line-through text-xs font-medium">{item.price} ر.س</span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-black text-xl">{item.price} ر.س</span>
                    )}
                  </div>
                  <AddToCartButton
                    id={item.id}
                    name={item.name}
                    price={item.discount_price || item.price}
                    image_url={item.image_url}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
