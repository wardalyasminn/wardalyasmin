"use client";

import Image from "next/image";
import Link from "next/link";
import { Category, Product, HeroSlide, PromoCard } from "@/lib/types";
import AddToCartButton from "@/components/AddToCartButton";
import HeroSlider from "@/components/HeroSlider";
import { useLanguage } from "@/contexts/LanguageContext";

const FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
    return fallback;
  } catch {
    return fallback;
  }
}

export default function HomeContent({
  products,
  categories,
  settings,
}: {
  products: Product[];
  categories: Category[];
  settings: Record<string, string>;
}) {
  const { t, language } = useLanguage();
  const img = (url: string | undefined) => (url && url !== "" ? url : FALLBACK);

  const defaultHeroSlides: HeroSlide[] = [
    { image_url: "", title: t("hero1_title"), subtitle: t("hero1_subtitle"), desc: t("hero1_desc") },
    { image_url: "", title: t("hero2_title"), subtitle: t("hero2_subtitle"), desc: t("hero2_desc") },
    { image_url: "", title: t("hero3_title"), subtitle: t("hero3_subtitle"), desc: t("hero3_desc") },
  ];

  const defaultPromoCards: PromoCard[] = [
    { image_url: "", title: t("promo1_title"), btn_text: t("promo1_btn"), btn_color: "#d4637d", category_id: "all" },
    { image_url: "", title: t("promo2_title"), btn_text: t("promo2_btn"), btn_color: "#d4637d", category_id: "all" },
    { image_url: "", title: t("promo3_title"), btn_text: t("promo3_btn"), btn_color: "#C8956C", category_id: "all" },
  ];

  const heroSlides = safeParse<HeroSlide[]>(settings.hero_slides_json, defaultHeroSlides);
  const promoCards = safeParse<PromoCard[]>(settings.promo_cards_json, defaultPromoCards);

  const catName = (cat: Category) => (language === "en" && cat.name_en ? cat.name_en : cat.name);
  const prodName = (p: Product) => (language === "en" && p.name_en ? p.name_en : p.name);

  return (
    <main className="w-full bg-white pb-32">
      <HeroSlider slides={heroSlides} />

      <div className="max-w-7xl mx-auto px-4">
        {/* التصنيفات */}
        <section className="py-16">
          <div className="flex gap-10 overflow-x-auto no-scrollbar justify-start md:justify-center py-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="flex-shrink-0 flex flex-col items-center gap-4 group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:border-[#d4637d] transition-all relative overflow-hidden">
                  <Image src={img((cat as any).image_url)} alt={catName(cat)} fill sizes="128px" className="object-cover p-2" />
                </div>
                <span className="text-sm font-bold text-gray-600 group-hover:text-[#d4637d]">{catName(cat)}</span>
              </Link>
            ))}
            <Link href="/products" className="flex-shrink-0 flex flex-col items-center gap-4 cursor-pointer">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <span className="text-sm font-bold text-gray-400">{t("all_categories")}</span>
            </Link>
          </div>
        </section>

        {/* البطاقات الترويجية */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {promoCards.map((card, i) => {
            const href = !card.category_id || card.category_id === "all" ? "/products" : `/category/${card.category_id}`;
            return (
              <Link
                href={href}
                key={i}
                className="rounded-[2.5rem] h-[300px] relative overflow-hidden border border-black/5 hover:shadow-lg transition-all group block"
              >
                {/* الصورة كخلفية كاملة للبطاقة */}
                <Image
                  src={img(card.image_url)}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* تدرّج شفاف لإبراز النص فوق الصورة */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* النص والزر فوق الصورة */}
                <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end text-right">
                  <h3 className="text-2xl font-black mb-4 max-w-[200px] text-white drop-shadow-md">{card.title}</h3>
                  <span
                    style={{ backgroundColor: card.btn_color || "#d4637d" }}
                    className="inline-block w-fit text-white px-6 py-2 rounded-full text-[10px] font-black shadow-sm group-hover:opacity-90 transition-opacity"
                  >
                    {card.btn_text}
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        {/* المنتجات */}
        <section className="py-20">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-black text-gray-800">{t("new_arrivals")}</h2>
            <Link href="/products" className="text-[#d4637d] font-bold text-sm underline underline-offset-8">{t("view_all")}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 group hover:shadow-xl transition-all">
                {/* الصورة والاسم والسعر داخل رابط يوديك لصفحة تفاصيل المنتج */}
                <Link href={`/product/${item.id}`} className="block">
                  <div className="h-64 relative overflow-hidden">
                    <Image src={img(item.image_url)} alt={prodName(item)} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    {item.discount_price && (
                      <div className="absolute top-5 right-5 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">{t("discount_badge")}</div>
                    )}
                    {item.is_new && (
                      <div className="absolute top-5 left-5 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full">{t("new_badge")}</div>
                    )}
                    {item.is_featured && !item.is_new && (
                      <div className="absolute top-5 left-5 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full">{t("bestseller_badge")}</div>
                    )}
                  </div>
                  <div className="px-6 pt-6 text-right">
                    <h3 className="font-bold text-gray-800 mb-3 truncate text-lg">{prodName(item)}</h3>
                    <div className="flex items-center justify-start gap-3 flex-row-reverse mb-6">
                      {item.discount_price ? (
                        <>
                          <span className="text-[#d4637d] font-black text-xl">{item.discount_price} {t("currency")}</span>
                          <span className="text-gray-300 line-through text-xs font-medium">{item.price} {t("currency")}</span>
                        </>
                      ) : (
                        <span className="text-gray-800 font-black text-xl">{item.price} {t("currency")}</span>
                      )}
                    </div>
                  </div>
                </Link>
                {/* الزر برّا الرابط عشان الضغط عليه يضيف للسلة بدون ما يفتح صفحة المنتج */}
                <div className="px-6 pb-6">
                  <AddToCartButton
                    id={item.id}
                    name={prodName(item)}
                    price={item.discount_price || item.price}
                    image_url={item.image_url}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
