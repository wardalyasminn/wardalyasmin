import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById, getRelatedProducts } from "@/lib/supabase-server";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

const FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function safeParseImages(json: string | undefined, fallbackImage: string | undefined): string[] {
  const list: string[] = [];
  if (json) {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        parsed.forEach((url) => {
          if (typeof url === "string" && url.trim() !== "") list.push(url);
        });
      }
    } catch {
      // تجاهل أي خطأ بالتحويل
    }
  }
  if (list.length === 0 && fallbackImage) {
    list.push(fallbackImage);
  }
  return list;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product || product.is_available === false) {
    notFound();
  }

  const images = safeParseImages(product.images_json, product.image_url);
  const relatedProducts = await getRelatedProducts(product.category_id, product.id);
  const img = (url: string | undefined) => (url && url !== "" ? url : FALLBACK);

  return (
    <main dir="rtl" className="w-full bg-white pb-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#d4637d]">الرئيسية</Link>
          <span>/</span>
          {product.category_id ? (
            <Link href={`/category/${product.category_id}`} className="hover:text-[#d4637d]">
              {product.category?.name || "التصنيف"}
            </Link>
          ) : (
            <span>المنتجات</span>
          )}
          <span>/</span>
          <span className="text-gray-600 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* معرض الصور */}
          <ProductGallery images={images} name={product.name} />

          {/* تفاصيل المنتج */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              {product.is_new && (
                <span className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full">✨ جديد</span>
              )}
              {product.is_featured && !product.is_new && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full">🔥 الأكثر مبيعاً</span>
              )}
              {product.discount_price && (
                <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">خصم</span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 flex-row-reverse justify-end mb-6">
              {product.discount_price ? (
                <>
                  <span className="text-[#d4637d] font-black text-3xl">{product.discount_price} ر.س</span>
                  <span className="text-gray-300 line-through text-lg font-medium">{product.price} ر.س</span>
                </>
              ) : (
                <span className="text-gray-800 font-black text-3xl">{product.price} ر.س</span>
              )}
            </div>

            {product.description && (
              <p className="text-gray-500 leading-8 mb-8 whitespace-pre-line">{product.description}</p>
            )}

            <div className="mt-auto">
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.discount_price || product.price}
                image_url={product.image_url}
              />
              <p className="text-xs text-gray-400 text-center mt-4">
                🚛 التوصيل متاح — التفاصيل تظهر عند إتمام الطلب
              </p>
            </div>
          </div>
        </div>

        {/* منتجات مشابهة */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-black text-gray-800 mb-10">منتجات قد تعجبك</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-xl transition-all"
                >
                  <div className="h-56 relative overflow-hidden">
                    <Image
                      src={img(item.image_url)}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 text-right">
                    <h3 className="font-bold text-gray-800 mb-2 truncate text-sm">{item.name}</h3>
                    <span className="text-gray-800 font-black text-base">
                      {item.discount_price || item.price} ر.س
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
