"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSlide } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

const FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const { t, language } = useLanguage();
  const [index, setIndex] = useState(0);
  const list = slides && slides.length > 0 ? slides : [];

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [list.length]);

  if (list.length === 0) return null;

  const slide = list[index];
  const img = (url?: string) => (url && url !== "" ? url : FALLBACK);
  const isRtl = language !== "en";

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-4 md:py-6 bg-white">
      <section className="relative w-full aspect-[1716/916] max-h-[560px] overflow-hidden rounded-2xl md:rounded-3xl bg-[#FDF0F3]">
        {list.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {/* الصورة تملأ كامل المساحة، مع تثبيت نقطة التركيز على الجزء العلوي/الأوسط
                (حيث الورد عادة) لتقليل أي قص من الأعلى قدر الإمكان */}
            <Image
              src={img(s.image_url)}
              alt={s.title || "صورة ترويجية"}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 25%" }}
              priority={i === 0}
            />

            {/* تعتيم يتركّز بجهة النص فقط، ويبقي باقي الصورة واضحة */}
            <div
              className="absolute inset-0"
              style={{
                background: isRtl
                  ? "linear-gradient(to right, rgba(253,240,243,0) 0%, rgba(253,240,243,0) 42%, rgba(253,240,243,0.85) 68%, rgba(253,240,243,0.96) 100%)"
                  : "linear-gradient(to left, rgba(253,240,243,0) 0%, rgba(253,240,243,0) 42%, rgba(253,240,243,0.85) 68%, rgba(253,240,243,0.96) 100%)",
              }}
            />
          </div>
        ))}

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className={`w-full md:max-w-[46%] ${isRtl ? "text-right md:mr-0 md:ml-auto" : "text-left md:ml-0 md:mr-auto"}`}>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-3 transition-all duration-700">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-lg md:text-2xl font-bold text-[#E8638A] mb-3">
                {slide.subtitle}
              </p>
            )}
            <p className="text-sm md:text-lg text-slate-500 mb-8 leading-relaxed">
              {slide.desc}
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#E8638A] text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-sm md:text-lg shadow-xl hover:bg-[#d4547a] transition-all"
            >
              {t("shop_now")}
            </Link>
          </div>
        </div>

        {list.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {list.map((_, i) => (
              <button
                key={i}
                aria-label={language === "ar" ? `الشريحة ${i + 1}` : `Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "bg-[#E8638A] w-7" : "bg-gray-300 w-2.5"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
