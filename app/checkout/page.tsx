import { getPublicSettings } from "@/lib/public-actions";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const settings = await getPublicSettings();
  const deliveryFee = settings.delivery_fee || "15";

  return <CheckoutForm deliveryFee={deliveryFee} />;
}
