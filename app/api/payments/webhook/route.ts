// app/api/payments/webhook/route.ts
//
// مسار جديد بالكامل لاستقبال إشعارات بوابة الدفع (Webhooks).
// رابطه يُسجَّل بلوحة تحكم البوابة نفسها (مثال Moyasar):
//   https://wardalyasmin.onrender.com/api/payments/webhook

import { NextRequest, NextResponse } from "next/server";
import { handlePaymentWebhook } from "@/lib/payments/payment-service";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const headers: Record<string, string | undefined> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const result = await handlePaymentWebhook(rawBody, headers);

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
