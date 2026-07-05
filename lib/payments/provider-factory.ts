// lib/payments/provider-factory.ts
//
// نقطة الحقن الوحيدة (Dependency Injection) لاختيار البوابة الفعلية.
// لإضافة بوابة جديدة مستقبلاً (Tap, HyperPay, Geidea...):
//   1. أنشئ ملف جديد بـ lib/payments/providers/ يطبّق PaymentProvider بالكامل
//   2. أضف سطر واحد هنا بالـ switch
// هذا الملف هو المكان الوحيد اللي "يعرف" أسماء البوابات المتاحة.
// بقية النظام (payment-service.ts والـ API routes) لا يستورد أي Provider مباشرة إطلاقاً.

import type { PaymentProvider } from "./types";
import type { PaymentProviderName } from "./config";
import { MoyasarProvider } from "./providers/moyasar.provider";

export function createPaymentProvider(providerName: PaymentProviderName): PaymentProvider | null {
  switch (providerName) {
    case "moyasar":
      return new MoyasarProvider();

    // مستقبلاً فقط — لا تُفعّل إلا بعد إنشاء الملف المطابق:
    // case "tap":
    //   return new TapProvider();
    // case "hyperpay":
    //   return new HyperPayProvider();
    // case "geidea":
    //   return new GeideaProvider();

    case "none":
    default:
      return null;
  }
}
