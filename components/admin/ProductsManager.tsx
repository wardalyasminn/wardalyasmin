"use client";
import { useState } from "react";
import { Product, Category } from "@/lib/types";
import { saveProduct, deleteProduct, toggleProductStatus } from "@/lib/admin-actions";
import MultiImageUploader from "./MultiImageUploader";
import Image from "next/image";

// يحوّل images_json (نص JSON) إلى مصفوفة روابط صور بأمان
function parseImages(json: string | undefined, fallbackUrl?: string): string[] {
  if (json) {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
    } catch {
      // تجاهل أي خطأ بارسنق ونكمل على fallback
    }
  }
  return fallbackUrl ? [fallbackUrl] : [];
}

export default function ProductsManager({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: Product[], 
  categories: Category[] 
}) {
  const [products, setProducts] = useState(initialProducts);
  const [formData, setFormData] = useState<Partial<Product>>({ is_available: true });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleEditClick = (p: Product) => {
    setFormData(p);
    setImages(parseImages(p.images_json, p.image_url));
  };

  const resetForm = () => {
    setFormData({ is_available: true });
    setImages([]);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || images.length === 0 || !formData.category_id) {
      return alert("يرجى إكمال جميع البيانات الأساسية وصورة واحدة على الأقل");
    }
    setLoading(true);
    try {
      const payload: Partial<Product> = {
        ...formData,
        // أول صورة بالمصفوفة تبقى صورة الغلاف (image_url) لضمان استمرار عمل
        // الصفحة الرئيسية وبطاقات المنتجات بدون أي تعديل عليها
        image_url: images[0],
        images_json: JSON.stringify(images),
        stock_quantity: formData.stock_quantity != null ? Number(formData.stock_quantity) : 0,
      };
      await saveProduct(payload);
      alert("تم حفظ المنتج بنجاح");
      window.location.reload();
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
      await deleteProduct(id);
      window.location.reload();
    }
  };

  const handleToggle = async (id: string, status: boolean) => {
    await toggleProductStatus(id, status);
    window.location.reload();
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8">إدارة المنتجات</h1>

        <div className="bg-gray-50/50 p-6 md:p-8 rounded-[3rem] border border-gray-100 mb-12 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-[#d4637d]">
            {formData.id ? "تعديل المنتج الحالي" : "إضافة منتج جديد للمتجر"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <label className="block text-xs font-black text-gray-400 mb-3 mr-4 uppercase">صور المنتج</label>
              <MultiImageUploader images={images} onChange={handleImagesChange} />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">اسم المنتج</label>
                <input 
                  className="w-full p-4 bg-white rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#d4637d] border-none" 
                  placeholder="مثلاً: باقة جوري ملكية"
                  value={formData.name || ""}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">التصنيف</label>
                <select 
                  className="w-full p-4 bg-white rounded-2xl shadow-sm outline-none border-none"
                  value={formData.category_id || ""}
                  onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">اختر القسم...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">السعر الأصلي</label>
                <input 
                  type="number"
                  className="w-full p-4 bg-white rounded-2xl shadow-sm border-none"
                  placeholder="0.00"
                  value={formData.price || ""}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">السعر بعد الخصم (اختياري)</label>
                <input 
                  type="number"
                  className="w-full p-4 bg-white rounded-2xl shadow-sm border-none text-[#d4637d] font-bold"
                  placeholder="اتركه فارغاً إذا لا يوجد خصم"
                  value={formData.discount_price || ""}
                  onChange={e => setFormData({ ...formData, discount_price: Number(e.target.value) })}
                />
              </div>

              {/* رمز المنتج (SKU) والكمية بالمخزون — تجهيز لربط الكاشير مستقبلاً */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">رمز المنتج (SKU) — اختياري</label>
                <input 
                  className="w-full p-4 bg-white rounded-2xl shadow-sm border-none"
                  placeholder="مثلاً: FLW-0012"
                  dir="ltr"
                  value={formData.sku || ""}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">الكمية المتوفرة بالمخزون</label>
                <input 
                  type="number"
                  min={0}
                  className="w-full p-4 bg-white rounded-2xl shadow-sm border-none"
                  placeholder="0"
                  value={formData.stock_quantity ?? ""}
                  onChange={e => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                />
              </div>

              {/* وصف المنتج — يظهر للعميل بصفحة تفاصيل المنتج */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">وصف المنتج (يظهر للعميل بصفحة المنتج)</label>
                <textarea
                  className="w-full p-4 bg-white rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#d4637d] border-none resize-none"
                  placeholder="مثلاً: باقة ورد جوري طبيعي مع شوكولاتة فاخرة، مثالية للمناسبات الخاصة..."
                  rows={4}
                  value={formData.description || ""}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* الوسوم الترويجية */}
              <div className="md:col-span-2 flex gap-6 bg-white p-4 rounded-2xl shadow-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 accent-[#d4637d]"
                    checked={formData.is_new || false}
                    onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                  />
                  <span className="text-sm font-bold text-gray-600">✨ وصلنا حديثاً</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 accent-[#d4637d]"
                    checked={formData.is_featured || false}
                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  <span className="text-sm font-bold text-gray-600">🔥 الأكثر مبيعاً</span>
                </label>
              </div>

              <div className="md:col-span-2 pt-2">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-[#d4637d] text-white font-black py-4 rounded-2xl shadow-xl shadow-pink-100 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {loading ? "جاري المعالجة..." : (formData.id ? "تحديث بيانات المنتج" : "إضافة المنتج للمتجر")}
                </button>
                {formData.id && (
                  <button 
                    onClick={resetForm}
                    className="w-full mt-3 text-gray-400 font-bold text-xs hover:underline"
                  >
                    إلغاء التعديل والعودة للإضافة
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-xs uppercase">
                  <th className="p-6">المنتج</th>
                  <th className="p-6">التصنيف</th>
                  <th className="p-6">السعر</th>
                  <th className="p-6">المخزون</th>
                  <th className="p-6">الوسوم</th>
                  <th className="p-6">الحالة</th>
                  <th className="p-6 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/30 transition-colors ${!p.is_available ? 'opacity-50 grayscale' : ''}`}>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 relative rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={p.image_url || ""} alt="" fill className="object-cover" />
                          {(() => {
                            const count = parseImages(p.images_json, p.image_url).length;
                            return count > 1 ? (
                              <div className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                                +{count - 1}
                              </div>
                            ) : null;
                          })()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700 truncate max-w-[150px]">{p.name}</span>
                          {p.sku && <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {categories.find(c => c.id === p.category_id)?.name || "غير محدد"}
                      </span>
                    </td>
                    <td className="p-6 text-sm">
                      <div className="flex flex-col">
                        <span className={p.discount_price ? "text-[10px] text-gray-300 line-through" : "font-bold text-gray-700"}>{p.price} ر.س</span>
                        {p.discount_price && <span className="text-[#d4637d] font-black">{p.discount_price} ر.س</span>}
                      </div>
                    </td>
                    <td className="p-6">
                      {p.stock_quantity == null ? (
                        <span className="text-[10px] font-bold text-gray-300">غير محدد</span>
                      ) : p.stock_quantity === 0 ? (
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-red-50 text-red-500">نفذت الكمية</span>
                      ) : p.stock_quantity <= 5 ? (
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-amber-50 text-amber-600">{p.stock_quantity} قطع متبقية</span>
                      ) : (
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-50 text-green-500">{p.stock_quantity} متوفر</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex gap-1 flex-wrap">
                        {p.is_new && <span className="text-[10px] font-black px-2 py-1 rounded-full bg-blue-50 text-blue-500">✨ جديد</span>}
                        {p.is_featured && <span className="text-[10px] font-black px-2 py-1 rounded-full bg-amber-50 text-amber-600">🔥 مبيعاً</span>}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${p.is_available ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                        {p.is_available ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEditClick(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onClick={() => handleToggle(p.id, p.is_available!)} className={`p-2 rounded-xl transition-colors ${p.is_available ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
