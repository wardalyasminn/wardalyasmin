"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  category_id?: string | null;
  is_new?: boolean;
  is_featured?: boolean;
  is_available?: boolean;
};

type Category = {
  id: string;
  name: string;
};

export default function ProductsGrid({
  products,
  categories,
  initialCategory,
  fallbackImage,
}: {
  products: Product[];
  categories: Category[];
  initialCategory: string;
  fallbackImage: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const img = (url?: string | null) => (url && url !== "" ? url : fallbackImage);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  return (
    <div>
      {/* تبويبات الأقسام */}
      <div className="flex items-center gap-2 flex-wrap mb-10 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
            activeCategory === "all"
              ? "bg-[#E8638A] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-[#E8638A] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* شبكة المنتجات */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          لا توجد منتجات ضمن هذا القسم حالياً
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {filtered.map((item) => (
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
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {item.is_new && (
                    <span className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                      ✨ جديد
                    </span>
                  )}
                  {item.is_featured && !item.is_new && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                      🔥 الأكثر مبيعاً
                    </span>
                  )}
                  {item.discount_price && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                      خصم
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 text-right">
                <h3 className="font-bold text-gray-800 mb-2 truncate text-sm">
                  {item.name}
                </h3>
                {item.discount_price ? (
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-[#d4637d] font-black text-base">
                      {item.discount_price} ر.س
                    </span>
                    <span className="text-gray-300 line-through text-xs font-medium">
                      {item.price} ر.س
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-800 font-black text-base">
                    {item.price} ر.س
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
