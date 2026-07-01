import { supabase } from '@/lib/supabase'
import { Product, Category, Settings, PaymentMethod } from '@/lib/types'
import StorePage from '@/components/StorePage'

async function getData() {
  const [productsRes, categoriesRes, settingsRes, paymentMethodsRes] = await Promise.all([
    supabase.from('products').select('*, category:categories(*)').eq('is_available', true).order('sort_order'),
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('settings').select('*'),
    supabase.from('payment_methods').select('*').eq('is_active', true).order('sort_order'),
  ])

  const settings: Settings = {
    delivery_fee: '15',
    min_order: '50',
    whatsapp: '966535609796',
    store_open: 'true',
    work_open_time: '',
    work_close_time: '',
  }

  settingsRes.data?.forEach((s) => {
    settings[s.key as keyof Settings] = s.value
  })

  return {
    products: (productsRes.data as Product[]) || [],
    categories: (categoriesRes.data as Category[]) || [],
    settings,
    paymentMethods: (paymentMethodsRes.data as PaymentMethod[]) || [],
  }
}

export default async function Home() {
  const { products, categories, settings, paymentMethods } = await getData()
  return (
    <StorePage
      products={products}
      categories={categories}
      settings={settings}
      paymentMethods={paymentMethods}
    />
  )
}