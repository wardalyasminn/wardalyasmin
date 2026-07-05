// app/api/payments/status/[orderId]/route.ts
//
// مسار اختياري للاستعلام عن حالة دفع طلب معيّن (مثلاً بصفحة "شكرًا" بعد الدفع)

import { NextRequest, NextResponse } from "next/server";
import { getOnlinePaymentStatus } from "@/lib/payments/payment-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const payment = await getOnlinePaymentStatus(orderId);

  if (!payment) {
    return NextResponse.json({ success: false, error: "لا توجد عملية دفع مسجّلة لهذا الطلب" }, { status: 404 });
  }

  return NextResponse.json({ success: true, payment });
}
