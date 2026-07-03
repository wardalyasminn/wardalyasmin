"use client";
import { useState } from "react";
import { Category } from "@/lib/types";
import { saveCategory, deleteCategory } from "@/lib/admin-actions";
import ImageUploader from "./ImageUploader";
import Image from "next/image";

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [loading, setLoading] = useState(false);

  // حفظ القسم (إضافة أو تعديل)
  const handleSave = async () => {
    if (!formData.name || !formData.image_url) {
      return alert("يرجى كتابة اسم القسم واختيار صورة له");
    }
    setLoading(true);
    try {
      await saveCategory(formData);
      alert("تم حفظ القسم بنجاح");
      window.location.reload();
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  // حذف القسم
  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم؟ سيؤدي ذلك لعدم ظهور منتجاته في الموقع بشكل صحيح.")) {
      await deleteCategory(id);
      window.location.reload();
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8">إدارة أقسام المتجر</h1>

        {/* 1. نموذج الإضافة والتعديل */}
        <div className="bg-[#fff5f0]/50 p-6 md:p-10 rounded-[3rem] border border-orange-50 mb-12">
          <h2 className="text-lg font-bold mb-6 text-[#d4637d]">
            {formData.id ? "تعديل بيانات القسم" : "إضافة قسم (تصنيف) جديد"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* رفع الأيقونة */}
            <div>
              <label className="block text-xs font-black text-gray-400 mb-4 mr-4">أيقونة القسم (دائرية)</label>
              <div className="max-w-[200px] mx-auto md:mr-0">
                <ImageUploader 
                  onUpload={(url) => setFormData({ ...formData, image_url: url })} 
                  defaultImage={formData.image_url} 
                />
              </div>
            </div>

            {/* اسم القسم */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 mr-2">اسم القسم</label>
                <input 
                  className="w-full p-5 bg-white rounded-2xl shadow-sm outline-none border-none focus:ring-2 focus:ring-[#d4637d]" 
                  placeholder="مثلاً: ورد مع شوكولاته"
                  value={formData.name || ""}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[#d4637d] text-white font-black py-5 rounded-2xl shadow-xl shadow-pink-100 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {loading ? "جاري المعالجة..." : (formData.id ? "تحديث القسم" : "إضافة القسم للمتجر")}
              </button>

              {formData.id && (
                <button onClick={() => setFormData({})} className="w-full text-gray-400 font-bold text-xs hover:underline">
                  إلغاء التعديل
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. عرض الأقسام الحالية (مثل شكل الموقع الرئيسي) */}
        <h2 className="text-xl font-bold mb-8 text-gray-800 border-r-4 border-[#d4637d] pr-3">الأقسام الحالية</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-50 flex flex-col items-center group relative hover:shadow-md transition-all">
              {/* أيقونة القسم الدائرية */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-sm overflow-hidden relative mb-4 group-hover:border-[#d4637d] transition-all">
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-[10px] font-bold text-center px-1">
                    لا توجد صورة
                  </div>
                )}
              </div>
              
              <span className="font-bold text-gray-700 text-center text-sm mb-4">{cat.name}</span>

              {/* أزرار التحكم */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setFormData(cat)}
                  className="p-2 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                  title="تعديل"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 bg-red-50 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all"
                  title="حذف"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">لا توجد أقسام مضافة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
