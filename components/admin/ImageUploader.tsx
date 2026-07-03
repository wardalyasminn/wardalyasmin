"use client";
import { useState, useRef, useEffect } from "react";
import { uploadImage } from "@/lib/admin-actions";
import Image from "next/image";

// يدعم طريقتين للاستخدام:
// 1) <ImageUploader onUpload={(url) => ...} defaultImage={product.image_url} />
// 2) <ImageUploader value={slide.image_url} onChange={(url) => ...} />
export default function ImageUploader({
  onUpload,
  defaultImage,
  value,
  onChange,
}: {
  onUpload?: (url: string) => void;
  defaultImage?: string;
  value?: string;
  onChange?: (url: string) => void;
}) {
  // لو فيه value ممررة، نعتبر المكوّن "متحكم" (controlled) من الأب
  const isControlled = value !== undefined;

  const [internalPreview, setInternalPreview] = useState(defaultImage || value || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // لو المكوّن متحكم، تابع أي تغيير بالـ value القادمة من الأب
  useEffect(() => {
    if (isControlled) {
      setInternalPreview(value || "");
    }
  }, [value, isControlled]);

  const preview = isControlled ? value || "" : internalPreview;

  const emitChange = (url: string) => {
    // نستدعي كل الاحتمالات الموجودة، اللي مو ممرر ما راح يسوي شي
    onUpload?.(url);
    onChange?.(url);
    if (!isControlled) {
      setInternalPreview(url);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadImage(formData);
      emitChange(url);
    } catch (err) {
      alert("حدث خطأ أثناء رفع الصورة، تأكد من إعدادات Storage في سوبابيز");
      console.error(err);
    } finally {
      setLoading(false);
      // نفرغ قيمة الـ input عشان لو رفعت نفس الملف مرة ثانية يشتغل onChange
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = () => {
    emitChange("");
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative w-full h-48 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden group transition-all ${
          loading ? "opacity-50" : "hover:border-brand/50"
        }`}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full">
                تغيير الصورة
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="animate-spin"
                  width="24"
                  height="24"
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
                  width="32"
                  height="32"
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
                <span className="text-xs font-bold text-gray-400">ارفع صورة من المعرض</span>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />

      {preview && !loading && (
        <button
          type="button"
          onClick={handleDelete}
          className="text-[10px] text-red-400 font-bold hover:underline"
        >
          حذف الصورة
        </button>
      )}
    </div>
  );
}
