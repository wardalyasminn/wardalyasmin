import {
  getProductsAdmin,
  getCategoriesAdmin,
  getSettingsAdmin,
  getPaymentMethodsAdmin,
} from '@/lib/admin-actions'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const [products, categories, settings, paymentMethods] = await Promise.all([
    getProductsAdmin(),
    getCategoriesAdmin(),
    getSettingsAdmin(),
    getPaymentMethodsAdmin(),
  ])

  return (
    <AdminDashboard
      initialProducts={products}
      initialCategories={categories}
      initialSettings={settings}
      initialPaymentMethods={paymentMethods}
    />
  )
}