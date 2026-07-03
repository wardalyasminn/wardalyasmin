"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const validImages = images.length > 0 ? images : [FALLBACK];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* الصورة الرئيسية */}
      <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={validImages[activeIndex]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* صور مصغّرة للتبديل */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                activeIndex === i ? "border-[#d4637d]" : "border-gray-100"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
