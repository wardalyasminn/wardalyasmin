export interface Category {
  id: string
  name: string
  name_en?: string
  icon?: string
  icon_type?: 'emoji' | 'image'
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Discount {
  id: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  code?: string
  percentage_value?: number
  fixed_value?: number
  product_ids?: string[]
  category_ids?: string[]
  min_purchase?: number
  max_uses?: number
  used_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  name_en?: string
  description?: string
  price: number
  original_price?: number
  image_url?: string
  // JSON.stringify(string[]) لمصفوفة روابط صور إضافية للمنتج (Gallery)
  // أول صورة بالمصفوفة تُستخدم أيضًا كنسخة من image_url (صورة الغلاف)
  images_json?: string
  category_id?: string
  category?: Category
  is_available: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  delivery_type: 'pickup' | 'delivery'
  address?: string
  total: number
  delivery_fee: number
  discount_applied?: string
  discount_amount?: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  notes?: string
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  price: number
  quantity: number
}

export interface PaymentMethod {
  id: string
  name: string
  image_url: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Settings {
  delivery_fee: string
  min_order: string
  whatsapp: string
  store_open: string
  work_open_time: string
  work_close_time: string
  logo_url?: string
  instagram_url?: string
  twitter_url?: string
  snapchat_url?: string
  // JSON.stringify(HeroSlide[]) - يُقرأ ويُكتب من صفحة /admin/content
  hero_slides_json?: string
  // JSON.stringify(PromoCard[]) - يُقرأ ويُكتب من صفحة /admin/content
  promo_cards_json?: string
  free_shipping_categories?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

// ---------- محتوى الواجهة الرئيسية (هيرو + بطاقات ترويجية) ----------

export interface HeroSlide {
  image_url: string
  title: string
  subtitle: string
  desc: string
}

export interface PromoCard {
  image_url: string
  title: string
  btn_text: string
  btn_color: string
  // فارغ أو 'all' = يفتح كل المنتجات، أو id تصنيف محدد
  category_id: string
}
