import {
  getProductsAdmin,
  getCategoriesAdmin,
  getSettingsAdmin,
  getPaymentMethodsAdmin,
  getOrdersAdmin,
} from '@/lib/admin-actions'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const [products, categories, settings, paymentMethods, orders] = await Promise.all([
    getProductsAdmin(),
    getCategoriesAdmin(),
    getSettingsAdmin(),
    getPaymentMethodsAdmin(),
    getOrdersAdmin(),
  ])

  return (
    <AdminDashboard
      initialProducts={products}
      initialCategories={categories}
      initialSettings={settings}
      initialPaymentMethods={paymentMethods}
      initialOrders={orders}
    />
  )
}