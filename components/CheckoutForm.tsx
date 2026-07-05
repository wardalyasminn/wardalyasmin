"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { createOrder } from "@/lib/admin-actions";

const STORE_WHATSAPP_NUMBER = "966535609796";

export default function CheckoutForm({ deliveryFee }: { deliveryFee: string }) {
  const { items, totalPrice, clearCart } = useCart();
  const { t, dir } = useLanguage();
  const router = useRouter();

  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <main dir={dir} className="w-full bg-white min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-2xl mb-4">🛍️</p>
        <h1 className="text-xl font-black text-gray-800 mb-2">{t("cart_empty_title")}</h1>
        <p className="text-gray-400 mb-8">{t("checkout_empty_desc")}</p>
        <Link
          href="/"
          className="bg-[#d4637d] text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-[#b84d65] transition-all"
        >
          {t("browse_products")}
        </Link>
      </main>
    );
  }

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) {
      setError(t("error_name"));
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setError(t("error_phone"));
      return;
    }
    if (deliveryMethod === "delivery" && !address.trim()) {
      setError(t("error_address"));
      return;
    }

    setSubmitting(true);

    try {
      await createOrder(
        {
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          delivery_type: deliveryMethod,
          address: deliveryMethod === "delivery" ? address.trim() : null,
          location_url: deliveryMethod === "delivery" ? (locationUrl.trim() || null) : null,
          total: totalPrice,
          delivery_fee: deliveryMethod === "delivery" ? Number(deliveryFee) : 0,
          notes: notes.trim() || null,
        },
        items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      );
    } catch (err) {
      // نكمل عملية إرسال الواتساب حتى لو فشل الحفظ بقاعدة البيانات
      console.error("فشل حفظ الطلب بقاعدة البيانات:", err);
    }

    setSubmitting(false);

    const lines: string[] = [];
    lines.push(`🌸 ${t("wa_new_order")} 🌸`);
    lines.push("");
    lines.push(`${t("wa_name")} ${name}`);
    lines.push(`${t("wa_phone")} ${phone}`);
    lines.push(`${t("wa_delivery_method")} ${deliveryMethod === "delivery" ? t("wa_delivery") : t("wa_pickup")}`);
    if (deliveryMethod === "delivery") {
      lines.push(`${t("wa_address")} ${address}`);
      if (locationUrl.trim()) {
        lines.push(`📍 موقع العميل على الخريطة: ${locationUrl.trim()}`);
      }
      lines.push(`${t("wa_delivery_fee")} ${deliveryFee} ${t("currency")}`);
    }
    lines.push("");
    lines.push(t("wa_products"));
    items.forEach((item) => {
      lines.push(`- ${item.name} × ${item.quantity} = ${item.price * item.quantity} ${t("currency")}`);
      if (item.image_url) lines.push(`   📷 ${item.image_url}`);
    });
    lines.push("");
    lines.push(`${t("wa_total")} ${totalPrice} ${t("currency")}`);
    if (notes.trim()) {
      lines.push("");
      lines.push(`${t("wa_notes")} ${notes}`);
    }

    const message = encodeURIComponent(lines.join("\n"));
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${message}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
    router.push("/");
  };

  return (
    <main dir={dir} className="w-full bg-white min-h-[60vh] pb-32">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-gray-800 mb-8">{t("checkout_title")}</h1>

        <div className="bg-gray-50 rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-700 mb-4">{t("order_summary")}</h2>
          <div className="flex flex-col gap-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                <span className="font-bold text-gray-800">{item.price * item.quantity} {t("currency")}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <span className="font-bold text-gray-700">{t("total")}</span>
            <span className="font-black text-[#d4637d] text-xl">{totalPrice} {t("currency")}</span>
          </div>
        </div>

        {deliveryMethod === "delivery" && (
          <div className="bg-white border border-[#f0d9e3] rounded-2xl px-6 py-3 mb-8 flex items-center justify-center">
            <p className="text-xs font-black text-gray-700 whitespace-nowrap">
              {t("delivery_fee_note")} <span className="text-[#d4637d]">{deliveryFee} {t("riyal")}</span>
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="block font-bold text-gray-700 mb-3">{t("delivery_method")}</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setDeliveryMethod("delivery")}
              className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                deliveryMethod === "delivery"
                  ? "border-[#d4637d] bg-[#fff5f8] text-[#d4637d]"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {t("delivery_option")}
            </button>
            <button
              onClick={() => setDeliveryMethod("pickup")}
              className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                deliveryMethod === "pickup"
                  ? "border-[#d4637d] bg-[#fff5f8] text-[#d4637d]"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              {t("pickup_option")}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block font-bold text-gray-700 mb-2 text-sm">{t("name_label")}</label>
            <input
              type="text"
              dir={dir}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name_placeholder")}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4637d]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2 text-sm">{t("phone_label")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phone_placeholder")}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4637d]"
            />
          </div>

          {deliveryMethod === "delivery" && (
            <>
              <div>
                <label className="block font-bold text-gray-700 mb-2 text-sm">{t("address_label")}</label>
                <textarea
                  dir={dir}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("address_placeholder")}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4637d] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2 text-sm">
                  📍 رابط الموقع على قوقل ماب (اختياري)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4637d] text-left"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  يسهّل على مندوب التوصيل الوصول لموقعك بدقة
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-2 text-sm">{t("notes_label")}</label>
            <textarea
              dir={dir}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notes_placeholder")}
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4637d] resize-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[#25D366] text-white py-4 rounded-full font-black text-lg shadow-xl hover:bg-[#1ea952] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "جاري الإرسال..." : t("submit_whatsapp")}
        </button>
      </div>
    </main>
  );
}
