import {
  getProductsAdmin,
  getCategoriesAdmin,
  getSettingsAdmin,
  getPaymentMethodsAdmin,
  getDiscountsAdmin,
} from '@/lib/admin-actions'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const [products, categories, settings, paymentMethods, discounts] = await Promise.all([
    getProductsAdmin(),
    getCategoriesAdmin(),
    getSettingsAdmin(),
    getPaymentMethodsAdmin(),
    getDiscountsAdmin(),
  ])

  return (
    <AdminDashboard
      initialProducts={products}
      initialCategories={categories}
      initialSettings={settings}
      initialPaymentMethods={paymentMethods}
      initialDiscounts={discounts}
    />
  )
}
