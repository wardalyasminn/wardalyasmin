// app/api/payments/create/route.ts
//
// مسار API جديد بالكامل — لا يتقاطع مع أي route موجود بالمشروع.
// يُستدعى فقط لو العميل اختار صراحة خيار "الدفع الإلكتروني" (اختياري تمامًا).

import { NextRequest, NextResponse } from "next/server";
import { startOnlinePayment, isOnlinePaymentEnabled } from "@/lib/payments/payment-service";

export async function POST(request: NextRequest) {
  if (!isOnlinePaymentEnabled()) {
    return NextResponse.json(
      { success: false, error: "الدفع الإلكتروني غير مفعّل حاليًا" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    if (!body.orderId || !body.amount) {
      return NextResponse.json(
        { success: false, error: "بيانات ناقصة: orderId و amount مطلوبان" },
        { status: 400 }
      );
    }

    const result = await startOnlinePayment({
      orderId: body.orderId,
      amount: Number(body.amount),
      description: body.description,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      callbackUrl: body.callbackUrl,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
