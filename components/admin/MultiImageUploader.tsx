"use client";
import { useState, useRef } from "react";
import { uploadImage } from "@/lib/admin-actions";
import Image from "next/image";

// مكوّن رفع عدة صور للمنتج، يشتغل بشكل مستقل عن ImageUploader.tsx الأصلي
// (اللي يستمر يُستخدم بمكانه بالهيرو/البطاقات الترويجية/التصنيفات بدون أي تغيير)
//
// الاستخدام:
// <MultiImageUploader images={images} onChange={(newImages) => setImages(newImages)} />
//
// أول صورة بالمصفوفة تُعتبر دائماً "صورة الغلاف" (تُستخدم بعمود image_url)
export default function MultiImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      // نرفع الصور الواحدة بعد الثانية (مو بالتوازي) لتجنب أي ضغط على Supabase
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const url = await uploadImage(formData);
        uploadedUrls.push(url);
      }
      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      alert("حدث خطأ أثناء رفع إحدى الصور، تأكد من إعدادات Storage في سوبابيز");
      console.error(err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* شبكة الصور الحالية */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group"
            >
              <Image src={url} alt={`صورة ${index + 1}`} fill className="object-cover" />

              {index === 0 && (
                <div className="absolute top-2 right-2 bg-[#d4637d] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                  الغلاف
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="bg-white/90 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-xs font-black disabled:opacity-30 hover:bg-white"
                    title="تحريك لليمين (الأسبقية)"
                  >
                    ➜
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, "down")}
                    disabled={index === images.length - 1}
                    className="bg-white/90 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-xs font-black disabled:opacity-30 hover:bg-white"
                    title="تحريك للخلف"
                  >
                    ←
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-black hover:bg-red-600"
                  title="حذف الصورة"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* زر إضافة صور جديدة */}
      <div
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative w-full h-32 border-2 border-dashed border-gray-200 rounded-[1.5rem] bg-gray-50 flex items-center justify-center cursor-pointer transition-all ${
          loading ? "opacity-50" : "hover:border-brand/50"
        }`}
      >
        <div className="text-center p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <svg
                className="animate-spin"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4637d"
                strokeWidth="3"
              >
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
              </svg>
              <span className="text-xs font-bold text-gray-500">جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="text-xs font-bold text-gray-400">
                {images.length > 0 ? "إضافة صور أخرى" : "ارفع صورة أو أكثر من المعرض"}
              </span>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}
