"use client";
import { useState } from "react";
import { Order } from "@/lib/types";
import { updateOrderStatus } from "@/lib/admin-actions";

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "قيد التجهيز",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-500",
  confirmed: "bg-amber-50 text-amber-600",
  delivered: "bg-green-50 text-green-500",
  cancelled: "bg-red-50 text-red-500",
};

const STATUS_OPTIONS = ["pending", "confirmed", "delivered", "cancelled"];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString("ar-SA", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function OrdersManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus as Order["status"] } : o))
      );
    } catch (err) {
      alert("حدث خطأ أثناء تحديث حالة الطلب");
    } finally {
      setUpdatingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-4 md:p-8 bg-white min-h-screen" dir="rtl">
        <div className="max-w-6xl mx-auto text-center py-24 text-gray-400">
          لا توجد طلبات بعد
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8">إدارة الطلبات</h1>

        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="bg-gray-50/50 border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm"
              >
                {/* رأس الطلب */}
                <div
                  className="p-5 md:p-6 flex flex-wrap items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-[140px]">
                    <div className="font-bold text-gray-800">{order.customer_name}</div>
                    <div className="text-xs text-gray-400" dir="ltr">{order.customer_phone}</div>
                  </div>

                  <div className="text-xs text-gray-400 min-w-[110px]">
                    {formatDate(order.created_at)}
                  </div>

                  <div className="text-sm font-bold text-gray-700 min-w-[90px]">
                    {order.total} ر.س
                  </div>

                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white border border-gray-100 text-gray-500">
                    {order.delivery_type === "delivery" ? "🚚 توصيل" : "🏠 استلام"}
                  </span>

                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {/* تفاصيل الطلب */}
                {isExpanded && (
                  <div className="px-5 md:px-6 pb-6 border-t border-gray-100 pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                      <div>
                        {order.delivery_type === "delivery" && order.address && (
                          <div className="mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase mb-1">العنوان</div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{order.address}</p>
                          </div>
                        )}
                        {order.location_url && (
                          <a
                            href={order.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:underline mb-3"
                          >
                            📍 فتح الموقع على الخريطة
                          </a>
                        )}
                        {order.notes && (
                          <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase mb-1">ملاحظات</div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase mb-2">المنتجات المطلوبة</div>
                        <div className="flex flex-col gap-1.5">
                          {(order.order_items || []).map((item) => (
                            <div key={item.id} className="flex justify-between text-sm bg-white rounded-xl px-3 py-2">
                              <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
                              <span className="font-bold text-gray-800">{item.price * item.quantity} ر.س</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2 px-3">
                          <span>رسوم التوصيل</span>
                          <span>{order.delivery_fee} ر.س</span>
                        </div>
                      </div>
                    </div>

                    {/* تغيير الحالة */}
                    <div className="flex items-center gap-3 bg-white rounded-2xl p-3">
                      <span className="text-xs font-bold text-gray-500 mr-2">تغيير حالة الطلب:</span>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 max-w-[220px] p-2.5 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-[#d4637d]"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                      {updatingId === order.id && (
                        <span className="text-xs text-gray-400">جاري التحديث...</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
